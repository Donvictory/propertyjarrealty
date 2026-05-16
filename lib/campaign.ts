import 'server-only';
import { db } from './firebase-admin';

const CAMPAIGN_CONTENT_DOC = 'campaign_page';
const CONTENT_COLLECTION = 'site_content';

export interface CampaignContent {
  whyInvestTitle: string;
  whyInvestSubtitle: string;
  whyInvestPoints: string[];
  projectedRoi: string;
  roiSubtext: string;
  investmentOptions: {
    title: string;
    points: string[];
  }[];
  offerStack: {
    title: string;
    points: string[];
    color?: string;
  }[];
}

const defaultContent: CampaignContent = {
  whyInvestTitle: "Why Invest in Lagos?",
  whyInvestSubtitle: "Why smart investors are looking at Lagos",
  whyInvestPoints: [
    "Lagos = fastest-growing real estate hub in West Africa",
    "High rental demand (shortlet & residential)",
    "Entry prices significantly lower than UK property market",
    "Strong appreciation potential in developing corridors"
  ],
  projectedRoi: "15% – 30%",
  roiSubtext: "Depending on investment type",
  investmentOptions: [
    { title: "Option 1: Shortlet Apartments", points: ["Entry: ₦XXM", "ROI: 20-30%", "Target: Airbnb / Business Travelers"] },
    { title: "Option 3: Off-plan Developments", points: ["Flexible Payment Plan", "Capital Appreciation before completion"] },
    { title: "Option 2: Land Banking", points: ["Entry: ₦XM", "Appreciation: 2x-5x in 2-4 years"] }
  ],
  offerStack: [
    { title: "Entry Investor", points: ["1 Plot / 1 Unit", "6-12 Months Payment", "Clear Appreciation Angle"], color: "#00FF85" },
    { title: "Elite Investor", points: ["4-5+ Units", "Bulk Discount", "Priority Allocation", "Optional JV Conversation"] },
    { title: "Smart Investor", points: ["2-3 Units", "Discount Bundle", "Rental/Shortlet Angle"], color: "#FFD600" }
  ]
};

export async function getCampaignContent(): Promise<CampaignContent> {
  if (!db) return defaultContent;
  try {
    const doc = await db.collection(CONTENT_COLLECTION).doc(CAMPAIGN_CONTENT_DOC).get();
    if (!doc.exists) return defaultContent;
    return { ...defaultContent, ...doc.data() } as CampaignContent;
  } catch {
    return defaultContent;
  }
}

export async function updateCampaignContent(content: Partial<CampaignContent>): Promise<boolean> {
  if (!db) return false;
  try {
    await db.collection(CONTENT_COLLECTION).doc(CAMPAIGN_CONTENT_DOC).set(content, { merge: true });
    return true;
  } catch {
    return false;
  }
}
