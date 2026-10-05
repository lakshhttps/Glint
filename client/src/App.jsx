import React, { useState, useEffect } from 'react';
import UrlInput from './components/UrlInput';
import MethodSelector from './components/MethodSelector';
import HeadersInput from './components/HeadersInput';
import BodyEditor from './components/BodyEditor';
import ResponseViewer from './components/ResponseViewer';
import RequestHistory from './components/RequestHistory';
import { sendRequest } from './utils/apiCaller';
import { isValidUrl, isValidJson, getSampleApis } from './utils/helpers';

function App() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSamples, setShowSamples] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('headers'); // 'params' | 'headers' | 'body'

  // Load request history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('glint_request_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage:', e);
    }
  }, []);

  const saveToHistory = (item) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter(h => h.id !== item.id)].slice(0, 50);
      try {
        localStorage.setItem('glint_request_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('glint_request_history');
    } catch (e) {}
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('glint_request_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleLoadRequest = (item) => {
    setUrl(item.url || '');
    setMethod(item.method || 'GET');
    
    if (Array.isArray(item.headers)) {
      setHeaders(item.headers.length > 0 ? item.headers : [{ key: '', value: '' }]);
    } else if (item.headers && typeof item.headers === 'object') {
      const headerArray = Object.entries(item.headers).map(([key, value]) => ({ key, value }));
      setHeaders(headerArray.length > 0 ? headerArray : [{ key: '', value: '' }]);
    } else {
      setHeaders([{ key: '', value: '' }]);
    }

    if (item.body) {
      setBody(typeof item.body === 'object' ? JSON.stringify(item.body, null, 2) : String(item.body));
      setActiveTab('body');
    } else {
      setBody('');
    }

    setHistoryOpen(false);
  };

  const executeSend = async (overrideProxy = null) => {
    const proxyMode = overrideProxy !== null ? overrideProxy : useProxy;

    if (!url || !isValidUrl(url)) {
      setError({ message: 'Please enter a valid request URL (e.g. https://api.example.com/posts)' });
      return;
    }

    if (method !== 'GET' && method !== 'DELETE' && body && !isValidJson(body)) {
      setError({ message: 'Request body contains invalid JSON' });
      setActiveTab('body');
      return;
    }

    setResponse(null);
    setError(null);
    setIsLoading(true);

    try {
      let bodyData = body;
      if (body && typeof body === 'string' && body.trim() !== '') {
        try {
          bodyData = JSON.parse(body);
        } catch (e) {
          bodyData = body;
        }
      }

      const responseData = await sendRequest(url, method, headers, bodyData, proxyMode);
      setResponse(responseData);

      saveToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        url,
        method,
        headers,
        body: bodyData,
        status: responseData.status,
        duration: responseData.duration
      });
    } catch (err) {
      setError(err);
      saveToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        url,
        method,
        headers,
        body,
        status: err.status || 'ERR',
        duration: err.duration
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => executeSend();

  const handleSampleApiClick = (sample) => {
    setUrl(sample.url);
    setMethod(sample.method);
    setShowSamples(false);
  };

  const sampleApis = getSampleApis();
  const activeHeadersCount = headers.filter(h => h.key && h.key.trim() !== '').length;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e6e6e6] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-11 bg-[#181818] border-b border-[#2e2e2e] px-4 flex items-center justify-between select-none">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6c37]"></span>
            <span className="font-bold text-xs tracking-wider text-white">GLINT</span>
            <span className="text-[10px] text-[#777777] font-mono">API CLIENT</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Proxy checkbox */}
          <label className="flex items-center space-x-1.5 cursor-pointer text-[#8c8c8c] hover:text-[#cccccc] text-[11px]" title="Route through backend server to bypass browser CORS">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
              className="rounded bg-[#252525] border-[#383838] text-[#097bed] focus:ring-0 h-3 w-3"
            />
            <span>Server Proxy</span>
          </label>

          <span className="text-[#333333]">|</span>

          {/* Sample Templates */}
          <button
            type="button"
            onClick={() => setShowSamples(!showSamples)}
            className="text-[#8c8c8c] hover:text-white text-xs transition-colors"
          >
            Sample APIs
          </button>

          <span className="text-[#333333]">|</span>

          {/* History */}
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="text-[#8c8c8c] hover:text-white text-xs transition-colors flex items-center space-x-1"
          >
            <span>History</span>
            {history.length > 0 && (
              <span className="text-[10px] bg-[#2a2a2a] text-[#8c8c8c] px-1 rounded-sm font-mono">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Workbench Container */}
      <main className="flex-1 p-4 max-w-6xl w-full mx-auto">
        {/* Sample APIs Dropdown */}
        {showSamples && (
          <div className="mb-4 bg-[#212121] border border-[#333333] rounded-sm p-3 text-xs">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#2e2e2e]">
              <span className="font-semibold text-[#8c8c8c] uppercase tracking-wider text-[11px]">
                Sample APIs
              </span>
              <button 
                onClick={() => setShowSamples(false)} 
                className="text-[#777777] hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {sampleApis.map((api, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleApiClick(api)}
                  className="text-left p-2 rounded-sm bg-[#1e1e1e] hover:bg-[#282828] border border-[#2e2e2e] text-xs transition-colors"
                >
                  <div className="font-medium text-[#cccccc] mb-0.5">{api.name}</div>
                  <div className="text-[11px] font-mono text-[#777777] truncate">{api.url}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Postman Unified Address Bar */}
        <div className="flex items-center border border-[#383838] focus-within:border-[#097bed] rounded-sm bg-[#262626] mb-4 transition-colors">
          <MethodSelector method={method} setMethod={setMethod} />
          <UrlInput url={url} setUrl={setUrl} onSubmit={handleSubmit} />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !url}
            className="pm-btn-primary rounded-none rounded-r-sm h-[33px] px-6 text-xs font-semibold whitespace-nowrap"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Postman Request Tabs Header */}
        <div className="border-b border-[#2e2e2e] flex items-center space-x-6 text-xs mb-3 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('headers')}
            className={`pb-2 font-medium transition-colors ${
              activeTab === 'headers'
                ? 'text-[#ffffff] border-b-2 border-[#ff6c37]'
                : 'text-[#8c8c8c] hover:text-[#cccccc]'
            }`}
          >
            Headers {activeHeadersCount > 0 && `(${activeHeadersCount})`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('body')}
            className={`pb-2 font-medium transition-colors ${
              activeTab === 'body'
                ? 'text-[#ffffff] border-b-2 border-[#ff6c37]'
                : 'text-[#8c8c8c] hover:text-[#cccccc]'
            }`}
          >
            Body {body && body.trim() !== '' && '●'}
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="mb-4">
          {activeTab === 'headers' ? (
            <HeadersInput headers={headers} setHeaders={setHeaders} />
          ) : (
            <BodyEditor body={body} setBody={setBody} method={method} />
          )}
        </div>

        {/* Response Viewer Panel */}
        <ResponseViewer 
          response={response} 
          isLoading={isLoading} 
          error={error} 
          onRetryWithProxy={() => {
            setUseProxy(true);
            executeSend(true);
          }}
        />
      </main>

      {/* Slide-out History Drawer */}
      <RequestHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onLoadRequest={handleLoadRequest}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />
    </div>
  );
}

export default App;
