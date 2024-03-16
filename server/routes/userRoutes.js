import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl,
  sendEmail,
  errorHandler,
} from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await pool.query('SELECT * FROM users');

    res.send(users[0]);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await pool.query('SELECT * FROM users WHERE _id = ?', [
      req.params.id,
    ]);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT * FROM users WHERE _id= ?';
    const user = await pool.query(query, [req.user._id]);
    console.log(user[0]);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      let name = req.body.name;
      let email = req.body.email;
      let password = bcrypt.hashSync(req.body.password);

      const query = `UPDATE users SET name = ?, email = ?, password =? WHERE _id = ?`;

      const updatedUser = await pool.query(query, [
        name,
        email,
        password,
        req.user._id,
      ]);

      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const query = 'SELECT * FROM users WHERE email= ?';
    const theuser = await pool.query(query, [req.body.email]);
    const user = theuser[0];

    if (user.length == 0) {
      res.status(404).send({ message: 'User not found' });
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      user.resetToken = token;
      console.log(user);
      // await user.save();
      // const query =
      // `UPDATE users SET name = ?, email = ?, password =? WHERE _id = ?`;

      // const updatedUser = await pool.query(query, [
      //   name, email, password, req.user._id

      //  ]);
      //reset link
      console.log(`${baseUrl()}reset-password/${token}`);

      await sendEmail(
        user.email,
        'Reset password',
        `${baseUrl()}/reset-password/${token}`
      );
      res.send({ message: 'We sent reset password link to your email.' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const updateQuery = `UPDATE users SET name = ?, email = ?,  isAdmin = ? WHERE  _id = ?`;

    const updateUser = await pool.query(updateQuery, [
      req.body.name,
      req.body.email,
      Boolean(req.body.isAdmin),
      userId,
    ]);

    if (updateUser) {
      res.send({ message: 'User Updated' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // const user = await User.findById(req.params.id);
    const userId = req.params.id;
    const checkQuery = `SELECT * FROM users WHERE _id = ?`;
    const thisUser = await pool.query(checkQuery, [userId]);
    const thisIsAdmin = thisUser[0][0].isAdmin;

    if (thisIsAdmin === 'true') {
      res.send({ message: 'Cannot delete Admin' });
      return;
    } else {
      const deleteQuery = 'DELETE FROM users WHERE _id = ?';

      const deleteUser = await pool.query(deleteQuery, [userId]);
      res.send({ message: 'User Deleted' });
    }

    // if (deleteUser) {
    // } else {
    //   res.status(404).send({ message: 'User Not Found' });
    // }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    // const user = await User.findOne({ email: req.body.email });
    const { email } = req.body;

    const query = 'SELECT * FROM users WHERE email= ?';
    const user = await pool.query(query, [email]);

    if (user) {
      if (bcrypt.compareSync(req.body.password, user[0][0].password)) {
        res.send({
          _id: user[0][0]._id,
          name: user[0][0].name,
          email: user[0][0].email,
          isAdmin: user[0][0].isAdmin,
          token: generateToken(user[0][0]),
        });

        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const query = 'INSERT INTO users (name, email, password )VALUES(?, ?, ?);';

    let name = req.body.name;
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password);

    const user = await pool.query(query, [name, email, password]);

    res.send({
      _id: user.insertId,
      name: name,
      email: email,
      isAdmin: false,
      token: generateToken(user),
    });
  })
);

export default userRouter;
