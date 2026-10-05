import React, { useState, useEffect, useCallback } from 'react';
import ReactJson from 'react-json-view';
import AISuggestion from './AISuggestion';
import { formatDuration } from '../utils/helpers';

const ResponseViewer = ({ response, isLoading, error, onRetryWithProxy }) => {
  const [activeTab, setActiveTab] = useState('body'); // 'body' | 'headers' | 'ai'
  const [bodyFormat, setBodyFormat] = useState('pretty'); // 'pretty' | 'raw'
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [copied, setCopied] = useState(false);

  const getAISuggestion = useCallback(async () => {
    if (!response) return;
    setAiLoading(true);
    setAiError(null);
  
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: response.url,
          method: response.method,
          headers: response.requestHeaders || {},
          body: response.requestBody || {},
          responseStatus: response.status,
          responseData: response.data || {}
        })
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to fetch AI suggestion');
      }
  
      const data = await res.json();
      if (!data.suggestion) {
        throw new Error('No suggestion received from AI');
      }
  
      setAiSuggestion(data.suggestion);
    } catch (err) {
      console.error('AI Suggestion Error:', err);
      setAiError(err.message || 'Error generating diagnosis');
    } finally {
      setAiLoading(false);
    }
  }, [response]);

  useEffect(() => {
    if (response && response.status >= 400) {
      getAISuggestion();
    } else {
      setAiSuggestion(null);
      setAiError(null);
    }
  }, [response, getAISuggestion]);

  const copyResponse = () => {
    if (!response?.data) return;
    const text = typeof response.data === 'object'
      ? JSON.stringify(response.data, null, 2)
      : String(response.data);

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadResponse = () => {
    if (!response?.data) return;
    const text = typeof response.data === 'object'
      ? JSON.stringify(response.data, null, 2)
      : String(response.data);

    const blob = new Blob([text], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `response-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  if (isLoading) {
    return (
      <div className="border border-[#2e2e2e] bg-[#212121] rounded-sm p-4 mt-4">
        <div className="flex items-center space-x-2 text-xs text-[#8c8c8c]">
          <svg className="animate-spin h-4 w-4 text-[#097bed]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sending request to server...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-[#eb2013]/40 bg-[#251818] rounded-sm p-4 mt-4 text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eb2013]/20">
          <div className="font-semibold text-[#eb2013]">
            Could not send request
          </div>
          {error.duration && (
            <div className="font-mono text-[#8c8c8c]">
              {formatDuration(error.duration)}
            </div>
          )}
        </div>
        <p className="text-[#e6e6e6] font-mono mb-3">
          Error: {error.message || 'Request failed'}
        </p>

        {error.isCorsOrNetwork && onRetryWithProxy && (
          <div className="pt-2 border-t border-[#eb2013]/20 flex items-center justify-between">
            <span className="text-[#a0a0a0]">
              CORS blocked by browser. Route through server proxy:
            </span>
            <button
              type="button"
              onClick={onRetryWithProxy}
              className="pm-btn-primary text-xs py-1 px-3"
            >
              Retry with Proxy
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!response) {
    return (
      <div className="border border-[#2e2e2e] bg-[#212121] rounded-sm p-8 mt-4 text-center text-[#777777] text-xs">
        Click Send to get a response
      </div>
    );
  }

  const { status, statusText, headers, data, duration } = response;

  const statusColor = status >= 200 && status < 300 
    ? 'text-[#0cbb52]' 
    : status >= 400 
    ? 'text-[#eb2013]' 
    : 'text-[#ffb400]';

  const hasAI = status >= 400 || aiSuggestion || aiLoading || aiError;

  return (
    <div className="border border-[#2e2e2e] bg-[#212121] rounded-sm mt-4 overflow-hidden">
      {/* Postman Response Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#2e2e2e] bg-[#1e1e1e]">
        {/* Left Tabs */}
        <div className="flex items-center space-x-4 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('body')}
            className={`font-semibold pb-0.5 transition-colors ${
              activeTab === 'body'
                ? 'text-[#ffffff] border-b-2 border-[#097bed]'
                : 'text-[#8c8c8c] hover:text-[#cccccc]'
            }`}
          >
            Body
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('headers')}
            className={`font-semibold pb-0.5 transition-colors ${
              activeTab === 'headers'
                ? 'text-[#ffffff] border-b-2 border-[#097bed]'
                : 'text-[#8c8c8c] hover:text-[#cccccc]'
            }`}
          >
            Headers ({headers ? Object.keys(headers).length : 0})
          </button>
          {hasAI && (
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`font-semibold pb-0.5 transition-colors ${
                activeTab === 'ai'
                  ? 'text-[#70a5ff] border-b-2 border-[#097bed]'
                  : 'text-[#8c8c8c] hover:text-[#70a5ff]'
              }`}
            >
              AI Diagnostics {aiLoading ? '...' : ''}
            </button>
          )}
        </div>

        {/* Right Stats (Status, Time, Actions) */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-[#8c8c8c]">Status:</span>
            <span className={`font-mono font-bold ${statusColor}`}>
              {status} {statusText}
            </span>
          </div>
          <span className="text-[#383838]">|</span>
          <div className="flex items-center space-x-1">
            <span className="text-[#8c8c8c]">Time:</span>
            <span className="font-mono text-[#0cbb52]">
              {formatDuration(duration)}
            </span>
          </div>
          <span className="text-[#383838]">|</span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={copyResponse}
              className="text-[#8c8c8c] hover:text-white px-1.5 py-0.5 rounded text-[11px]"
              title="Copy"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={downloadResponse}
              className="text-[#8c8c8c] hover:text-white px-1.5 py-0.5 rounded text-[11px]"
              title="Download JSON"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar for Body format (Pretty vs Raw) */}
      {activeTab === 'body' && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#252525] border-b border-[#2e2e2e] text-[11px]">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setBodyFormat('pretty')}
              className={`px-2 py-0.5 rounded-sm ${
                bodyFormat === 'pretty' ? 'bg-[#333333] text-white font-medium' : 'text-[#8c8c8c] hover:text-white'
              }`}
            >
              Pretty (JSON)
            </button>
            <button
              type="button"
              onClick={() => setBodyFormat('raw')}
              className={`px-2 py-0.5 rounded-sm ${
                bodyFormat === 'raw' ? 'bg-[#333333] text-white font-medium' : 'text-[#8c8c8c] hover:text-white'
              }`}
            >
              Raw
            </button>
          </div>
          {status >= 400 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('ai');
                if (!aiSuggestion && !aiLoading) getAISuggestion();
              }}
              className="text-[#70a5ff] hover:underline"
            >
              View AI Suggestion →
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-3 bg-[#1e1e1e]">
        {activeTab === 'body' && bodyFormat === 'pretty' && (
          <div className="overflow-auto max-h-96 font-mono text-xs">
            {typeof data === 'object' && data !== null ? (
              <ReactJson 
                src={data} 
                theme="monokai"
                enableClipboard={false}
                displayDataTypes={false}
                collapsed={2}
                name={false}
              />
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-xs text-[#e6e6e6]">
                {String(data)}
              </pre>
            )}
          </div>
        )}

        {activeTab === 'body' && bodyFormat === 'raw' && (
          <div className="overflow-auto max-h-96 font-mono text-xs text-[#e6e6e6]">
            <pre className="whitespace-pre-wrap">
              {typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)}
            </pre>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="overflow-auto max-h-96 font-mono text-xs">
            <div className="border border-[#333333] rounded-sm divide-y divide-[#2e2e2e]">
              {headers && Object.entries(headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-12 py-1 px-3 hover:bg-[#252525]">
                  <div className="col-span-5 text-[#8c8c8c] font-semibold">{key}:</div>
                  <div className="col-span-7 text-[#e6e6e6] break-all select-all">{String(value)}</div>
                </div>
              ))}
              {(!headers || Object.keys(headers).length === 0) && (
                <div className="p-3 text-[#777777] italic">No response headers</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <AISuggestion 
            isLoading={aiLoading}
            suggestion={aiSuggestion}
            error={aiError}
            onRetry={getAISuggestion}
          />
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
