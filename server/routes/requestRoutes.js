const express = require('express');
const {
  saveRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  executeRequest
} = require('../controllers/requestController');

const router = express.Router();


router.route('/')
  .get(getRequests)
  .post(saveRequest);

router.post('/execute', executeRequest);

router.route('/:id')
  .get(getRequest)
  .put(updateRequest)
  .delete(deleteRequest);

module.exports = router;