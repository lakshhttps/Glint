/**
 * Validates if the provided string is a valid URL
 * @param {string} string - The URL string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  /**
   * Validates if the provided string is valid JSON
   * @param {string} jsonString - The JSON string to validate
   * @returns {boolean} - True if valid JSON, false otherwise
   */
  export const isValidJson = (jsonString) => {
    try {
      if (!jsonString || jsonString.trim() === '') return true;
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Format duration in milliseconds to a readable format
   * @param {number} ms - Duration in milliseconds
   * @returns {string} - Formatted duration string
   */
  export const formatDuration = (ms) => {
    if (ms < 1000) {
      return `${ms}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };
  
  /**
   * Get appropriate status code color based on HTTP status
   * @param {number} status - HTTP status code
   * @returns {string} - CSS color class
   */
  export const getStatusCodeColor = (status) => {
    if (!status) return 'text-gray-500';
    
    if (status >= 200 && status < 300) {
      return 'text-green-500';
    } else if (status >= 300 && status < 400) {
      return 'text-blue-500';
    } else if (status >= 400 && status < 500) {
      return 'text-yellow-500';
    } else if (status >= 500) {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };
  
  /**
   * Returns sample APIs for quick testing
   * @returns {Array} - Array of sample API objects
   */
  export const getSampleApis = () => [
    { name: 'Random User API', url: 'https://randomuser.me/api/', method: 'GET' },
    { name: 'JSON Placeholder Posts', url: 'https://jsonplaceholder.typicode.com/posts', method: 'GET' },
    { name: 'JSON Placeholder Users', url: 'https://jsonplaceholder.typicode.com/users', method: 'GET' },
    { name: 'Open Weather Map', url: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY', method: 'GET' },
    { name: 'GitHub User', url: 'https://api.github.com/users/octocat', method: 'GET' },
  ];