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

// productRouter.put(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const productId = req.params.id;
//     const query = 'SELECT * FROM products WHERE _id= ?';
//     const data = await pool.query(query, [productId]);
//     const product = data[0][0];
//     if (product) {
//       product.name = req.body.name;
//       product.slug = req.body.slug;
//       product.price = req.body.price;
//       product.image = req.body.image;
//       product.images = req.body.images;
//       product.category = req.body.category;
//       product.brand = req.body.brand;
//       product.countInStock = req.body.countInStock;
//       product.description = req.body.description;
//       await product.save();
//       res.send({ message: 'Product Updated' });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    // const query = 'SELECT * FROM products WHERE _id = ?';
    // const data = await pool.query(query, [productId]);
    // const product = data[0][0];

    const updateQuery = `UPDATE products SET  name = ?, slug = ?,  price = ?,  image = ?, images = ?, category = ?,  brand = ?, countInStock = ?,  description = ?  WHERE  _id = ?`;

    // let name = req.body.name;
    // let slug = req.body.slug;
    // let price = req.body.price;
    // let image = req.body.image;
    // let images = req.body.images;
    // let category = req.body.category;
    // let brand = req.body.brand;
    // let countInStock = req.body.countInStock;
    // let description = req.body.description;

    // if (product) {
    await pool.query(updateQuery, [
      req.body.name,
      req.body.slug,
      req.body.price,
      req.body.image,
      req.body.images,
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

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
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
        // console.log(`The array contains the value.`);
        return res
          .status(400)
          .send({ message: 'You have not purchased this item' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      // console.log(product);
      // const updatedProduct = await product.save();

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
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
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
