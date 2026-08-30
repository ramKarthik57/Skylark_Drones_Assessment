import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

interface FormattedResponseProps {
  text: string;
}

export const FormattedResponse: React.FC<FormattedResponseProps> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentParagraph: string[] = [];
  let currentList: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushParagraph = (key: string) => {
    if (currentParagraph.length > 0) {
      const rawText = currentParagraph.join(' ').trim();
      if (rawText) {
        elements.push(
          <p key={key} className="text-[14.5px] leading-relaxed text-[#262626] font-sans">
            {renderInlineSpans(rawText)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="space-y-2 my-2.5">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#262626] leading-relaxed">
              <span className="h-1.5 w-1.5 rounded-full bg-[#007a5a] shrink-0 mt-2" />
              <div>{renderInlineSpans(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1);

      elements.push(
        <div key={key} className="my-4 overflow-x-auto rounded-xl border border-[#e5e2d8] bg-[#ffffff] shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f2eb] text-[#737373] uppercase text-[10px] font-mono border-b border-[#e5e2d8]">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className={`py-2.5 px-3 font-semibold ${i > 0 ? 'text-right' : ''}`}>
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f2eb] font-sans text-xs">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#faf9f6] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`py-2.5 px-3 text-[#191919] ${cIdx > 0 ? 'text-right font-mono' : 'font-medium'}`}>
                      {renderInlineSpans(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const renderInlineSpans = (str: string): React.ReactNode => {
    let clean = str.replace(/^[#\s]+/, '');
    const parts = clean.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        if (content.includes('₹') || content.includes('Cr') || content.includes('%')) {
          return (
            <strong key={idx} className="font-bold text-[#191919] font-mono px-0.5">
              {content}
            </strong>
          );
        }
        return <strong key={idx} className="font-bold text-[#191919]">{content}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="bg-[#f4f2eb] px-1.5 py-0.5 rounded text-xs font-mono text-[#007a5a] border border-[#e5e2d8]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      if (inTable) flushTable(`t-${i}`);
      continue;
    }

    // Table Detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.includes('---')) {
        continue;
      }
      const cells = trimmed.split('|').slice(1, -1);
      if (!inTable) {
        flushParagraph(`p-pre-tab-${i}`);
        flushList(`l-pre-tab-${i}`);
        inTable = true;
      }
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable(`t-${i}`);
    }

    // Section Card Headers
    const upper = trimmed.toUpperCase();
    if (upper === 'ANSWER' || upper === '**ANSWER**' || upper === '### ANSWER' || upper === '#### ANSWER') {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      elements.push(
        <div key={`ans-head-${i}`} className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#007a5a] mt-2 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Answer</span>
        </div>
      );
      continue;
    }

    if (upper.includes('[SOURCE FACT]') || upper.includes('GROUND TRUTH') || upper.includes('EVIDENCE')) {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      elements.push(
        <div key={`src-head-${i}`} className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#737373] mt-4 mb-2 flex items-center gap-1.5 border-b border-[#f4f2eb] pb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#007a5a]" />
          <span>Ground Truth Evidence</span>
        </div>
      );
      continue;
    }

    if (upper.includes('[MODELING ASSUMPTION]') || upper.includes('ANALYTICAL ASSUMPTION')) {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      elements.push(
        <div key={`assump-head-${i}`} className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#d97706] mt-4 mb-2 flex items-center gap-1.5 border-b border-amber-100 pb-1">
          <Info className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Modeling Assumption</span>
        </div>
      );
      continue;
    }

    if (upper.includes('[UNKNOWN / NOT IN DATASET]') || upper.includes('DATA NOT AVAILABLE') || upper.includes('REFUSAL')) {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      elements.push(
        <div key={`unavail-head-${i}`} className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#b45309] mt-4 mb-2 flex items-center gap-1.5 border-b border-amber-100 pb-1">
          <AlertCircle className="w-3.5 h-3.5 text-[#b45309]" />
          <span>Data Unavailability Notice</span>
        </div>
      );
      continue;
    }

    if (upper.includes('[RECOMMENDATION]') || upper.includes('EXECUTIVE DIRECTIVE')) {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      elements.push(
        <div key={`rec-head-${i}`} className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#191919] mt-4 mb-2 flex items-center gap-1.5 border-b border-[#f4f2eb] pb-1">
          <ArrowRight className="w-3.5 h-3.5 text-[#007a5a]" />
          <span>Strategic Recommendation</span>
        </div>
      );
      continue;
    }

    // Top Title Header
    if (i === 0 && (trimmed.startsWith('#') || trimmed.startsWith('**') || trimmed.length < 60)) {
      const cleanTitle = trimmed.replace(/^[#\*\s]+/, '').replace(/[\*]+$/, '').replace(/^[^\w\s]+/, '').trim();
      if (cleanTitle && !cleanTitle.toUpperCase().includes('WELCOME')) {
        elements.push(
          <div key={`main-title-${i}`} className="mb-3">
            <h3 className="text-base md:text-lg font-bold text-[#191919] tracking-tight font-serif">
              {cleanTitle}
            </h3>
          </div>
        );
        continue;
      }
    }

    // Bullet list items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      flushParagraph(`p-${i}`);
      const itemContent = trimmed.replace(/^([-*]|\d+\.)\s*/, '');
      currentList.push(itemContent);
      continue;
    } else {
      flushList(`l-${i}`);
    }

    currentParagraph.push(trimmed);
  }

  flushParagraph('p-end');
  flushList('l-end');
  if (inTable) flushTable('t-end');

  return <div className="space-y-3 font-sans text-[#191919]">{elements}</div>;
};
