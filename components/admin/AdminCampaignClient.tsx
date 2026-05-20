'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CampaignContent } from '@/lib/campaign';

const AdminCampaignClient = () => {
  const [content, setContent] = useState<CampaignContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/campaign')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Campaign content updated successfully!' });
      } else {
        throw new Error('Failed to update');
      }
    } catch {
      setMessage({ type: 'error', text: 'Error updating campaign content.' });
    } finally {
      setSaving(false);
    }
  };

  const updatePoint = (section: 'whyInvestPoints' | 'investmentOptions' | 'offerStack', index: number, pointIndex: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    if (section === 'whyInvestPoints') {
      newContent.whyInvestPoints[index] = value;
    } else {
      const optionsOrStack = newContent[section] as { title: string; points: string[]; }[];
      optionsOrStack[index].points[pointIndex] = value;
    }
    setContent(newContent);
  };

  if (loading) return <div className="p-8 text-center">Loading campaign settings...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Campaign Management</h1>
          <p className="text-gray-500">Update the text and offerings on the investment campaign page.</p>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl mb-6 font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-8 pb-20">
        {/* Why Invest Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-charcoal mb-6 border-b pb-4">&quot; Why Invest&quot; Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Section Title</label>
              <input
                type="text"
                value={content?.whyInvestTitle}
                onChange={(e) => setContent({ ...content!, whyInvestTitle: e.target.value })}
                className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subtitle</label>
              <input
                type="text"
                value={content?.whyInvestSubtitle}
                onChange={(e) => setContent({ ...content!, whyInvestSubtitle: e.target.value })}
                className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bullet Points</label>
              <div className="space-y-2">
                {content?.whyInvestPoints.map((point, i) => (
                  <input
                    key={i}
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint('whyInvestPoints', i, 0, e.target.value)}
                    className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-charcoal mb-6 border-b pb-4">ROI Projections</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ROI Value</label>
              <input
                type="text"
                value={content?.projectedRoi}
                onChange={(e) => setContent({ ...content!, projectedRoi: e.target.value })}
                className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subtext</label>
              <input
                type="text"
                value={content?.roiSubtext}
                onChange={(e) => setContent({ ...content!, roiSubtext: e.target.value })}
                className="w-full bg-off-white border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Investment Options */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-charcoal mb-6 border-b pb-4">Investment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content?.investmentOptions.map((opt, i) => (
              <div key={i} className="p-4 bg-off-white rounded-2xl border border-gray-100">
                <input
                  type="text"
                  value={opt.title}
                  onChange={(e) => {
                    const newOpt = [...content!.investmentOptions];
                    newOpt[i].title = e.target.value;
                    setContent({ ...content!, investmentOptions: newOpt });
                  }}
                  className="w-full bg-white border border-gray-100 rounded-lg px-2 py-1 mb-4 font-bold text-sm"
                />
                <div className="space-y-2">
                  {opt.points.map((p, j) => (
                    <input
                      key={j}
                      type="text"
                      value={p}
                      onChange={(e) => updatePoint('investmentOptions', i, j, e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-lg px-2 py-1 text-xs"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-8 right-8 z-[50]">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand text-white px-6 sm:px-10 py-2.5 sm:py-4 rounded-[3px] font-bold text-xs sm:text-sm whitespace-nowrap shadow-2xl hover:bg-brand-hover transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCampaignClient;
