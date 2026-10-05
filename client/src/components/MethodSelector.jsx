import React from 'react';

const MethodSelector = ({ method, setMethod }) => {
  const methodColors = {
    GET: 'text-[#0cbb52]',
    POST: 'text-[#ffb400]',
    PUT: 'text-[#097bed]',
    DELETE: 'text-[#eb2013]',
    PATCH: 'text-[#a855f7]',
    HEAD: 'text-[#a0a0a0]',
    OPTIONS: 'text-[#22d3ee]'
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        id="method-select"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className={`bg-[#262626] font-mono font-bold text-xs pl-3 pr-7 py-2 rounded-l border-r border-[#383838] focus:outline-none cursor-pointer appearance-none transition-colors ${
          methodColors[method] || 'text-[#0cbb52]'
        }`}
        aria-label="HTTP Method"
      >
        <option value="GET" className="bg-[#212121] text-[#0cbb52] font-bold">GET</option>
        <option value="POST" className="bg-[#212121] text-[#ffb400] font-bold">POST</option>
        <option value="PUT" className="bg-[#212121] text-[#097bed] font-bold">PUT</option>
        <option value="DELETE" className="bg-[#212121] text-[#eb2013] font-bold">DELETE</option>
        <option value="PATCH" className="bg-[#212121] text-[#a855f7] font-bold">PATCH</option>
        <option value="HEAD" className="bg-[#212121] text-[#a0a0a0] font-bold">HEAD</option>
        <option value="OPTIONS" className="bg-[#212121] text-[#22d3ee] font-bold">OPTIONS</option>
      </select>
      <div className="pointer-events-none absolute right-2 text-[#777777]">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default MethodSelector;