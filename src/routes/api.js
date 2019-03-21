import Router from "koa-router";
import ProductController from "../controllers";

let router = new Router();
let products = new ProductController();

router.get("/", products.get);

export default router;
