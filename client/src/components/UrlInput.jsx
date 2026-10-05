import React from 'react';

const UrlInput = ({ url, setUrl, onSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex-1 relative flex items-center bg-[#262626]">
      <input
        type="text"
        id="url-input"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter URL or paste text (e.g. https://api.example.com/v1/users)"
        className="w-full bg-transparent text-[#e6e6e6] placeholder-[#666666] font-mono text-xs px-3 py-2 outline-none"
        spellCheck="false"
        autoComplete="off"
      />
      {url && (
        <button
          type="button"
          onClick={() => setUrl('')}
          className="text-[#666666] hover:text-[#cccccc] px-2 text-xs font-mono"
          title="Clear"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default UrlInput;