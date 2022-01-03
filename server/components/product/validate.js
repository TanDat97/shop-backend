import { CoreValidate } from '../../core/service/validate';

const CreateProductCheck = new CoreValidate({
  name: 'required',
  price: 'required',
});

const UpdateProductCheck = new CoreValidate({
  name: 'required',
  price: 'required',
});



module.exports = {
  CreateProductCheck,
  UpdateProductCheck,
};
