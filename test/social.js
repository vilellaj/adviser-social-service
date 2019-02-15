const chai = require('chai');
const should = chai.should();

process.env.NODE_ENV = 'test';

describe('Social', () => {
    beforeEach((done) => { //Before each test we empty the database
        done();
    });

  describe('Social integration', () => {
      it('it should integrate with twitter', (done) => {
          const integration = {};
          integration.should.be.a('object');
          done();
      });
  });
});