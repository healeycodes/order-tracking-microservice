const request = require('supertest');
const app = require('../app');
const assert = require('assert');

//==================== Order Tracking API test ====================

/**
 * Test creating a tracking instance
 */
describe('GET /private/orders', () => {
    it('respond with a new order identifer', (done) => {
        request(app)
            .get('/private/orders')
            .expect((res) => {
                // A non-empty UUID
                assert(res.text.length > 0);
            })
            .expect(200, done);
    });
});

/**
 * Testing setting a tracking instance's state
 */
describe('POST /private/orders', () => {
    it('respond with 200', (done) => {
        // Create an order instance
        request(app)
            .get('/private/orders')
            .end((err, res) => {
                request(app)
                    // Change its order stage
                    .post('/private/orders')
                    .send({
                        orderId: res.text,
                        stage: 2
                    })
                    .expect(200, done);
            });
    });
});

/**
 * Test client accessing a tracking instance
 */
describe('GET /public/orders/:orderId', () => {
    it('respond with an order stage', (done) => {
        // Create an order instance
        request(app)
            .get('/private/orders')
            .end((err, res) => {
                request(app)
                    // Request this instance's stage from client route
                    .get(`/public/orders/${res.text}`)
                    .expect((res) => {
                        const stage = res.body.stage
                        // An integer within 1-5
                        assert(stage > 0 && stage < 6 );
                    })
                    .expect(200, done);
            });
    });
});
