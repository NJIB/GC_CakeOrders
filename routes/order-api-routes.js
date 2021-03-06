const db = require('../models');

module.exports = function (app) {
  // Find all Orders and return them to the user with res.json
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.OrderDetail
  app.get('/api/orders', async (req, res) => {
    try {
      const data = await db.Order.findAll({
        include: [db.Customer],
      });
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });


  app.get('/api/orders', async (req, res) => {
    try {
      const data = await db.Order.findAll({
        include: [db.Customer],
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


  app.get('/api/orders/:id', async (req, res) => {
    // Find one Order with the id in req.params.id and return them to the user with res.json
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.OrderDetail
    try {
      const data = await db.Order.findOne( // findOne returns a single object.  findAll returns an array of objects
        {
          where: { id: req.params.id },
          include: [db.Customer],
        },
      );
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  app.post('/api/orders', async (req, res) => {
    // Create an Order with the data available to us in req.body
    console.log("req.body: ", req.body);
    // const {name, deal_size, order_date} = req.body;
    const { customer_id,
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

    // const sgmt_rev = (deal_size * order_date);
    // console.log("sgmt_rev: ", sgmt_rev);

    try {
      const result = await db.Order.create({
        customer_id,
        order_date,
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
      });
      // const result = await db.Order.create({name, deal_size, order_date, sgmt_rev});
      res.json({ created: result.dataValues });
    } catch (error) {
      res.status(400).json({ error: { name: error.name, msg: error.message } });
    }
  });

  app.delete('/api/orders/:id', async (req, res) => {
    // Delete the Order with the id available to us in req.params.id
    // Due to the association set up in the model, deleting an order
    // will delete all of their orderdetails as well.
    try {
      const result = await db.Order.destroy(
        {
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

  // PUT route for updating orderdetails
  // app.put('/api/orders', async (req, res) => {
  //   // Add code here to update a order using the values in req.body, where the id is equal to
  //   // req.body.id and return the result to the user using res.json
  //   // const {id, name} = req.body;
  //   const { id, name, deal_size, order_date, deal_size_yoy, deal_count_yoy, next_year_deal_size, next_year_deal_count, next_year_sgmt_rev } = req.body;
  //   console.log("name: ", name);

  //   try {
  //     const result = await db.Order.update(
  //       { name, deal_size, order_date, deal_size_yoy, deal_count_yoy, next_year_deal_size, next_year_deal_count, next_year_sgmt_rev },
  //       { where: { id } },
  //     );
  //     const affectedRowCount = result[0];
  //     const status = affectedRowCount > 0 ? 200 : 404;
  //     res.status(status).json({ affectedRowCount });
  //   } catch (error) {
  //     res.status(400).json({ error: { name: error.name, msg: error.message } });
  //   }
  // });

  // PUT route for updating orders
  app.put('/api/orders', async (req, res) => {
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
      console.log("***   UPDATING!!!   ***")
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

  // PUT route for marking prder as paid
  app.put('/api/payorder', async (req, res) => {
    // Add code here to update a comment using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
    const {
      id,
      customer_id,
      paid_flag,
      paid_date
    } = req.body;
    console.log("req.body: ", req.body);

    try {
      // const result = await db.OrderDetail.update(
      const result = await db.Order.update(
        {
         paid_flag,
         paid_date
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
