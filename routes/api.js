'use strict';

const projectModel = require('../models').projectModel

module.exports = (app) => {

  app.route('/api/issues/:project')

    // get issues of a project
    .get( (req, res) => {
      let project = req.params.project;

      // get query params
      let iDParam = req.query._id;
      let issueTitleParam = req.query.issue_title;
      let issueTextParam = req.query.issue_text;
      let createdByParam = req.query.created_by;
      let assignedToParam = req.query.assigned_to;
      let statusTextParam = req.query.status_text;
      let openParam = req.query.open;
      let createdOnParam = req.query.created_on;
      let updatedOnParam = req.query.updated_on;

      let queryObj = { project: project };

      // add query params to query object
      if (iDParam) { 
        queryObj._id = iDParam 
      };
      if (issueTitleParam) {
        queryObj.issue_title = issueTitleParam
      };
      if (issueTextParam) {
        queryObj.issue_text = issueTextParam
      };
      if (createdByParam) {
        queryObj.created_by = createdByParam
      };
      if (assignedToParam) {
        queryObj.assigned_to = assignedToParam
      };
      if (statusTextParam) {
        queryObj.status_text = statusTextParam
      };
      if (openParam) {
        queryObj.open = openParam
      };
      if (createdOnParam) {
        queryObj.created_on = createdOnParam
      };
      if (updatedOnParam) {
        queryObj.updated_on = updatedOnParam
      };

      // filter issues by project and query params
      projectModel.find(queryObj).then((data) => {
        res.json(data);
        return;
      });
      
    })

    // create a new issue
    .post( (req, res) => {
      let project = req.params.project;

      // return response for missing required fields
      if (!req.body.issue_title || 
          !req.body.issue_text || 
          !req.body.created_by) {
        res.json({ 
          error: 'required field(s) missing' 
        });
        return;
        
      } else {
        // create issue and send to db
        let newProject = new projectModel({
          project: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          open: true,
          created_on: new Date(),
          updated_on: new Date()
         });

        newProject.save();

        // respond with issue, minus project title
        let resObj = {
          issue_title: newProject.issue_title,
          issue_text: newProject.issue_text,
          created_by: newProject.created_by,
          assigned_to: newProject.assigned_to,
          status_text: newProject.status_text,
          open: newProject.open,
          created_on: newProject.created_on,
          updated_on: newProject.updated_on,
          _id: newProject._id
        };
        
        res.json(resObj);
        return;
        
      };
     
    })

    // update an issue
    .put( (req, res) => {
      
      // return response for missing _id
      if (!req.body._id) {
        res.json({ 
          error: 'missing _id' 
        });
        return;
      };

      // return response for no fields to update
      if (!req.body.issue_title &&
         !req.body.issue_text &&
         !req.body.created_by &&
         !req.body.assigned_to &&
         !req.body.status_text &&
         !req.body.open) {
        res.json({ 
          error: 'no update field(s) sent', 
          _id: req.body._id 
        });
        return;
      };

      // check that id matches ObjectId format
      if (req.body._id.match(/^[0-9a-fA-F]{24}$/)) {

        // find issue in db by id
        projectModel.findById(req.body._id).then((data) => {

          // return response for id not found
          if (!data) {
            res.json({ 
              error: 'could not update', 
              _id: req.body._id 
            });
            return;
            
          } else {
            // create updated issue object and replace in db
            let updatedObj = {
              issue_title: req.body.issue_title || data.issue_title,
              issue_text: req.body.issue_text || data.issue_text,
              created_by: req.body.created_by || data.created_by,
              assigned_to: req.body.assigned_to || data.assigned_to,
              status_text: req.body.status_text || data.status_text,
              open: req.body.open || data.open,
              updated_on: new Date()
            };
            
            projectModel
            .findByIdAndUpdate(req.body._id, updatedObj, {new: true})
            .then(() => {
              res.json({ 
                result: 'successfully updated', 
                _id: req.body._id 
              });
              return;
            });
            
          };
        });
        
      } else {
        // return response if id was not ObjectId format
        res.json({ 
          error: 'could not update', 
          _id: req.body._id 
        });
        return;
      };
    })

    // removing an issue
    .delete( (req, res) => { 
      
      // return response for missing _id
      if (!req.body._id) {
        res.json({ 
          error: 'missing _id' 
        });
        return;
      };

      // check that id matches ObjectId format
      if (req.body._id.match(/^[0-9a-fA-F]{24}$/)) {

        // find issue in db by id and delete
        projectModel
        .findByIdAndDelete(req.body._id)
        .then((data) => {

          // return response for id not found
          if (!data) {
            res.json({ 
              error: 'could not delete', 
              _id: req.body._id 
            });
            return;
            
          } else {
            // return response found and deleted
            res.json({ 
              result: 'successfully deleted', 
              _id: req.body._id 
            });
            return;
          };
          
        });
        
      } else {
        // return response if id was not ObjectId format
        res.json({ 
          error: 'could not delete', 
          _id: req.body._id 
        });
        return;
      };
      
    });
};
