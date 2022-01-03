import { query } from '../server/config/database';

/**
 * Create Table
 */
const createCategoryTable = `CREATE TABLE IF NOT EXISTS categories(
  category_id integer PRIMARY KEY AUTO_INCREMENT,
  parent_id integer,
  name nvarchar(255)  NOT NULL,
  slug nvarchar(255) UNIQUE NOT NULL,
  level INT
)`;

const createProductTable = `CREATE TABLE IF NOT EXISTS products (
  product_id integer PRIMARY KEY AUTO_INCREMENT,
  name nvarchar(255) NOT NULL,
  slug nvarchar(255) UNIQUE NOT NULL,
  description nvarchar(500),
  type nvarchar (20),
  price decimal NOT NULL,
  is_delete integer NOT NULL,
  created_at timestamp,
  updated_at timestamp
)`;

const createTagTable = `CREATE TABLE IF NOT EXISTS tags (
  tag_id integer PRIMARY KEY AUTO_INCREMENT,
  name nvarchar(255) NOT NULL,
  is_delete integer NOT NULL,
  created_at timestamp,
  updated_at timestamp
)`;

const createProductCategoryTable = `CREATE TABLE IF NOT EXISTS product_category(
  product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
  category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
  created_at TIMESTAMP,
  updated_at timestamp,
  PRIMARY KEY (product_id, category_id)
)`;

const createProductTagTable = `CREATE TABLE IF NOT EXISTS product_tag(
  product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
  tag_id INT NOT NULL REFERENCES tags(tag_id) ON DELETE RESTRICT,
  created_at TIMESTAMP,
  updated_at timestamp,
  PRIMARY KEY (product_id, tag_id)
)`;

/**
 * Drop Table
 */
const dropCategoryTable = 'DROP TABLE IF EXISTS categories';

const dropProductTable = 'DROP TABLE IF EXISTS products';

const dropTagTable = 'DROP TABLE IF EXISTS tags';

const dropProductCategoryTable = 'DROP TABLE IF EXISTS product_category';

const dropProductTagTable = 'DROP TABLE IF EXISTS product_tag';

/**
 * Create All Tables
 */
const createAllTables = async () => {
  try {
    const categories = await query(createCategoryTable, []);
    console.log('categories', categories);
    const products = await query(createProductTable, []);
    console.log('products', products);
    const tags = await query(createTagTable, []);
    console.log('tags', tags);
    const product_category = await query(createProductCategoryTable, []);
    console.log('product_category', product_category);
    const product_tag = await query(createProductTagTable, []);
    console.log('product_tag', product_tag);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Drop All Tables
 */
const dropAllTables = async () => {
  try {
    const categories = await query(dropCategoryTable, []);
    console.log('categories', categories);
    const products = await query(dropProductTable, []);
    console.log('products', products);
    const tags = await query(dropTagTable, []);
    console.log('tags', tags);
    const product_category = await query(dropProductCategoryTable, []);
    console.log('product_category', product_category);
    const product_tag = await query(dropProductTagTable, []);
    console.log('product_tag', product_tag);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createAllTables,
  dropAllTables,
};

require('make-runnable');
