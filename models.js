let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const projectSchema = new mongoose.Schema({
  project: {type: String, required: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: String,
  status_text: String,
  open: Boolean,
  created_on: Date,
  updated_on: Date
});

let projectModel = mongoose.model('Project', projectSchema);

exports.projectModel = projectModel;