import _ from 'lodash';
import { HttpStatus } from '../../constants';
import { AppError } from '../../core/errors';
import { CoreUsecase } from '../../core/service/usecase';
import { CategoryRepo } from './repo';
import { Common } from '../../helpers/common';
import { errorSQL } from '../../helpers/errorMessage';

export class CategoryUsecase extends CoreUsecase {
  constructor() {
    super(new CategoryRepo());
  }

  async listCommon() {
    try {
      const queryText = `SELECT c.category_id, c.parent_id, c.name
        FROM categories c`;
      const res = await this.repo.executeQuery(queryText, []);
      return res[0];
    } catch (err) {
      console.log(err);
      throw this.handleError(err);
    }
  }

  handleError(err) {
    if (err.code && !isNaN(err.code)) {
      return new AppError(err.message || 'Error', err.code);
    }
    if (err.code && err.errno) {
      const message = errorSQL[err.errno]
        ? errorSQL[err.errno].message
        : 'Error';
      return new AppError(message, HttpStatus.BAD_REQUEST);
    }
    return new AppError('Some thing went wrong', HttpStatus.SERVER_ERROR);
  }
}
