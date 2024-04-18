import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { pool } from '../db.js';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await pool.query(`SELECT * from products`);
  res.send(products[0]);
});

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const query =
      'INSERT INTO products (name, slug, image, price, category, brand, countInStock, rating, numReviews, description, images, reviews )VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

    let name = req.body.name;
    let slug = req.body.slug;
    let image = req.body.image;
    let price = req.body.price;
    let category = req.body.category;
    let brand = req.body.brand;
    let countInStock = req.body.countInStock;
    let rating = 0;
    let numReviews = 0;
    let description = req.body.description;
    let images = '[]';
    let reviews = '[]';

    const product = await pool.query(query, [
      name,
      slug,
      image,
      price,
      category,
      brand,
      countInStock,
      rating,
      numReviews,
      description,
      images,
      reviews,
    ]);
    res.send({ message: 'Product Created', product });
  })
);



productRouter.post(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
   
    const updateQuery = `UPDATE products SET name = ?, slug = ?,  price = ?,  image = ?, category = ?,  brand = ?, countInStock = ?,  description = ? WHERE  _id = ?`;

    const updateProduct = await pool.query(updateQuery, [
      req.body.name,
      req.body.slug,
      req.body.price,
      req.body.image,
      req.body.category,
      req.body.brand,
      req.body.countInStock,
      req.body.description,
      productId,
    ]);

    res.send({ message: 'Product Updated' });
    // } else {
    //   res.status(404).send({ message: 'Product Not Found' });
    // }
  })
);




productRouter.post(
  '/restock/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
// let stringer = productId.toString()

    const updateQuery = `UPDATE products SET countInStock = ? WHERE  _id = ?`;

    const updateProduct = await pool.query(updateQuery, [
    
      req.body.value,

      productId,
    ]);

    res.send({ message: 'Product Updated' });
    // } else {
    //   res.status(404).send({ message: 'Product Not Found' });
    // }
  })
);


productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT * FROM products WHERE _id= ?';
    const data = await pool.query(query, [req.params.id]);
    const product = data[0][0];

    if (product) {
      const deleteQuery = `DELETE FROM products
      WHERE _id = ?`;
      await pool.query(deleteQuery, [req.params.id]);
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;

    const query = 'SELECT * FROM products WHERE _id= ?';
    const data = await pool.query(query, [productId]);
    const product = data[0][0];

    const query2 = 'SELECT * FROM orders WHERE user_id= ?';
    const userOrders = await pool.query(query2, [req.user._id]);
    const orders = userOrders[0];

    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const allOrderItems = [];

      orders.forEach((order) => {
        allOrderItems.push(...order.orderItems);
      });

      const idsArray = allOrderItems
        .map((obj) => obj._id)
        .filter((id) => typeof id === 'number');

      const stoi = parseInt(req.params.id);

      if (!idsArray.includes(stoi)) {
        return res
          .status(400)
          .send({ message: 'You have not purchased this item' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        id:req.user._id
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      
      const updateQuery = `
      UPDATE products 
      SET reviews = ?, numReviews = ?, rating = ?
      WHERE _id = ?
    `;

      const updatedProduct = await pool.query(updateQuery, [
        JSON.stringify(product.reviews),
        product.numReviews,
        product.rating,
        productId,
      ]);

      res.status(201).send({
        message: 'Review Created',
        review: product.reviews[product.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    // const products = await Product.find()
    const data = await pool.query(`SELECT * from products`);
    // console.log(products[0][0]);
    const products = data[0];
    // .skip(pageSize * (page - 1))
    // .limit(pageSize);
    // const countProducts = await Product.countDocuments();
    res.send({
      products,
      // countProducts,
      page,
      // pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const category = req.query.category;
    const searchQuery = `SELECT * FROM products WHERE category = ?`;
    const data = await pool.query(searchQuery, [category]);
    const products = data[0];

    res.send({
      products,
    });
  })
);
productRouter.get(
  '/bsearch',
  expressAsyncHandler(async (req, res) => {
    const brand = req.query.brand;
    const searchQuery = `SELECT * FROM products WHERE brand = ?`;
    const data = await pool.query(searchQuery, [brand]);
    
    const products = data[0];

    res.send({
      products,
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT * FROM categories';
    const data = await pool.query(query);
    const titles = data[0];
    const categories = titles.map((item) => item.title);
    res.send(categories);
    
  })
);
productRouter.get(
  '/brands',
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT DISTINCT brand FROM products';
    const data = await pool.query(query);
    const brands = data[0];
    const brandNamesArray = brands.map(obj => obj.brand);
    res.send(brandNamesArray);
    
  })
);

productRouter.get(
  '/rallratings',
  expressAsyncHandler(async (req, res) => {
    const brand = req.query.brand;
    const searchQuery = `SELECT * FROM products WHERE rating= ?`;
    const data = await pool.query(searchQuery, [brand]);
    
    const products = data[0];

    res.send({
      products,
    });
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  const query = 'SELECT * FROM products WHERE slug= ?';
  const product = await pool.query(query, [slug]);

  if (product) {
    res.send(product[0][0]);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM products WHERE _id= ?';
  const product = await pool.query(query, [id]);

  if (product) {
    res.send(product[0][0]);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
