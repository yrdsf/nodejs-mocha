import ProductRepository from "../repositories";

let repository = new ProductRepository();

export default class ProductController {
  async get(ctx) {
    let response = await repository.get();
    ctx.body = response;
  }
}
