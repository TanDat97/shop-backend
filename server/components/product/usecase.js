import _ from 'lodash';
import { HttpStatus } from '../../constants';
import { AppError } from '../../core/errors';
import { CoreUsecase } from '../../core/service/usecase';
import { ProductRepo } from './repo';
import { Common } from '../../helpers/common';
import { errorSQL } from '../../helpers/errorMessage';
import { clientConnect } from '../../config/database';

export class ProductUsecase extends CoreUsecase {
  constructor() {
    super(new ProductRepo());
    this.pickFields = ['name', 'slug', 'description', 'type', 'price'];
  }

  async list({
    category_id,
    tag_ids,
    keyword,
    sort_by = 'product_id',
    sort_dir = 'ASC',
    page = 1,
    limit = 10,
  }) {
    try {
      const PAGE = parseInt(page);
      const LIMIT = parseInt(limit);
      const SKIP = (PAGE - 1) * LIMIT;
      let temp = {};
      if (category_id && category_id > 0) {
        temp = this._buildQueryWithCategory({ category_id, tag_ids, keyword, sort_by, sort_dir });
      } else {
        temp = this._buildQuery({ tag_ids, keyword, sort_by, sort_dir });
      }
      let { queryText, params } = temp;
      params = [...params, LIMIT, SKIP];
      const result = await this.repo.executeQuery(queryText, params);
      const doc = Common.populateResult(result[0], 'total_count');
      return {
        items: doc.data,
        total: doc.total,
        page: PAGE,
        limit: LIMIT,
      };
    } catch (err) {
      console.log(err);
      throw this.handleError(err);
    }
  }

  async getDetail(product_id) {
    try {
      const queryText = `SELECT *
        FROM products p
        LEFT JOIN product_category pc ON p.product_id = pc.product_id
        WHERE p.product_id = ? AND is_delete = 0`;
      const params = [product_id];
      const result = await this.repo.executeQuery(queryText, params);
      if (!result || result.length === 0 || result[0].length === 0) {
        throw new AppError('Product not found', HttpStatus.NOT_FOUND);
      }
      return result[0][0];
    } catch (err) {
      console.log(err);
      throw this.handleError(err);
    }
  }

  async create(request) {
    const connection = await clientConnect();
    try {
      await connection.beginTransaction();
      const { queryText, params } = this._getParamsCreateProduct(request);
      const productRes = await connection.query(queryText, params);
      if (productRes[0].affectedRows === 1 && productRes[0].insertId) {
        if (request.category_id) {
          const q = `INSERT INTO product_category(product_id, category_id, created_at, updated_at) VALUES(?, ?, ?, ?)`;
          const p = [
            productRes[0].insertId,
            request.category_id,
            new Date(),
            new Date(),
          ];
          const pcRes = await connection.query(q, p);
          if (pcRes[0].affectedRows !== 1) {
            throw new AppError(
              'Operation was not successful',
              HttpStatus.SERVER_ERROR
            );
          }
        }
      } else {
        throw new AppError('Invalid params', HttpStatus.BAD_REQUEST);
      }
      connection.commit();
      return {};
    } catch (err) {
      await connection.rollback();
      console.log(err);
      throw this.handleError(err);
    } finally {
      await connection.release();
    }
  }

  async update(product_id, request) {
    let result = { message: '' };
    const connection = await clientConnect();
    try {
      await connection.beginTransaction();
      const { queryText, params } = this._getParamsUpdateProduct(
        product_id,
        request
      );
      const productRes = await connection.query(queryText, params);
      if (productRes[0].affectedRows === 1 && productRes[0].changedRows === 1) {
        result.message += 'Updated product success';
        if (request.category_id) {
          const q = `UPDATE product_category SET product_id=?, category_id=?, updated_at=? WHERE product_id=?`;
          const p = [product_id, request.category_id, new Date(), product_id];
          const pcRes = await connection.query(q, p);
        }
      } else {
        throw new AppError('Invalid params', HttpStatus.BAD_REQUEST);
      }
      connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      console.log(err);
      throw this.handleError(err);
    } finally {
      await connection.release();
    }
  }

  async delete(product_id) {
    try {
      const queryText = `UPDATE products
        SET is_delete = 1
        WHERE product_id = ? AND is_delete = 0`;
      const params = [product_id];
      const res = await this.repo.executeQuery(queryText, params);
      if (res.affectedRows === 1) {
        return res.message;
      }
      throw new AppError('Product invalid', HttpStatus.BAD_REQUEST);
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

  _getParamsCreateProduct(request) {
    const { name, slug, description, type, price } = request;
    const queryText = `INSERT INTO
      products(name, slug, description, type, price, is_delete, created_at, updated_at)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      name,
      slug,
      description,
      type,
      price,
      0,
      new Date(),
      new Date(),
    ];
    return { queryText, params };
  }

  _getParamsUpdateProduct(product_id, request) {
    const { name, slug, description, type, price } = request;
    const queryText = `UPDATE products
      SET name=?, slug=?, description=?, type=?, price=?, updated_at=?
      WHERE product_id = ? AND is_delete = 0`;
    const params = [
      name,
      slug,
      description,
      type,
      price,
      new Date(),
      product_id,
    ];
    return { queryText, params };
  }

  _buildQuery({ tag_ids, keyword, sort_by, sort_dir }) {
    let condition = '';
    let params = [];
    if (keyword) {
      condition += 'AND (p.name LIKE ? OR p.description LIKE ?) ';
      params.push('%' + keyword + '%');
      params.push('%' + keyword + '%');
    }
    condition += 'AND is_delete = 0';
    condition = condition.slice(4, condition.length);
    const queryText = `SELECT p.product_id,
                      p.name,
                      p.description,
                      p.price,
                      count(p.product_id) OVER() AS total_count
                      FROM products p
                      WHERE ${condition}
                      GROUP BY p.product_id
                      ORDER BY ${sort_by} ${sort_dir}
                      LIMIT ? OFFSET ? `;
    return { queryText, params };
  }

  _buildQueryWithCategory({ category_id, tag_ids, keyword, sort_by, sort_dir }) {
    let condition = '';
    let params = [];
    params.push(category_id);
    params.push(category_id);
    if (keyword) {
      condition += 'AND (p.name LIKE ? OR p.description LIKE ?) ';
      params.push('%' + keyword + '%');
      params.push('%' + keyword + '%');
    }
    condition += 'AND is_delete = 0';
    condition = condition.slice(4, condition.length);
    const queryText = `WITH temp AS (
                        SELECT  category_id,
                                name as category_name,
                                parent_id
                        FROM   (SELECT * FROM categories c1
                                ORDER BY parent_id, category_id) categories,
                                (select @pv := ?) initialisation
                        WHERE category_id = ? or  (find_in_set(parent_id, @pv) > 0
                                    and   @pv := CONCAT(@pv, ',', category_id))
                      )
                      SELECT
                          p.product_id,
                          p.name,
                          p.description,
                          p.price,
                          cs.parent_id,
                          cs.category_id,
                          cs.category_name,
                          count(p.product_id) OVER() AS total_count
                      FROM temp cs
                      JOIN product_category pc on pc.category_id = cs.category_id
                      JOIN products p on p.product_id = pc.product_id
                      WHERE ${condition}
                      GROUP BY p.product_id
                      ORDER BY ${sort_by} ${sort_dir}
                      LIMIT ? OFFSET ? `;
    return { queryText, params };
  }
}
