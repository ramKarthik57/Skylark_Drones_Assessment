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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1a0e38] w-full max-w-3xl max-h-[85vh] rounded-3xl border border-[#412275] shadow-2xl shadow-purple-950 flex flex-col overflow-hidden text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d1854] bg-[#130a2a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-700/50">
              <FileText className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                Leadership Intelligence Brief
              </h2>
              <p className="text-[10px] text-purple-300/70">Executive strategy briefing generated from reconciled board data</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {updateData && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-medium border border-purple-700/50 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-purple-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-950 border border-purple-400/40 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .md</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-purple-300 hover:text-white bg-purple-950 hover:bg-purple-900 border border-purple-700/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <p className="text-xs text-purple-300">Synthesizing executive briefing from CRM & Operations tracker records...</p>
            </div>
          ) : updateData ? (
            <div className="space-y-4">
              {/* Formatted Markdown Render */}
              <div className="bg-[#130a2a] p-6 rounded-2xl border border-[#2d1854] text-xs font-mono text-purple-200/90 whitespace-pre-wrap leading-relaxed">
                {updateData.markdown_report}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-purple-400 text-xs">
              No leadership briefing generated. Click Generate Briefing to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
