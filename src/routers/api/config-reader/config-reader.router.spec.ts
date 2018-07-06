import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as request from 'supertest';
import { router } from '.';


describe('Config Reader Router Test Suite', () => {

    const app = express().use(bodyParser.text()).use(router);

    it('should return a 400 HTTP code when no filepath is provided', async () => {
        await request(app)
            .get('/')
            .expect(400);
    });

});
