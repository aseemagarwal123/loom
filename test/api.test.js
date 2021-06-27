const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const db = require('../helpers/mongoose');

beforeAll(async () => {
  try {
    await db.connect();
  } catch (error) {
    console.log(error);
  }
});

describe('POST /signup', function() {
  it('responds with json', function(done) {
    request(app)
        .post('/api/v1/user/signup')
        .send({'first_name': 'aseem', 'user_name': 'aseemsampletest', 'password': 'aseem123', 'role': 'worker'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
  });
});

describe('POST /login', function() {
  it('responds with json', function(done) {
    request(app)
        .post('/api/v1/user/signin')
        .send({user_name: 'aseem7570', password: 'aseem123'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
  });
});

describe('GET /users', function() {
  it('responds with json', function(done) {
    request(app)
        .get('/api/v1/user/list')
        .set('Accept', 'application/json')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MjQ3ODk0NzB9.VYp-qXkDBIDImJ_KweX1XQVk-5Dqsi4ZX9CP7x5n52c')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
  });
});

