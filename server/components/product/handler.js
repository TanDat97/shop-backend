import { ProductUsecase } from './usecase';

export class ProductHandler {
  constructor() {
    this.productUseCase = new ProductUsecase();
  }

  async list(req, res, next) {
    try {
      const result = await this.productUseCase.list(req.query);

      res.send({
        message: 'Success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async detail(req, res, next) {
    try {
      const { product_id } = req.params;
      const result = await this.productUseCase.getDetail(product_id);

      res.send({
        message: 'Success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const result = await this.productUseCase.create(req.body);

      res.send({
        message: 'Success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { product_id } = req.params;
      const result = await this.productUseCase.update(product_id, req.body);

      res.send({
        message: 'Success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { product_id } = req.params;
      const result = await this.productUseCase.delete(product_id);

      res.send({
        message: 'Delete Success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
