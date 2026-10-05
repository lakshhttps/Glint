import React, { useState } from 'react';

const RequestHistory = ({ history, onLoadRequest, onClearHistory, onDeleteItem, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const methodColors = {
    GET: 'text-[#0cbb52]',
    POST: 'text-[#ffb400]',
    PUT: 'text-[#097bed]',
    DELETE: 'text-[#eb2013]',
    PATCH: 'text-[#a855f7]',
    HEAD: 'text-[#a0a0a0]',
    OPTIONS: 'text-[#22d3ee]'
  };

  const filteredHistory = history.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return item.url?.toLowerCase().includes(term) || item.method?.toLowerCase().includes(term);
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#1e1e1e] border-l border-[#333333] h-full flex flex-col p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#2e2e2e]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs text-[#ffffff] uppercase tracking-wider">
              History
            </span>
            <span className="text-[11px] bg-[#2a2a2a] text-[#8c8c8c] px-1.5 py-0.5 rounded-sm font-mono">
              {history.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8c8c8c] hover:text-white text-base px-1"
          >
            ×
          </button>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="py-2.5">
            <input
              type="text"
              placeholder="Filter history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#252525] border border-[#333333] text-[#e6e6e6] placeholder-[#666666] text-xs px-2.5 py-1 rounded-sm outline-none focus:border-[#097bed]"
            />
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-[#666666] text-xs">
              No requests recorded
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between p-2 rounded-sm hover:bg-[#262626] border border-transparent hover:border-[#333333] cursor-pointer text-xs"
                onClick={() => onLoadRequest(item)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className={`font-mono font-bold text-[11px] ${methodColors[item.method] || 'text-[#0cbb52]'}`}>
                      {item.method}
                    </span>
                    {item.status && (
                      <span className={`font-mono text-[10px] ${item.status >= 200 && item.status < 300 ? 'text-[#0cbb52]' : 'text-[#eb2013]'}`}>
                        {item.status}
                      </span>
                    )}
                    {item.duration && (
                      <span className="text-[10px] text-[#666666] font-mono">
                        {item.duration}ms
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#cccccc] truncate" title={item.url}>
                    {item.url}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[#666666] hover:text-[#eb2013] text-sm px-1.5 py-0.5"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-2 border-t border-[#2e2e2e] flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[#eb2013] hover:underline text-[11px]"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="pm-btn-secondary py-0.5 px-2.5 text-xs"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHistory;
