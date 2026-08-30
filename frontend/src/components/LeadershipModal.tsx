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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#ffffff] w-full max-w-3xl max-h-[85vh] rounded-2xl border border-[#e5e2d8] shadow-2xl flex flex-col overflow-hidden text-[#191919] relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e2d8] bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#007a5a] border border-emerald-200">
              <FileText className="h-4 w-4 text-[#007a5a]" />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-bold text-[#191919] uppercase tracking-wider font-mono">
                Leadership Intelligence Brief
              </h2>
              <p className="text-xs text-[#737373]">Executive strategy briefing generated from reconciled board data</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {updateData && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f2eb] hover:bg-[#eae7dc] text-[#191919] text-xs font-semibold border border-[#dcd7cb] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#007a5a]" /> : <Copy className="h-3.5 w-3.5 text-[#737373]" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007a5a] hover:bg-[#006046] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .md</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#191919] hover:bg-[#f4f2eb] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#007a5a]" />
              <p className="text-xs text-[#595959]">Synthesizing executive briefing from CRM & Operations tracker records...</p>
            </div>
          ) : updateData ? (
            <div className="space-y-4">
              {/* Formatted Markdown Render */}
              <div className="bg-[#f4f2eb] p-6 rounded-xl border border-[#e5e2d8] text-xs font-mono text-[#191919] whitespace-pre-wrap leading-relaxed">
                {updateData.markdown_report}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#737373] text-xs">
              No leadership briefing generated. Click Generate Briefing to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
