import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Loader2 } from 'lucide-react';
import type { LeadershipUpdate } from '../types';

interface LeadershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateData: LeadershipUpdate | null;
  loading: boolean;
}

export const LeadershipModal: React.FC<LeadershipModalProps> = ({
  isOpen,
  onClose,
  updateData,
  loading
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (updateData?.markdown_report) {
      navigator.clipboard.writeText(updateData.markdown_report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (updateData?.markdown_report) {
      const element = document.createElement("a");
      const file = new Blob([updateData.markdown_report], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `Skylark_Leadership_Update_${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Executive Leadership Update Report</h2>
              <p className="text-xs text-slate-400">Formal Business Intelligence Briefing for Skylark Founders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {updateData && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .md</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
              <p className="text-sm font-medium">Synthesizing executive report across Monday.com boards...</p>
            </div>
          ) : updateData ? (
            <div className="prose prose-invert max-w-none text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              {updateData.markdown_report}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Failed to load leadership report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
