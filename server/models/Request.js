const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'Untitled Request',
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    url: {
      type: String,
      required: [true, 'Please add a URL'],
      trim: true
    },
    method: {
      type: String,
      required: [true, 'Please add a HTTP method'],
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
    },
    headers: {
      type: [
        {
          key: String,
          value: String
        }
      ],
      default: []
    },
    body: {
      type: String,
      default: ''
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Request', RequestSchema);