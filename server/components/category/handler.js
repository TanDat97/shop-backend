import { CategoryUsecase } from './usecase';

export class CategoryHandler {
  constructor() {
    this.categoryUseCase = new CategoryUsecase();
  }

  async listCommon(req, res, next) {
    try {
      const result = await this.categoryUseCase.listCommon();

      res.send({
        message: 'Success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
