import * as bodyParser from 'body-parser';
import * as express from 'express';
import { readFile as readFileLegacy, writeFile as writeFileLegacy } from 'fs';
import { join } from 'path';
import * as request from 'supertest';
import { promisify } from 'util';
import { FILE_ROUTER_URL, router } from '.';
import { ConfigurationService } from '../../../services';
const readFile = promisify(readFileLegacy);
const writeFile = promisify(writeFileLegacy);


describe('File Router Test Suite', () => {

    const app = express().use(bodyParser.text()).use(router);
    const confService = ConfigurationService.Instance;
    const fileContent = '{"file":"default.json","id":"0001","type":"donut","name":"Cake","ppu":0.55}';
    const testFileContent = '{"batters":{"batter":[{"id":"1001","type":"Regular"},{"id":"1003","type":"Blueberry"}]}}';
    const fileUrl = 'test/json/file-router.test.json';

    beforeAll(async () => {
        await writeFile(`${confService.config.baseDirectory}/${fileUrl}`, fileContent, 'utf8');
    });

    describe(`GET ${FILE_ROUTER_URL} Tests`, () => {

        it('should return a 400 HTTP code when no filepath is provided', async () => {
            await request(app)
                .get(FILE_ROUTER_URL)
                .expect(400);
        });

        it('should return a 404 HTTP code when file does not exist', async () => {
            await request(app)
                .get(`${FILE_ROUTER_URL}/i/do/not/exists`)
                .expect(404);
        });

        it('should return a 403 HTTP code when requested resource is in parent context', async () => {
            await request(app)
                .get(`${FILE_ROUTER_URL}/../package.json`)
                .expect(403);
        });

        it('should return requested file content', async () => {
            await request(app)
                .get(`${FILE_ROUTER_URL}/${fileUrl}`)
                .expect(200)
                .then(res => {
                    expect(JSON.stringify(res.body)).toEqual(fileContent);
                });
        });
    });

    describe(`PUT ${FILE_ROUTER_URL} Tests`, () => {

        it('should return a 400 HTTP code when no body is provided', async () => {
            await request(app)
                .put(FILE_ROUTER_URL)
                .expect(400);
        });

        it('should return a 400 HTTP code when no filepath is provided', async () => {
            await request(app)
                .put(FILE_ROUTER_URL)
                .send(fileContent)
                .type('text')
                .expect(400);
        });

        it('should return a 404 HTTP code when file does not exist', async () => {
            await request(app)
                .put(`${FILE_ROUTER_URL}/i/do/not/exists`)
                .expect(404);
        });

        it('should modify file content', async () => {
            await request(app)
                .put(`${FILE_ROUTER_URL}/${fileUrl}`)
                .send(testFileContent)
                .type('text')
                .expect(200)
                .then(async () => expect(await readFile(join(confService.config.baseDirectory, fileUrl), 'utf8')).toBe(testFileContent));
        });

    });

});
