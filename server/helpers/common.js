import config from '../config';
import { Constant } from '../config/constant';

export const Common = {
  parseArrayToString(array) {
    let string = '';
    array.forEach(element => {
      string += string === '' ? element.msg : '<br>' + element.msg;
    });
    return string;
  },

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  setKeyForObject(object, response, array) {
    if (array.length > 0) {
      array.forEach(element => {
        response[element] = object[element];
      });
    }
    return response;
  },

  formatErrMgs(arrErrField) {
    let arrErr = [];
    for (let key in arrErrField) {
      let row = arrErrField[key];
      arrErr.push(row['message']);
    }
    return arrErr.join('<br>');
  },

  changeDate(arg, fmInput, fmOutput) {
    let result = moment(arg, fmInput).format(fmOutput);
    return result.toLocaleLowerCase().includes('invalid') ? null : result;
  },

  isBoolean(arg) {
    return typeof arg === 'boolean';
  },

  isNumber(arg) {
    return typeof arg === 'number';
  },

  isString(arg) {
    return typeof arg === 'string';
  },

  isFunction(arg) {
    return typeof arg === 'function';
  },

  isObject(arg) {
    return arg !== null && typeof arg === 'object';
  },

  populateResult(data, key) {
    const result = {
      data: [],
      total: 0,
    };
    data.forEach(e => {
      result.total = e[key];
      delete e[key];
      result.data.push(e);
    });
    return result;
  },
};
