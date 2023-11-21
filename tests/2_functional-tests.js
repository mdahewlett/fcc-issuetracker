const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  let id1;
  
  suite('Post request to /api/issues/{project}', () => {
    test('Create an issue with every field', (done) => {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test Issue',
          issue_text: 'Test Issue Text',
          created_by: 'Test User',
          assigned_to: 'Test Assignee',
          status_text: 'Test Status'
        })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test Issue');
          assert.equal(res.body.issue_text, 'Test Issue Text');
          assert.equal(res.body.created_by, 'Test User');
          assert.equal(res.body.assigned_to, 'Test Assignee');
          assert.equal(res.body.status_text, 'Test Status');
          assert.equal(res.body.open, true);

          id1 = res.body._id;
        
          done();
        });
    });
    test('Create an issue with only required fields', (done) => {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test Issue',
          issue_text: 'Test Issue Text',
          created_by: 'Test User'
        })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test Issue');
          assert.equal(res.body.issue_text, 'Test Issue Text');
          assert.equal(res.body.created_by, 'Test User');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.open, true);
          done();
        });
    });
    test('Create an issue with missing required fields', (done) => {
      chai
      .request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Test Issue',
        issue_text: 'Test Issue Text'
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
    });
  });
  suite('Get request to /api/issues/{project}', () => {
    test('View issues on a project', (done) => {
      chai
      .request(server)
      .get('/api/issues/test')
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });
    test('View issues on a project with one filter', (done) => {
      chai
      .request(server)
      .get('/api/issues/test')
      .query({
        issue_title: 'Test Issue'
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });
    test('View issues on a project with multiple filters', (done) => {
      chai
      .request(server)
      .get('/api/issues/test')
      .query({ issue_title: 'Test Issue', issue_text: 'Test Issue Text' })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });
  });
  suite('Put request to /api/issues/{project}', () => {
    test('Update one field on an issue', (done) => {
      chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: id1,
        issue_title: 'Updated Title',
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
    });
    test('Update multiple fields on an issue', (done) => {
      chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: id1,
        issue_title: 'Second Updated Title',
        issue_text: 'Updated Text'
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
    });
    test('Update an issue with missing _id', (done) => {
      chai
      .request(server)
      .put('/api/issues/test')
      .send({
        issue_title: 'Test Issue'
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        console.log(res.body);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
    test('Update an issue with no fields to update', (done) => {
      chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: id1
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
    });
    test('Update an issue with an invalid _id', (done) => {
      chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: 'invalid id',
        issue_title: 'Test Issue'
      })
      .end( (err, res) => {
        console.log(res.body._id);
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        done();
      });
    });
  });
  suite('Delete request to /api/issues/{project}', () => {
    test('Delete an issue', (done) => {
      chai
      .request(server)
      .delete('/api/issues/test')
      .send({
        _id: id1
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        done();
      });
    });
    test('Delete an issue with an invalid _id', (done) => {
      chai
      .request(server)
      .delete('/api/issues/test')
      .send({
        _id: 'invalid id'
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      });
    });
    test('Delete an issue with missing _id', (done) => {
      chai
      .request(server)
      .delete('/api/issues/test')
      .send({
        _id: ''
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
  });
});

after(() => {
    chai.request(server).get('/api')
});