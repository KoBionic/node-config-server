import * as express from "express";
import * as request from "supertest";

import { Router as ClientRouter } from ".";
import { ClientResponseHandler, ErrorHandler } from "../../handlers";


describe("Client Router Test Suite", () => {

    const app = express()
        .use(ClientRouter)
        .use("/*", ClientResponseHandler)
        .use("/*", ErrorHandler);

    it("should return a proper body", async () => {
        await request(app)
            .get("/tree")
            .expect(200)
            .then(res => {
                expect(res.body.data).toHaveProperty("content");
                expect(res.body.data.content).toBeInstanceOf(Array);
                expect(res.body.data).toHaveProperty("root");
                expect(typeof res.body.data.root).toBe("string");
            });
    });

});
