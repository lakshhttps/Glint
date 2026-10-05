import React from 'react';
import ReactMarkdown from 'react-markdown';

const AISuggestion = ({ isLoading, suggestion, error, onRetry }) => {
  return (
    <div className="rounded-sm border border-[#2e4057] bg-[#1a2332] p-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#2e4057]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#097bed]"></span>
          <span className="font-semibold text-[#cce0ff] tracking-wide text-xs">
            AI Assistant Diagnosis
          </span>
          <span className="text-[10px] text-[#708aa8] font-mono">
            Powered by Google Gemini
          </span>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-4 text-[#8c8c8c] flex items-center space-x-2">
          <svg className="animate-spin h-3.5 w-3.5 text-[#097bed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Analyzing request failure and generating fix...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="text-[#eb2013] py-2 flex items-center justify-between">
          <span>Failed to generate diagnosis: {error}</span>
          {onRetry && (
            <button onClick={onRetry} className="text-[#097bed] hover:underline ml-2">
              Retry
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {suggestion && !isLoading && (
        <div className="text-[#cce0ff] leading-relaxed space-y-2">
          <ReactMarkdown
            components={{
              h1: ({ node, children, ...props }) => <h5 className="font-bold text-white text-xs mt-3 mb-1" {...props}>{children}</h5>,
              h2: ({ node, children, ...props }) => <h5 className="font-bold text-[#70a5ff] uppercase tracking-wider text-[11px] mt-3 mb-1" {...props}>{children}</h5>,
              h3: ({ node, children, ...props }) => <h6 className="font-semibold text-white text-xs mt-2 mb-1" {...props}>{children}</h6>,
              p: ({ node, children, ...props }) => <p className="text-xs text-[#b8d2f2] mb-1.5 leading-relaxed" {...props}>{children}</p>,
              ul: ({ node, children, ...props }) => <ul className="list-disc list-inside space-y-1 my-1.5 text-[#b8d2f2]" {...props}>{children}</ul>,
              ol: ({ node, children, ...props }) => <ol className="list-decimal list-inside space-y-1 my-1.5 text-[#b8d2f2]" {...props}>{children}</ol>,
              li: ({ node, children, ...props }) => <li className="text-xs" {...props}>{children}</li>,
              code: ({ inline, children, ...props }) => 
                inline ? (
                  <code className="px-1 py-0.5 rounded bg-[#111927] text-[#ffb400] font-mono text-[11px]" {...props}>{children}</code>
                ) : (
                  <div className="p-2.5 my-2 rounded bg-[#111927] border border-[#2e4057] font-mono text-[11px] text-[#e6e6e6] overflow-x-auto">
                    <pre><code {...props}>{children}</code></pre>
                  </div>
                ),
              strong: ({ node, children, ...props }) => <strong className="font-semibold text-white" {...props}>{children}</strong>
            }}
          >
            {suggestion}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AISuggestion;