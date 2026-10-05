import React, { useEffect, useState } from 'react';
import { isValidJson } from '../utils/helpers';

const BodyEditor = ({ body, setBody, method }) => {
  const [error, setError] = useState('');
  
  const bodyMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  const canHaveBody = bodyMethods.includes(method);

  // Validate JSON when body changes
  useEffect(() => {
    if (body && !isValidJson(body)) {
      try {
        JSON.parse(body);
        setError('');
      } catch (e) {
        setError(e.message || 'Invalid JSON format');
      }
    } else {
      setError('');
    }
  }, [body]);

  const formatJson = () => {
    try {
      if (!body || body.trim() === '') return;
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError('Cannot format: ' + e.message);
    }
  };

  const clearBody = () => {
    setBody('');
    setError('');
  };

  if (!canHaveBody) {
    return (
      <div className="py-8 text-center text-[#777777] border border-dashed border-[#333333] rounded-sm bg-[#1e1e1e]/50">
        <p className="text-xs">This request does not have a body.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Subheader / Toolbar */}
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#2e2e2e]">
        <div className="flex items-center space-x-3 text-xs text-[#8c8c8c]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#999999]">
            raw (JSON)
          </span>
          {body && !error && (
            <span className="text-[11px] text-[#0cbb52]">● Valid JSON</span>
          )}
          {error && (
            <span className="text-[11px] text-[#eb2013]">● JSON Error</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={formatJson}
            disabled={!body || !!error}
            className="text-[11px] text-[#097bed] hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Beautify
          </button>
          <span className="text-[#383838]">|</span>
          <button
            type="button"
            onClick={clearBody}
            disabled={!body}
            className="text-[11px] text-[#8c8c8c] hover:text-[#e6e6e6] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="border border-[#333333] rounded-sm overflow-hidden bg-[#1e1e1e]">
        <textarea
          id="body-editor"
          className="w-full h-48 p-3 bg-[#1e1e1e] text-[#e6e6e6] placeholder-[#555555] font-mono text-xs focus:outline-none resize-y leading-relaxed border-0"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`{\n  "name": "value"\n}`}
          spellCheck="false"
        />
      </div>

      {error && (
        <div className="text-xs text-[#eb2013] font-mono mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default BodyEditor;