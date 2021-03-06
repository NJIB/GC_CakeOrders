// *********************************************************************************
// comment-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
const db = require('../models');

// Routes
// =============================================================
module.exports = function (app) {
  // GET route for getting all of the comments
  app.get('/api/orderdetails', async (req, res) => {
    // Add sequelize code to find all comments, and return them to the user with res.json
    const query = {};
    console.log("req.query.order_id: ", req.query.order_id);
    if (req.query.order_id) {
      query.OrderId = req.query.order_id;
    }
    // In our findAll argument, we add a 'where' property, that could be empty
    // depending on whether or not the request has an 'order_id' key/value pait in the query string.
    // We also add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Order
    try {
      const data = await db.Order.findAll({
        where: query,
        include: [db.Order],
      });
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  // Get route for returning comments of a specific category
  app.get('/api/orderdetails/category/:category', async (req, res) => {
    // Add sequelize code to find all comments where the category is equal to req.params.category,
    // return the result to the user with res.json
    // We build up the query object with a category property.
    // If the request has an 'order_id' key/value pair in the query string, we
    // we add an OrderId property to the query object.
    // Then entire query object will be passed as the object for 'where' in the findAll argument.
    const query = {
      category: req.params.category,
    };
    if (req.query.order_id) {
      query.OrderId = req.query.order_id;
    }
    // We also add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Order
    try {
      const data = await db.Order.findAll({
        where: query,
        // include: [db.Order],
      });
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  // Get route for retrieving a single order
  app.get('/api/orderdetail/:id', async (req, res) => {
    // Find one Report with the id in req.params.id and return them to the user with res.json
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.SubReport
    // console.log('req.params: ',req.params)
    try {
      const data = await db.Order.findOne( // findOne returns a single object.  findAll returns an array of objects
        {
          where: { id: req.params.id },
          // include: [db.SubReport],
        },
      );
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  app.get('/api/customerdetail/:customer_id', async (req, res) => {
    // Find one Order with the id in req.params.id and return them to the user with res.json
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.OrderDetail
    try {
      console.log("req.params.customer_id", req.params.customer_id);
      const data = await db.Customer.findOne( // findOne returns a single object.  findAll returns an array of objects
        {
          where: { customer_id: req.params.customer_id },
          // include: [db.Order],
        },
      );
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  // POST route for saving a new comment
  app.post('/api/orderdetails', async (req, res) => {
    // Add sequelize code for creating a comment using req.body,
    // then return the result using res.json
    console.log("req.body: ", req.body);

    try {
      console.log("req.body: ", req.body);
      const result = await db.Order.create(req.body);
      res.json({ created: result.dataValues });
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  // // POST route for saving a new comment
  // app.post('/api/orderdetails', async (req, res) => {
  //   // Add sequelize code for creating a comment using req.body,
  //   // then return the result using res.json
  //   try {
  //     const result = await db.Route.create(req.body);
  //     res.json({created: result.dataValues});
  //   } catch (error) {
  //     res.status(400).json({error: {name: error.name, msg: error.message}});
  //   }
  // });

  // DELETE route for deleting comments
  app.delete('/api/orderdetails/:id', async (req, res) => {
    // Add sequelize code to delete a comment where the id is equal to req.params.id,
    // then return the result to the user using res.json
    try {
      const result = await db.Order.destroy(
        {
          // where: {id: req.params.id},
          where: { id: req.params.id },
        },
      );
      const deletedRowCount = result;
      const status = deletedRowCount > 0 ? 200 : 404;
      res.status(status).json({ deletedRowCount });
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  // PUT route for updating orders
  app.put('/api/orderdetails', async (req, res) => {
    // Add code here to update a comment using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
    const {
      id,
      customer_id,
      order_date,
      order_time,
      delivery_pickup,
      cake_theme,
      cake_description,
      cake_special,
      cake_name,
      cake_age,
      cake_boygirl,
      cake_servings,
      cake_layers,
      cake_size1,
      cake_shape1,
      cake_flavor1,
      cake_filling1,
      cake_notes1,
      cake_size2,
      cake_shape2,
      cake_flavor2,
      cake_filling2,
      cake_notes2,
      cake_size3,
      cake_shape3,
      cake_flavor3,
      cake_filling3,
      cake_notes3,
      cake_price
    } = req.body;
    console.log("req.body: ", req.body);

    try {
      // const result = await db.OrderDetail.update(
      const result = await db.Order.update(
        {
          order_date,
          order_time,
          delivery_pickup,
          cake_theme,
          cake_description,
          cake_special,
          cake_name,
          cake_age,
          cake_boygirl,
          cake_servings,
          cake_layers,
          cake_size1,
          cake_shape1,
          cake_flavor1,
          cake_filling1,
          cake_notes1,
          cake_size2,
          cake_shape2,
          cake_flavor2,
          cake_filling2,
          cake_notes2,
          cake_size3,
          cake_shape3,
          cake_flavor3,
          cake_filling3,
          cake_notes3,
          cake_price
        },
        { where: { id } },
      );
      const affectedRowCount = result[0];
      const status = affectedRowCount > 0 ? 200 : 404;
      res.status(status).json({ affectedRowCount });
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });
};
