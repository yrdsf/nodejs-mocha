import chai from "chai";
import http from "chai-http";

import index from "../src/app";

const expect = chai.expect;
const app = index.listen();

chai.use(http);

describe("Unit testing AQT", () => {
  after(() => app.close);

  describe("GET /", () => {
    it("return a list of products", async () => {
      const res = await chai.request(app).get("/");

      expect(res).to.have.status(200);
    });
  });

  describe("404 error", () => {
    it("return category by incorrect iso", async () => {
      const res = await chai.request(app).get("/NOT_FOUND/404");
      expect(res).to.have.status(404);
    });
  });
});
