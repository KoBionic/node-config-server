import { Application } from 'express';
import * as request from 'supertest';
import { NodeConfigServer } from './node-config-server';
import { API_URL } from './routers/api';

const URL = `${API_URL}/test/v1/`;


describe('Node Config Server Test Suite', () => {

    let app: Application;

    beforeAll(async done => {
        app = (await new NodeConfigServer().init()).app;
        done();
    });

    it('should return a 200 HTTP code when reading a good JSON file', done => {
        request(app)
            .get(`${URL}/goodFile.json`)
            .expect(200, { host: '127.0.0.1' }, done);
    });

    it('should return a 500 HTTP code when the file is not good', done => {
        request(app)
            .get(`${URL}/badFile.json`)
            .expect(500, done);
    });

    it('should return a 404 HTTP code when the file is not found', done => {
        request(app)
            .get(`${URL}/unknownFile.json`)
            .expect(404, done);
    });

    it('should return a 400 HTTP code when the file is not entered', done => {
        request(app)
            .get(`${URL}`)
            .expect(400, done);
    });

    it('should return a string', done => {
        request(app)
            .get(`${URL}/goodFile.json/host`)
            .expect(200, '127.0.0.1', done);
    });

    it('should return a string', done => {
        request(app)
            .get(`${URL}/nestedFile.json/level0/value`)
            .expect(200, 'Hi', done);
    });

    it('should return a string', done => {
        request(app)
            .get(`${URL}/goodFile.jsonx`)
            .expect(200, 'This is plain text\n', done);
    });

    it('should return a string', done => {
        request(app)
            .get(`${URL}/nestedFile.json/level0/level1/level2/value`)
            .expect(200, 'Ho', done);
    });

    it('should return a 404', done => {
        request(app)
            .get(`${URL}/nestedFile.json/level2/value`)
            .expect(404, done);
    });

});
