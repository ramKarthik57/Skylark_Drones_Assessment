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
      element.download = `Skylark_Leadership_Brief_${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="bg-[#10121a] w-full max-w-3xl max-h-[85vh] rounded-lg border border-[#1e2333] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2333] bg-[#141722]">
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-sky-400" />
            <div>
              <h2 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
                Leadership Intelligence Brief
              </h2>
              <p className="text-[10px] text-slate-500">Executive strategy briefing generated from live board data</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {updateData && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1e2333] hover:bg-[#282f44] text-slate-300 text-[11px] font-medium transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-700 hover:bg-sky-600 text-white text-[11px] font-medium transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>Download .md</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
              <p className="text-xs">Synthesizing executive briefing from dataset evidence...</p>
            </div>
          ) : updateData ? (
            <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-[#090a0f] p-4 rounded border border-[#1e2333]">
              {updateData.markdown_report}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No report data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
