import fs from 'fs';
import Niv from 'node-input-validator';
import { Common } from '../../helpers/common';
import { AppError } from '../errors';

export class CoreValidate {
  constructor(rules) {
    this.rules = rules;

    this.newRule();
  }

  async getUsecase(component) {
    const path = `${__dirname}/../../components/${component}`;
    if (!fs.existsSync(path) || !fs.existsSync(path + '/usecase.js')) {
      throw new AppError('Component not found!');
    }
    const usecase = require(path + '/usecase.js');
    const className = Object.keys(usecase).pop();

    return new usecase[className]();
  }

  newRule() {
  }

  /**
   * Replace string inside [] to data in request
   *
   * @param {*} req
   * @memberof CoreValidate
   */
  // eslint-disable-next-line no-unused-vars
  serializeRules(req) {
    const readedRule = [];
    for (let key in this.rules) {
      const matches = this.rules[key].match('\\[[^\\]]*]');
      if (!matches) {
        readedRule[key] = this.rules[key];

        continue;
      }

      const executeCode = 'req.' + matches[0].replace(/[[\]']+/g, ''); //eg: req.body.code
      const value = eval(executeCode);
      if (typeof value === 'undefined') {
        throw new AppError(`Request missing params ${executeCode}`, 500);
      }

      readedRule[key] = this.rules[key].replace(matches[0], value);
    }

    return readedRule;
  }

  async validator(req, res, next) {
    try {
      // Convert params to body
      Object.keys(req.params).forEach(
        (key) => (req.body[key] = req.params[key])
      );
      const readedRules = this.serializeRules(req);

      const v = new Niv.Validator(req.body, readedRules);
      const passed = await v.check();
      if (!passed) {
        this.errMsg = Common.formatErrMgs(v.errors);
        throw new AppError(this.errMsg, 422);
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}
