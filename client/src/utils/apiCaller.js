import axios from 'axios';

/**
 * Send an HTTP request to the specified URL with given parameters
 * @param {string} url - The URL to send the request to
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH, etc.)
 * @param {Array|Object} headers - Request headers
 * @param {Object|string|null} body - Request body
 * @param {boolean} useProxy - Whether to route through the backend proxy to bypass browser CORS
 * @returns {Promise<Object>} - Promise resolving to response object with full request metadata
 */
export const sendRequest = async (url, method, headers, body, useProxy = false) => {
  const startTime = Date.now();
  
  // Convert headers from array of objects to a single object
  const headersObj = Array.isArray(headers)
    ? headers.reduce((acc, header) => {
        if (header.key && header.key.trim() !== '') {
          acc[header.key.trim()] = header.value;
        }
        return acc;
      }, {})
    : (headers || {});

  // If proxy mode is requested, use the server-side proxy to bypass browser CORS restrictions
  if (useProxy) {
    try {
      const response = await axios.post('/api/request/execute', {
        url,
        method,
        headers: headersObj,
        body: method !== 'GET' && method !== 'DELETE' ? body : undefined,
      });

      const result = response.data.data;
      return {
        ...result,
        url,
        method,
        requestHeaders: headersObj,
        requestBody: body,
      };
    } catch (error) {
      const endTime = Date.now();
      const serverError = error.response?.data?.error || error.message || 'Proxy execution failed';
      const err = new Error(serverError);
      err.duration = endTime - startTime;
      err.url = url;
      err.method = method;
      err.requestHeaders = headersObj;
      err.requestBody = body;
      throw err;
    }
  }

  // Direct client-side execution via browser axios
  try {
    const response = await axios({
      url,
      method,
      headers: headersObj,
      data: method !== 'GET' && method !== 'DELETE' ? body : undefined,
      timeout: 30000,
    });

    const endTime = Date.now();
    
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      duration: endTime - startTime,
      url,
      method,
      requestHeaders: headersObj,
      requestBody: body,
    };
  } catch (error) {
    const endTime = Date.now();
    
    if (error.response) {
      // Server returned an error HTTP status (4xx or 5xx)
      return {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        duration: endTime - startTime,
        isError: true,
        url,
        method,
        requestHeaders: headersObj,
        requestBody: body,
      };
    } else if (error.request) {
      // Request sent but no response received (CORS block, network error, or timeout)
      const err = new Error('No response received from target server. This is usually caused by browser CORS policy blocking the response, or an invalid/unreachable host.');
      err.isCorsOrNetwork = true;
      err.request = error.request;
      err.duration = endTime - startTime;
      err.url = url;
      err.method = method;
      err.requestHeaders = headersObj;
      err.requestBody = body;
      throw err;
    } else {
      // Configuration error
      const err = new Error(error.message);
      err.duration = endTime - startTime;
      err.url = url;
      err.method = method;
      err.requestHeaders = headersObj;
      err.requestBody = body;
      throw err;
    }
  }
};