import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { pool } from '../db.js';
import { sendEmail } from "../sendOrderMail.js";
import { sendApproval } from "../sendApprovedRefund.js";
import { sendDenied } from "../sendDenyRefund.js";
import { sendDiscount } from '../sendDiscount.js';
import crypto from "crypto" 



import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {

    const orders = await pool.query(`SELECT * from orders`);
    res.send(orders[0]);
  })
);



// function generateHexCode(length) {
//   return crypto.randomBytes(length).toString('hex').toUpperCase().substr(0, length);
// }

// const hexCode = generateHexCode(6); // 3 bytes will generate a 6-character hexadecimal code


orderRouter.post(
  '/discount',
  isAuth,
  expressAsyncHandler(async (req, res) => {

const disCount = req.body.discountNow
// console.log(disCount)
    await sendDiscount(req.user.email, "Heres your Code!", disCount, req.user.name )
    res.send({disCount});
  })
);






orderRouter.get(
  '/oneorder',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC  LIMIT 1;';
    const data = await pool.query(query, [req.user._id]);  
    if (data) {
      res.send(data[0]);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.get(
  '/refunds',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {

    const refunds = await pool.query(`SELECT *
    FROM refunds
    WHERE options IS NULL;`);
    res.send(refunds[0]);
  })
);


orderRouter.post('/refund',
isAuth,
expressAsyncHandler(async(req, res) => {

  const insertQuery = 
  'INSERT INTO refunds (order_id, username, email, refundnote )VALUES(?,?,?,?);';
  let orderId = req.body.orderId
  let name= req.body.name
  let refundnote = req.body.note
  let email = req.body.email
 const data =  await pool.query(insertQuery, [
   orderId,
   name,
   email, 
   refundnote
  ]);
  res.status(201).send({
    refundId: data,
    
  });

}))




orderRouter.post(
  '/refunds/decison/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const refundId = req.params.id;
    const  deci = req.body.deci;
    const refundAdmin = req.user.name
   
 
    const customerQuery = `SELECT * FROM refunds WHERE _id = ?`
    
    const customerEmailObject = await pool.query(customerQuery, [refundId])

    const customerEmail =  customerEmailObject[0][0].email
    const customerName =  customerEmailObject[0][0].username
    const updateQuery = `UPDATE refunds SET options = ?  WHERE  _id = ?`;
    const updateProduct = await pool.query(updateQuery, [
      deci,
      refundId
    ]);
    const updateAdminQuery = `UPDATE refunds SET admin = ?  WHERE  _id = ?`;
    const updateAdmin = await pool.query(updateAdminQuery,[
      refundAdmin,
      refundId
    ]);
    const customerOrderRefund = customerEmailObject[0][0].order_id
    const findOrderQuery= `SELECT * FROM orders WHERE _id = ?`
    
    const theRefundOrder = await pool.query(findOrderQuery, [customerOrderRefund])
const theOrder = theRefundOrder[0][0]
const data = theOrder.orderItems


try {
  for (const item of data) {
    const { _id, quantity } = item;

    const sql = `UPDATE products SET countInStock = countInStock + ? WHERE _id = ?`;
    const result = await pool.query(sql, [quantity, _id]);

  }
} catch (err) {
  console.error('Error updating countInStock:', err);
  res.status(500).send('Error updating countInStock');
}

    const deleteQuery = 'DELETE FROM orders WHERE _id = ?';
    await pool.query(deleteQuery, [customerOrderRefund]);
    const url = "https://team2furniturestore.netlify.app"
    await sendApproval(customerEmail, "Refund Approved!😃", url, customerName )
    res.send({ message: 'Product Updated' });
    
  })
);



orderRouter.post(
  '/refunds/nodecison/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const refundId = req.params.id;
    const  deci = req.body.deci;
    const refundAdmin = req.user.name


    const customerQuery = `SELECT * FROM refunds WHERE _id = ?`
    
    const customerEmailObject = await pool.query(customerQuery, [refundId])

    const customerEmail =  customerEmailObject[0][0].email
    const customerName =  customerEmailObject[0][0].username
    const updateQuery = `UPDATE refunds SET options = ?  WHERE  _id = ?`;

    const updateProduct = await pool.query(updateQuery, [
      deci,
      refundId
    ]);
    const updateAdminQuery = `UPDATE refunds SET admin = ?  WHERE  _id = ?`;
    const updateAdmin = await pool.query(updateAdminQuery,[
      refundAdmin,
      refundId
    ]);
    const url = "https://team2furniturestore.netlify.app"
    await sendDenied(customerEmail, "Refund Denied😕", url, customerName )

    res.send({ message: 'Product Updated' });
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const insertQuery =
      'INSERT INTO orders (orderItems, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, user_id, user_name, realUser, isPaid, isDelivered )VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    // console.log(req.body.orderItems)
    let orderItem = req.body.orderItems.map((x) => ({
      ...x,
      product: x._id,
    }));
    let orderItems = [JSON.stringify(orderItem)];
    // let orderItem = order.orderItems.push(orderItemss)
    let paymentMethod = req.body.paymentMethod;
    let itemsPrice = req.body.itemsPrice;
    let shippingPrice = req.body.shippingPrice;
    let taxPrice = req.body.taxPrice;
    let totalPrice = req.body.totalPrice;
    let user = req.user._id;
    let user_name = req.user.name;
    let realUser = req.user.username
    let isPaid = 'true';
    let isDelivered = 'false';

  const result =  await pool.query(insertQuery, [
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user,
      user_name,
      realUser,
      isPaid,
      isDelivered,
    ]);


    const data = JSON.parse(orderItems[0]);

    try {
      for (const item of data) {
        const { _id, quantity } = item;
 
        const sql = `UPDATE products SET countInStock = countInStock - ? WHERE _id = ?`;
        const result = await pool.query(sql, [quantity, _id]);
     
      }
    } catch (err) {
      console.error('Error updating countInStock:', err);
      res.status(500).send('Error updating countInStock');
    }
    const url = "https://team2furniturestore.netlify.app/orderhistory"
    await sendEmail(req.user.email, "Order has been created📦", url, req.user.name, totalPrice, orderItems)
    res.status(201).send({
      orderItems: orderItems,
      paymentMethod: paymentMethod,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice,
      user: user,
      isPaid: isPaid,
      isDelivered: isDelivered,
      // orderId,
    });
  })
  
);



orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orderQuery = `SELECT
NULL AS _id,
COUNT(*) AS numOrders,
SUM(totalPrice) AS totalSales
FROM orders;`;

    const dataOrder = await pool.query(orderQuery);
    const orders = dataOrder[0];

    // const usersQuery = `
    // SELECT null AS _id, COUNT(*) AS numUsers
    // FROM users`;
    // const dataUser = await pool.query(usersQuery);
    // const users = dataUser[0];

    const usersQuery = `
    SELECT * FROM users`;
    const dataUser = await pool.query(usersQuery);
    const users = dataUser[0];

    

    
    const salesQuery = `SELECT
  DATE(createdAt) AS _id,
  COUNT(*) AS orders,
  SUM(totalPrice) AS sales
FROM orders
GROUP BY DATE(createdAt)
ORDER BY DATE(createdAt) ASC`;

    const salesData = await pool.query(salesQuery);
    const dailyOrders = salesData[0];

    const categoriesQuery = `
    SELECT title AS _id, COUNT(*) AS count
    FROM categories
    GROUP BY title;
  `;
    const data = await pool.query(categoriesQuery);
    const productCategories = data[0];

    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT * FROM orders WHERE user_id = ?';
    const data = await pool.query(query, [req.user._id]);
    // console.log(data);
    // const orders = await Order.find({ user: req.user._id });
    // res.send(data);
    if (data) {
      res.send(data[0]);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const query = 'SELECT * FROM orders WHERE _id= ?';
    const data = await pool.query(query, [orderId]);
    const order = data[0][0];
    // const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.get(
  '/refunds/:id',
  expressAsyncHandler(async (req, res) => {
    const refundId = req.params.id;

    const query = 'SELECT * FROM refunds WHERE _id= ?';
    const data = await pool.query(query, [refundId]);
    const order = data[0][0].order_id;

    const query2 = 'SELECT * FROM orders WHERE _id= ?';
    const data2 = await pool.query(query2, [order]);
    const refundOrders = data2[0][0];


    if (refundOrders) {
      res.send(refundOrders);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);


orderRouter.get(
  '/refunds/options/:id',
  expressAsyncHandler(async (req, res) => {
    const refundId = req.params.id;

    const query = 'SELECT * FROM refunds WHERE order_id= ?';
    const data = await pool.query(query, [refundId]);
    const order = data[0][0];

    // console.log(order)
    if (order) {
      res.send(order);
    } else {
      return
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.get(
  '/refunds/note/:id',
  expressAsyncHandler(async (req, res) => {
    const refundId = req.params.id;

    const query = 'SELECT * FROM refunds WHERE _id= ?';
    const data = await pool.query(query, [refundId]);
    const order = data[0][0];

    // console.log(order)
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
