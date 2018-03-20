import * as express from "express";
import * as request from "supertest";

import { Router as ClientRouter } from ".";


describe("Client Router Test Suite", () => {

    const app = express().use(ClientRouter);

    it("should return a proper body", async () => {
        await request(app)
            .get("/tree")
            .expect(200)
            .then(res => {
                expect(res.body).toHaveProperty("content");
                expect(res.body.content).toBeInstanceOf(Array);
                expect(res.body).toHaveProperty("root");
                expect(typeof res.body.root).toBe("string");
            });
    });

    it("should return a proper body", async () => {
        await request(app)
            .get("/tree")
            .expect(200)
            .then(res => {
                process.env.NODE_CONFIG_DIR = undefined;
                expect(res.body).toHaveProperty("content");
                expect(res.body.content).toBeInstanceOf(Array);
                expect(res.body).toHaveProperty("root");
                expect(typeof res.body.root).toBe("string");
            });
    });

});
