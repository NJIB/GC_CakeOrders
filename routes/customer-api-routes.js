const db = require('../models');

module.exports = function(app) {
  // Find all Orders and return them to the user with res.json
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.OrderDetail
  app.get('/api/customers', async (req, res) => {
    try {
      const data = await db.Customer.findAll({
        // include: [db.Order],
      });
      res.json(data);
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });

  app.get('/api/customers/:id', async (req, res) => {
    // Find one Order with the id in req.params.id and return them to the user with res.json
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.OrderDetail
    try {
      const data = await db.Customer.findOne( // findOne returns a single object.  findAll returns an array of objects
          {
            where: {id: req.params.id},
            include: [db.Order],
          },
      );
      res.json(data);
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });

  // app.get('/api/customerdetail/:customer_id', async (req, res) => {
  //   // Find one Order with the id in req.params.id and return them to the user with res.json
  //   // Here we add an "include" property to our options in our findOne query
  //   // We set the value to an array of the models we want to include in a left outer join
  //   // In this case, just db.OrderDetail
  //   try {
  //     console.log("req.params.customer_id", req.params.customer_id);
  //     const data = await db.Customer.findOne( // findOne returns a single object.  findAll returns an array of objects
  //         {
  //           where: {customer_id: req.params.customer_id},
  //           // include: [db.Order],
  //         },
  //     );
  //     res.json(data);
  //   } catch (error) {
  //     res.status(400).json({error: {name: error.name, msg: error.message}});
  //   }
  // });


  app.post('/api/customers', async (req, res) => {
    // Create an Order with the data available to us in req.body
    console.log("req.body: ", req.body);
    const {customer_id, first_name, last_name, address, city, zip, phone} = req.body;

    // const sgmt_rev = (deal_size * order_date);
    // console.log("sgmt_rev: ", sgmt_rev);

    try {
      // const result = await db.Customer.create({customer_id, first_name, last_name, order_date, address, city, zip, phone});
      const result = await db.Customer.create({customer_id, first_name, last_name, address, city, zip, phone});
      res.json({created: result.dataValues});
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });

  app.delete('/api/customers/:id', async (req, res) => {
    // Delete the Order with the id available to us in req.params.id
    // Due to the association set up in the model, deleting an order
    // will delete all of their orderdetails as well.
    try {
      const result = await db.Customer.destroy(
          {
            where: {id: req.params.id},
          },
      );
      const deletedRowCount = result;
      const status = deletedRowCount > 0 ? 200 : 404;
      res.status(status).json({deletedRowCount});
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });

  // PUT route for updating orderdetails
  app.put('/api/customers', async (req, res) => {
    // Add code here to update a order using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
    // const {id, name} = req.body;
    const {id, customer_id, first_name, last_name, order_date} = req.body;
    // const {id, name, deal_size, order_date, deal_size_yoy, deal_count_yoy, next_year_deal_size, next_year_deal_count, next_year_sgmt_rev} = req.body;
    console.log("name: ", name);

    try {
      const result = await db.Customer.update(
          {customer_id, first_name, last_name, order_date},
          {where: {id}},
      );
      const affectedRowCount = result[0];
      const status = affectedRowCount > 0 ? 200 : 404;
      res.status(status).json({affectedRowCount});
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });
};
