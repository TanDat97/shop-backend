import { ProductHandler } from '../components/product/handler';
import {
  CreateProductCheck,
  UpdateProductCheck,
} from '../components/product/validate';

import { CategoryHandler } from '../components/category/handler';

require('express-group-routes');

export default app => {
  app.get('/', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Codebase API!',
    })
  );

  app.get('/healthz', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the API!',
    })
  );

  app.group('/product', product => {
    const productHandler = new ProductHandler();
    product.get('/', productHandler.list.bind(productHandler));
    product.get('/:product_id', productHandler.detail.bind(productHandler));
    product.post(
      '/',
      CreateProductCheck.validator.bind(CreateProductCheck),
      productHandler.create.bind(productHandler)
    );
    product.put(
      '/:product_id',
      UpdateProductCheck.validator.bind(UpdateProductCheck),
      productHandler.update.bind(productHandler)
    );
    product.delete('/delete/:id', productHandler.delete.bind(productHandler));
  });

  app.group('/category', category => {
    const categoryHandler = new CategoryHandler();
    category.get(
      '/list-common',
      categoryHandler.listCommon.bind(categoryHandler)
    );
  });
};
