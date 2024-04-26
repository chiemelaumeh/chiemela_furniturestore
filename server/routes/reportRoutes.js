import express from "express";
import expressAsyncHandler from "express-async-handler";
import { pool } from "../db.js";

import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from "../utils.js";

const reportRouter = express.Router();

reportRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { firstSelection, secondSelection, thirdSelection } = req.body;

    const catArray = [];
    if (firstSelection === "Products / Categories") {
      if (secondSelection === "Best Selling Category") {
        if (thirdSelection === "All time") {
          const order = await pool.query(`SELECT orderItems FROM orders`);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }

        if (thirdSelection === "Last week") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW();`);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }

        if (thirdSelection === "Today") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW();`);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last month") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
          `);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }

        if (thirdSelection === "Last Year") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();
          ;
          `);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
      }
      if (secondSelection === "Worst Selling Category") {
        if (thirdSelection === "All time") {
          const order = await pool.query(`SELECT orderItems FROM orders`);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }

        if (thirdSelection === "Last week") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW();`);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }

        if (thirdSelection === "Today") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW();`);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last month") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
          `);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }

        if (thirdSelection === "Last Year") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();
          ;
          `);

          const orders = order[0];

          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.category;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
      }

      if (secondSelection === "Best selling product") {
        if (thirdSelection === "All time") {
          const order = await pool.query(`SELECT orderItems FROM orders`);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Today") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW();`);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last month") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
          `);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last week") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW();`);

          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last Year") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();
          ;
          `);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
      }

      if (secondSelection === "Worst selling product") {
        if (thirdSelection === "All time") {
          const order = await pool.query(`SELECT orderItems FROM orders`);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Today") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW();`);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last month") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
          `);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last week") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW();`);

          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
        if (thirdSelection === "Last Year") {
          const order = await pool.query(`SELECT orderItems
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();
          ;
          `);
          const orders = order[0];
          orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              const allCategories = orderItem.name;
              catArray.push(allCategories);
            });
          });

          let newArr = [];
          for (let item of catArray) {
            if (item !== undefined) {
              newArr.push(item);
            }
          }

          res.send({ newArr });
        }
      }

      if (secondSelection === "Highest Transactions") {
        if (thirdSelection === "All time") {
          const order = await pool.query(`SELECT totalPrice FROM orders`);
          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Today") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW();`);
          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Last week") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW();`);

          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Last month") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
          `);

          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Last Year") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();
          ;
          `);

          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
      }
      if (secondSelection === "Lowest Transactions") {
        if (thirdSelection === "All time") {
          const order = await pool.query(`SELECT totalPrice FROM orders`);
          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Today") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW();`);
          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Last week") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW();`);

          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Last month") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
          `);

          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
        if (thirdSelection === "Last Year") {
          const order = await pool.query(`SELECT totalPrice
          FROM orders
          WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();
          ;
          `);

          const orders = order[0];

          const newArr = orders.map((obj) => obj.totalPrice);

          // console.log(totalPriceValues)
          res.send({ newArr });
        }
      }
    }

    if (firstSelection === "Users") {
      // Process for Users
    
      if (thirdSelection === "All Orders") {
        const query = `SELECT orderItems
        FROM orders
        WHERE realUser = ?;`;
        const order = await pool.query(query, [secondSelection]);


        const orders = order[0];
      

        orders.forEach((order) => {
          order.orderItems.forEach((orderItem) => {
            const allCategories = orderItem.name;
            catArray.push(allCategories);
          });
        });

        let newArr = [];
        for (let item of catArray) {
          if (item !== undefined) {
            newArr.push(item);
          }
        }

        res.send({ newArr });
      }
      if (thirdSelection === "Highest transactions") {
        const query = `SELECT totalPrice
        FROM orders
        WHERE realUser = ?;`;
        const order = await pool.query(query, [secondSelection]);


        const orders = order[0];


        // // orders.forEach((order) => {
        //   order.orderItems.forEach((orderItem) => {
        //     const allCategories = orderItem.name;
        //     catArray.push(allCategories);
        //   });
        // // });

        // let newArr = [];
        // for (let item of catArray) {
        //   if (item !== undefined) {
        //     newArr.push(item);
        //   }
        // }

        // res.send({ newArr });



        const newArr = orders.map((obj) => obj.totalPrice);

        // console.log(totalPriceValues)
        res.send({ newArr });
      }
      if (thirdSelection === "Lowest Transactions") {
        const query = `SELECT totalPrice
        FROM orders
        WHERE realUser = ?;`;
        const order = await pool.query(query, [secondSelection]);


        const orders = order[0];


        // // orders.forEach((order) => {
        //   order.orderItems.forEach((orderItem) => {
        //     const allCategories = orderItem.name;
        //     catArray.push(allCategories);
        //   });
        // // });

        // let newArr = [];
        // for (let item of catArray) {
        //   if (item !== undefined) {
        //     newArr.push(item);
        //   }
        // }

        // res.send({ newArr });



        const newArr = orders.map((obj) => obj.totalPrice);

        // console.log(totalPriceValues)
        res.send({ newArr });
      }
    }

    if (firstSelection === "Refunds") {
      // Process for Refunds
    }
  })
);

export default reportRouter;



