import { Constant } from '../../config/constant';
import { Context } from '../../helpers/context';
import { pool } from '../../config/database';

/**
 * @export
 * @class CoreRepo
 */
export class CoreRepo {
  constructor() {
    this.context = new Context();
  }

  async executeQuery(queryText, params) {
    return pool.query(queryText, params)
  }

  paginate(query, page = 1, limit = 10, sort = '-_id', select = null, populate = null, lean = false) {
    const condition = { ...this.getBaseConditionByRole(), ...query };

    condition.is_delete = Constant.INACTIVE;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      lean: lean,
    };
    if (populate !== null) {
      options.populate = populate;
    }

    if (lean !== null) {
      options.lean = lean;
    }

    if (select !== null) {
      options.select = select;
    }

    return this.model.paginate(condition, options);
  }

}
