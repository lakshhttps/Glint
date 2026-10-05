import React from 'react';

const commonHeaders = {
  'Content-Type': ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
  'Accept': ['application/json', 'text/plain', '*/*'],
  'Authorization': ['Bearer ', 'Basic ', 'Token '],
  'Cache-Control': ['no-cache', 'max-age=0'],
  'User-Agent': ['PostmanRuntime/7.32.3', 'Glint/1.0'],
  'X-API-Key': [''],
};

const HeadersInput = ({ headers, setHeaders }) => {
  const addHeader = (defaultKey = '', defaultValue = '') => {
    setHeaders([...headers, { key: defaultKey, value: defaultValue }]);
  };

  const removeHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: '', value: '' }]);
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addPreset = (type) => {
    const existing = headers.filter(h => h.key && h.key.trim() !== '');
    if (type === 'json') {
      const hasContentType = existing.some(h => h.key.toLowerCase() === 'content-type');
      const additions = hasContentType ? [] : [{ key: 'Content-Type', value: 'application/json' }];
      setHeaders([...existing, ...additions]);
    } else if (type === 'auth') {
      const hasAuth = existing.some(h => h.key.toLowerCase() === 'authorization');
      const additions = hasAuth ? [] : [{ key: 'Authorization', value: 'Bearer ' }];
      setHeaders([...existing, ...additions]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Subheader Toolbar */}
      <div className="flex items-center justify-between text-xs text-[#8c8c8c] pb-2 border-b border-[#2e2e2e]">
        <div className="font-semibold uppercase tracking-wider text-[11px] text-[#999999]">
          Headers ({headers.filter(h => h.key.trim() !== '').length})
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => addPreset('json')}
            className="text-[11px] text-[#097bed] hover:underline"
          >
            + Content-Type: JSON
          </button>
          <span className="text-[#383838]">|</span>
          <button
            type="button"
            onClick={() => addPreset('auth')}
            className="text-[11px] text-[#097bed] hover:underline"
          >
            + Bearer Token
          </button>
          <span className="text-[#383838]">|</span>
          <button
            type="button"
            onClick={() => addHeader()}
            className="text-[11px] text-[#097bed] hover:underline font-medium"
          >
            + Add Row
          </button>
        </div>
      </div>

      {/* Postman-like Key-Value Grid */}
      <div className="border border-[#333333] rounded-sm overflow-hidden bg-[#1e1e1e]">
        <div className="grid grid-cols-12 bg-[#252525] border-b border-[#333333] text-[11px] font-semibold text-[#8c8c8c] uppercase px-3 py-1.5">
          <div className="col-span-5">Key</div>
          <div className="col-span-6 border-l border-[#333333] pl-3">Value</div>
          <div className="col-span-1 text-center"></div>
        </div>

        <div className="divide-y divide-[#2a2a2a]">
          {headers.map((header, index) => (
            <div key={index} className="grid grid-cols-12 items-center text-xs group hover:bg-[#252525]">
              {/* Key cell */}
              <div className="col-span-5 px-3 py-1">
                <input
                  type="text"
                  list={`headerKeys${index}`}
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="w-full bg-transparent text-[#e6e6e6] placeholder-[#555555] font-mono text-xs outline-none"
                  spellCheck="false"
                />
                <datalist id={`headerKeys${index}`}>
                  {Object.keys(commonHeaders).map((key) => (
                    <option key={key} value={key} />
                  ))}
                </datalist>
              </div>

              {/* Value cell */}
              <div className="col-span-6 border-l border-[#2e2e2e] px-3 py-1">
                <input
                  type="text"
                  list={`headerValues${index}`}
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="w-full bg-transparent text-[#e6e6e6] placeholder-[#555555] font-mono text-xs outline-none"
                  spellCheck="false"
                />
                <datalist id={`headerValues${index}`}>
                  {header.key &&
                    commonHeaders[header.key]?.map((value) => (
                      <option key={value} value={value} />
                    ))}
                </datalist>
              </div>

              {/* Delete row */}
              <div className="col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => removeHeader(index)}
                  className="text-[#666666] hover:text-[#eb2013] text-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete row"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeadersInput;