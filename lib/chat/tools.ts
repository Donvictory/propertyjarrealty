import 'server-only';
import { Resend } from 'resend';
import { getProperties } from '@/lib/properties';
import { getCampaignContent } from '@/lib/campaign';
import { categoriesOf, formatCardPrice, toPropertyCard, type PropertyCategory } from '@/lib/property-display';
import { parsePriceNGN } from '@/lib/currency';
import { escapeHtml, EMAIL_RE } from '@/lib/email-html';
import { db } from '@/lib/firebase-admin';
import type { Property } from '@/lib/types';

/** A listing the assistant looked at, sent to the browser so it can show a card under the reply. */
export type ChatPropertyCard = { id: string; title: string; location: string; price: string; url: string; image: string };

/** Provider-neutral tool definition: JSON Schema parameters work for both Gemini and Grok. */
export type ToolDef = {
  name: string;
  description: string;
  parameters: { type: 'object'; properties: Record<string, unknown>; required?: string[] };
};

export const TOOLS: ToolDef[] = [
  {
    name: 'search_properties',
    description:
      "Search PropertyJar Realty's current listings. Use for any question about what properties, land, homes, commercial spaces or short-lets we have, where, and at what price. Returns up to 6 matches with price, location, a short summary and a url. Call with no arguments to list everything.",
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text keywords, e.g. "duplex", "Ibeju-Lekki", "Ambience".' },
        category: {
          type: 'string',
          enum: ['land', 'residential', 'commercial', 'shortlet'],
          description: 'Limit to one kind of property.',
        },
        location: { type: 'string', description: 'Area, city or state, e.g. "Lekki", "Epe", "Abuja".' },
        max_budget_ngn: { type: 'number', description: 'Highest price the visitor can pay, in naira.' },
      },
    },
  },
  {
    name: 'get_property',
    description:
      'Get full details of one PropertyJar listing by its id (from search_properties): description, highlights, location advantages, every size and price option, payment plan, and short-let details.',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string', description: 'The listing id.' } },
      required: ['id'],
    },
  },
  {
    name: 'get_investment_options',
    description:
      "PropertyJar's published investment options and investor packages (from the /campaign page), plus which listings are part of the campaign. Projections in it are the company's marketing projections, not guarantees.",
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'submit_lead',
    description:
      "Send the visitor's contact details to the PropertyJar sales team so they can call back. Only call after the visitor has given their name and phone number and agreed to be contacted.",
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Visitor's full name." },
        phone: { type: 'string', description: 'Phone or WhatsApp number, with country code if given.' },
        email: { type: 'string', description: 'Email address, if given.' },
        interest: { type: 'string', description: 'What they want, e.g. "2 plots at Ambience II on the 12-month plan".' },
        preferred_contact: { type: 'string', description: 'Call, WhatsApp or email, and a good time, if given.' },
      },
      required: ['name', 'phone', 'interest'],
    },
  },
];

const urlOf = (p: Property) => `/campaign/${encodeURIComponent(p.id)}`;
const clip = (s: string | undefined | null, n: number) => {
  const t = (s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

function cardOf(p: Property): ChatPropertyCard {
  const card = toPropertyCard(p);
  return { id: p.id, title: p.title, location: card.location, price: formatCardPrice(card), url: urlOf(p), image: card.image };
}

/** Cheapest price we can parse across the headline price and every size option, in naira. */
function minPrice(p: Property): number {
  const all = [p.price, ...(p.pricingOptions ?? []).map((o) => o.price)].map((s) => parsePriceNGN(s ?? '')).filter((n) => n > 0);
  return all.length ? Math.min(...all) : 0;
}

type Ctx = { seen: Map<string, ChatPropertyCard>; leads: number; page?: string };

export function newToolContext(page?: string): Ctx {
  return { seen: new Map(), leads: 0, page };
}

async function searchProperties(args: Record<string, unknown>, ctx: Ctx) {
  const all = await getProperties();
  const query = typeof args.query === 'string' ? args.query.toLowerCase() : '';
  const category = typeof args.category === 'string' ? (args.category as PropertyCategory) : null;
  const location = typeof args.location === 'string' ? args.location.toLowerCase().trim() : '';
  const budget = typeof args.max_budget_ngn === 'number' && args.max_budget_ngn > 0 ? args.max_budget_ngn : 0;
  const words = query.split(/[^a-z0-9]+/).filter((w) => w.length > 2);

  // Exact area first; if none, fall back to listings sharing a place word ("Ibeju-Lekki" → anything in Lekki).
  const areaWords = location.split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !['lagos', 'state', 'road', 'phase'].includes(w));
  const exactArea = (p: Property) => p.location.toLowerCase().includes(location) || p.title.toLowerCase().includes(location);
  const nearArea = (p: Property) => areaWords.some((w) => `${p.location} ${p.title}`.toLowerCase().includes(w));
  const areaMatch = !location ? null : all.some(exactArea) ? exactArea : nearArea;

  const scored = all
    .filter((p) => !category || categoriesOf(p).includes(category))
    .filter((p) => !areaMatch || areaMatch(p))
    .filter((p) => {
      if (!budget) return true;
      const min = minPrice(p);
      return min === 0 || min <= budget;
    })
    .map((p) => {
      const hay = `${p.title} ${p.location} ${p.type} ${p.category ?? ''} ${p.tag ?? ''} ${p.description}`.toLowerCase();
      return { p, score: words.length ? words.filter((w) => hay.includes(w)).length : 1 };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const results = scored.map(({ p }) => {
    const card = cardOf(p);
    ctx.seen.set(p.id, card);
    return {
      id: p.id,
      title: p.title,
      kind: toPropertyCard(p).kind,
      location: p.location,
      price: card.price,
      price_options: (p.pricingOptions ?? []).slice(0, 4).map((o) => `${o.size}: ${o.price}`),
      payment_plan: clip(p.installmentPlan, 160) || undefined,
      summary: clip(p.description, 220),
      url: card.url,
    };
  });

  if (results.length) {
    return {
      results,
      total_listings: all.length,
      ...(areaMatch === nearArea
        ? { note: `No listing names "${location}" exactly; these are in nearby or related areas. Say so.` }
        : {}),
    };
  }
  return {
    results: [],
    note: 'Nothing matched those filters. Other current listings are below; suggest the closest ones or offer to connect them with the team.',
    other_listings: all.slice(0, 8).map((p) => {
      const card = cardOf(p);
      ctx.seen.set(p.id, card);
      return { id: p.id, title: p.title, location: p.location, price: card.price, url: card.url };
    }),
  };
}

async function getProperty(args: Record<string, unknown>, ctx: Ctx) {
  const id = typeof args.id === 'string' ? args.id : '';
  const p = (await getProperties()).find((x) => x.id === id);
  if (!p) return { error: 'No listing with that id. Use search_properties to find the right one.' };
  const card = cardOf(p);
  ctx.seen.set(p.id, card);
  const s = p.shortLetDetails;
  return {
    id: p.id,
    title: p.title,
    kind: toPropertyCard(p).kind,
    location: p.location,
    price: card.price,
    tag: p.tag ?? undefined,
    beds: p.beds ?? undefined,
    baths: p.baths ?? undefined,
    size: p.sqft ?? undefined,
    description: clip(p.description, 1200),
    highlights: p.highlights?.slice(0, 10),
    location_advantages: p.locationAdvantages?.slice(0, 8),
    price_options: p.pricingOptions?.map((o) => `${o.size}: ${o.price}`),
    payment_plan: p.installmentPlan,
    best_for: p.bestFor,
    what_you_can_build: p.whatYouCanBuild,
    brochure: p.brochureUrl ? 'A brochure can be downloaded on the listing page.' : undefined,
    short_let: s
      ? {
          price_per_night: s.pricePerNight ?? s.nightlyRate,
          caution_deposit: s.cautionDeposit,
          max_guests: s.maxGuests ?? s.guestCapacity,
          check_in: s.checkIn,
          check_out: s.checkOut,
          sleeping: s.sleepingArrangements,
          booking: 'Book on the listing page or through the team.',
        }
      : undefined,
    url: card.url,
  };
}

async function getInvestmentOptions(ctx: Ctx) {
  const [content, all] = await Promise.all([getCampaignContent(), getProperties()]);
  const campaign = all.filter((p) => p.isCampaign);
  for (const p of campaign) ctx.seen.set(p.id, cardOf(p));
  return {
    page: '/campaign',
    why_lagos: content.whyInvestPoints,
    published_projection_not_guaranteed: `${content.projectedRoi} (${content.roiSubtext})`,
    investment_options: content.investmentOptions,
    investor_packages: content.offerStack.map(({ title, points }) => ({ title, points })),
    campaign_listings: campaign.map((p) => ({ id: p.id, title: p.title, location: p.location, price: cardOf(p).price, url: urlOf(p) })),
  };
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function submitLead(args: Record<string, unknown>, ctx: Ctx) {
  const str = (k: string, n: number) => (typeof args[k] === 'string' ? (args[k] as string).replace(/[\r\n]+/g, ' ').trim().slice(0, n) : '');
  const name = str('name', 100);
  const phone = str('phone', 30);
  const email = str('email', 200);
  const interest = str('interest', 500);
  const preferred = str('preferred_contact', 200);

  if (ctx.leads >= 1) return { ok: false, error: 'Already sent for this conversation.' };
  if (name.length < 2) return { ok: false, error: 'Need the visitor’s name.' };
  if (phone.replace(/\D/g, '').length < 7) return { ok: false, error: 'Need a valid phone number.' };
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: 'That email address looks wrong; ask again or leave it out.' };
  ctx.leads += 1;

  const lead = { name, phone, email, interest, preferredContact: preferred, page: ctx.page ?? '', source: 'chat', createdAt: new Date().toISOString() };
  const saved = db ? db.collection('chat_leads').add(lead).then(() => true, (e) => (console.error('chat lead save', e), false)) : Promise.resolve(false);

  const e = Object.fromEntries(Object.entries(lead).map(([k, v]) => [k, escapeHtml(String(v))])) as Record<keyof typeof lead, string>;
  const mailed = resend
    ? resend.emails
        .send({
          from: 'PropertyJar Leads <sales@propertyjarrealty.com>',
          to: ['sales@propertyjarrealty.com'],
          ...(email ? { replyTo: email } : {}),
          subject: `New chat lead: ${name}`,
          html: `<div style="font-family:sans-serif;padding:20px;color:#121212">
  <h2 style="color:#800020">New lead from the website assistant</h2>
  <p><strong>Name:</strong> ${e.name}</p>
  <p><strong>Phone:</strong> ${e.phone}</p>
  ${email ? `<p><strong>Email:</strong> ${e.email}</p>` : ''}
  <p><strong>Interested in:</strong> ${e.interest || 'Not stated'}</p>
  ${preferred ? `<p><strong>Preferred contact:</strong> ${e.preferredContact}</p>` : ''}
  ${lead.page ? `<p><strong>Page:</strong> ${e.page}</p>` : ''}
  <p style="font-size:11px;color:#999;margin-top:30px">Captured by the AI chat on propertyjarrealty.com.</p>
</div>`,
        })
        .then(({ error }) => (error ? (console.error('chat lead email', error), false) : true), (err) => (console.error('chat lead email', err), false))
    : Promise.resolve(false);

  const [ok1, ok2] = await Promise.all([saved, mailed]);
  if (!ok1 && !ok2) {
    ctx.leads -= 1;
    return { ok: false, error: 'Could not send right now. Give them WhatsApp +234 915 386 9750 instead.' };
  }
  return { ok: true };
}

export async function runTool(name: string, args: Record<string, unknown>, ctx: Ctx): Promise<unknown> {
  try {
    switch (name) {
      case 'search_properties':
        return await searchProperties(args, ctx);
      case 'get_property':
        return await getProperty(args, ctx);
      case 'get_investment_options':
        return await getInvestmentOptions(ctx);
      case 'submit_lead':
        return await submitLead(args, ctx);
      default:
        return { error: `Unknown tool ${name}` };
    }
  } catch (err) {
    console.error(`chat tool ${name}`, err);
    return { error: 'The listings could not be loaded just now.' };
  }
}
