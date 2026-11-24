'use client';

import { useActionState, useTransition } from 'react';
import { deletePaymentAction, recordPaymentAction, type PaymentFormState } from '@/app/actions/admin-payments';
import type { Payment } from '@/lib/payments';

const input =
  'mt-1.5 w-full rounded-[3px] border border-gray-200 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-brand focus:outline-none';
const label = 'block text-xs font-bold uppercase tracking-wider text-gray-500';
const money = (n: number) => `₦${Math.round(n).toLocaleString('en-US')}`;

function FieldError({ msg }: { msg?: string }) {
  return msg ? <span className="mt-1 block normal-case tracking-normal text-red-600">{msg}</span> : null;
}

export default function AdminPaymentsClient({
  properties,
  payments,
}: {
  properties: { id: string; title: string }[];
  payments: Payment[];
}) {
  const [state, action, pending] = useActionState<PaymentFormState, FormData>(recordPaymentAction, {});
  const [deleting, startDelete] = useTransition();
  const f = state.fields ?? {};
  // After a successful record, start the form fresh; after an error, keep what was typed.
  const v = state.success ? {} : (state.values ?? {});
  const today = new Date().toISOString().slice(0, 10);

  const remove = (p: Payment) => {
    if (confirm(`Delete the ${money(p.amount)} payment from ${p.userName}? This can't be undone.`)) {
      startDelete(async () => {
        await deletePaymentAction(p.id);
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record what clients pay. It shows on the client&rsquo;s dashboard and counts towards their realtor&rsquo;s sales.
        </p>
      </div>

      <form
        key={state.success ?? 'form'}
        action={action}
        className="mb-10 grid gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-600 md:col-span-2">{state.error}</p>}
        {state.success && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-green-700 md:col-span-2">{state.success}</p>
        )}
        <label className={label}>
          Client account email
          <input name="userEmail" type="email" required defaultValue={v.userEmail} className={input} placeholder="client@example.com" />
          <FieldError msg={f.userEmail} />
        </label>
        <label className={label}>
          Property
          <select name="propertyId" required defaultValue={v.propertyId ?? ''} className={input}>
            <option value="" disabled>
              Choose a property
            </option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <FieldError msg={f.propertyId} />
        </label>
        <label className={label}>
          Amount paid (₦)
          <input name="amount" inputMode="numeric" required defaultValue={v.amount} className={input} placeholder="e.g. 5,500,000" />
          <FieldError msg={f.amount} />
        </label>
        <label className={label}>
          Date paid
          <input name="paidAt" type="date" required defaultValue={v.paidAt ?? today} max={today} className={input} />
          <FieldError msg={f.paidAt} />
        </label>
        <label className={label}>
          Reference <span className="normal-case tracking-normal text-gray-400">(optional)</span>
          <input name="reference" defaultValue={v.reference} className={input} placeholder="Bank transfer ref, receipt no." />
        </label>
        <label className={label}>
          Note <span className="normal-case tracking-normal text-gray-400">(optional)</span>
          <input name="note" defaultValue={v.note} className={input} placeholder="e.g. Deposit, 2nd instalment" />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-[3px] bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-hover disabled:opacity-60"
          >
            {pending ? 'Recording…' : 'Record payment'}
          </button>
        </div>
      </form>

      <h2 className="mb-3 text-lg font-bold text-charcoal">Recent payments</h2>
      {payments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
          No payments recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 tabular-nums">{p.paidAt}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{p.userName}</p>
                    <p className="text-xs text-gray-500">{p.userEmail}</p>
                  </td>
                  <td className="px-4 py-3">{p.propertyTitle}</td>
                  <td className="px-4 py-3 text-gray-500">{[p.reference, p.note].filter(Boolean).join(' · ') || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{money(p.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => remove(p)}
                      className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
