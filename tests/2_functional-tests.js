/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const ObjectID = require('mongodb').ObjectID
const assert = chai.assert;
const server = require('../server');

let testId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: "The Alchemist" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            // console.log(res.body, res.headers)
            assert.include(res.headers['content-type'], 'application/json');
            ['_id', '__v','comments', 'commentcount', 'title'].every(prop => assert.property(res.body, prop));
            assert.isTrue(ObjectID.isValid(res.body._id));
            assert.isArray(res.body.comments);
            ['__v', 'commentcount'].every(field => assert.isNumber(res.body[field]));
            testId = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.include(res.headers['content-type'], 'text/html');
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            ['_id', '__v','comments', 'commentcount', 'title'].every(prop => assert.property(res.body[0], prop));
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let absentId = '60c90823ed046505a73b490e';
        chai.request(server)
          .get(`/api/books/${absentId}`)
          .end((err, res) => {
            // assert.isTrue(ObjectID.isValid(absentId));
            assert.equal(res.status, 200);
            console.log(res.text)
            assert.include(res.headers['content-type'], 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${testId}`)
          .end((err, res) => {
            // console.log(`Test ID: `+testId, res.body)
            assert.isTrue(ObjectID.isValid(testId));
            assert.equal(res.status, 200);
            assert.include(res.headers['content-type'], 'application/json');
            assert.equal(res.body._id, testId);
            ['_id', '__v','comments', 'commentcount', 'title'].every(prop => assert.property(res.body, prop));
            assert.isArray(res.body.comments);
            ['__v', 'commentcount'].every(field => assert.isNumber(res.body[field]));
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
      });

    });

  });

});
