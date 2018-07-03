import * as express from 'express';
import * as request from 'supertest';

import { router as ClientRouter } from '.';


describe('Tree Router Test Suite', () => {

    const app = express().use(ClientRouter);

    it('should return a proper body', async () => {
        await request(app)
            .get('/tree')
            .expect(200)
            .then(res => {
                expect(res.body.data).toHaveProperty('content');
                expect(res.body.data.content).toBeInstanceOf(Array);
                expect(res.body.data).toHaveProperty('root');
                expect(typeof res.body.data.root).toBe('string');
            });
    });

});
