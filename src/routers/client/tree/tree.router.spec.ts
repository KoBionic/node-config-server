import * as express from 'express';
import * as request from 'supertest';
import { router, TREE_ROUTER_URL } from '.';


describe('Tree Router Test Suite', () => {

    const app = express().use(router);

    it('should return a proper body', async () => {
        await request(app)
            .get(TREE_ROUTER_URL)
            .expect(200)
            .then(res => {
                expect(res.body).toHaveProperty('path');
                expect(res.body).toHaveProperty('name');
                expect(res.body.type).toBe('directory');
                expect(res.body).toHaveProperty('size');
                expect(res.body).toHaveProperty('children');
                expect(res.body.children).toBeInstanceOf(Array);
            });
    });

});
