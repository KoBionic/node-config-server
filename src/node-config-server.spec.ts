import { NodeConfigServer } from "./node-config-server";
import { Application, Response } from "express";
import * as request from "supertest";

const URL = "api/1/test/v1/";


describe("Node Config Server Test Suite", () => {

    let app: Application;

    beforeAll(() => {
        app = new NodeConfigServer().app;
    });

    it("should return a 200 HTTP code when reading a good JSON file", () => {
        request(app)
            .get(`${URL}/goodFile.json`)
            .expect(200, { host: "127.0.0.1" });
    });

    it("should return a 500 HTTP code when the file is not good", () => {
        request(app)
            .get(`${URL}/badFile.json`)
            .expect(500);
    });

    it("should return a 404 HTTP code when the file is not found", () => {
        request(app)
            .get(`${URL}/unknownFile.json`)
            .expect(404);
    });

    it("should return a 400 HTTP code when the file is not entered", () => {
        request(app)
            .get(`${URL}`)
            .expect(400);
    });

    it("should return a string", () => {
        request(app)
            .get(`${URL}/goodFile.json/host`)
            .expect(200, "127.0.0.1");
    });

    it("should return a string", () => {
        request(app)
            .get(`${URL}/nestedFile.json/level0/value`)
            .expect(200, "Hi");
    });

    it("should return a string", () => {
        request(app)
            .get(`${URL}/goodFile.jsonx`)
            .expect(200, "This is plain text\n");
    });

    it("should return a string", () => {
        request(app)
            .get(`${URL}/nestedFile.json/level0/level1/level2/value`)
            .expect(200, "Ho");
    });

    it("should return a 404", () => {
        request(app)
            .get(`${URL}/nestedFile.json/level2/value`)
            .expect(404);
    });

});
