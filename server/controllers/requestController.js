const Request = require('../models/Request');
const axios = require('axios');
const mongoose = require('mongoose');

// Helper to check if MongoDB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Save a request
 * @route   POST /api/request
 * @access  Public / Optional Auth
 */
exports.saveRequest = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Database not connected, saved locally',
        data: req.body
      });
    }

    if (req.user && req.user.id) {
      req.body.user = req.user.id;
    }

    const request = await Request.create(req.body);

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all requests
 * @route   GET /api/request
 * @access  Public / Optional Auth
 */
exports.getRequests = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const filter = req.user && req.user.id ? { user: req.user.id } : {};
    const requests = await Request.find(filter).sort('-createdAt').limit(50);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single request
 * @route   GET /api/request/:id
 * @access  Public / Optional Auth
 */
exports.getRequest = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(404).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update request
 * @route   PUT /api/request/:id
 * @access  Public / Optional Auth
 */
exports.updateRequest = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: req.body
      });
    }

    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete request
 * @route   DELETE /api/request/:id
 * @access  Public / Optional Auth
 */
exports.deleteRequest = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: {}
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Execute a request (proxy to bypass browser CORS)
 * @route   POST /api/request/execute
 * @access  Public
 */
exports.executeRequest = async (req, res, next) => {
  try {
    const { url, method, headers, body } = req.body;

    if (!url || !method) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a URL and method'
      });
    }

    // Convert headers from array to object if necessary
    const headersObj = {};
    if (headers && Array.isArray(headers)) {
      headers.forEach(header => {
        if (header.key && header.key.trim() !== '') {
          headersObj[header.key] = header.value;
        }
      });
    } else if (headers && typeof headers === 'object') {
      Object.assign(headersObj, headers);
    }

    const startTime = Date.now();
    
    try {
      const response = await axios({
        url,
        method,
        headers: headersObj,
        data: method !== 'GET' && method !== 'DELETE' ? body : undefined,
        timeout: 30000,
        validateStatus: () => true // Allow all status codes (2xx, 3xx, 4xx, 5xx) to be captured
      });

      const endTime = Date.now();
      
      return res.status(200).json({
        success: true,
        data: {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          duration: endTime - startTime,
          url,
          method,
          requestHeaders: headersObj,
          requestBody: body
        }
      });
    } catch (error) {
      const endTime = Date.now();
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Server failed to connect to the target URL',
        duration: endTime - startTime,
        url,
        method,
        requestHeaders: headersObj,
        requestBody: body
      });
    }
  } catch (err) {
    next(err);
  }
};