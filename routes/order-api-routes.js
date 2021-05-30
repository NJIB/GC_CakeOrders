const db = require('../models');

module.exports = function(app) {
  // Find all Orders and return them to the user with res.json
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.OrderDetail
  app.get('/api/orders', async (req, res) => {
    try {
      const data = await db.Order.findAll({
        include: [db.OrderDetail],
      });
      res.json(data);
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
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
            where: {id: req.params.id},
            include: [db.OrderDetail],
          },
      );
      res.json(data);
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });

  app.post('/api/orders', async (req, res) => {
    // Create an Order with the data available to us in req.body
    console.log("req.body: ", req.body);
    const {name, deal_size, deal_count} = req.body;

    const sgmt_rev = (deal_size * deal_count);
    console.log("sgmt_rev: ", sgmt_rev);

    try {
      const result = await db.Order.create({name, deal_size, deal_count, sgmt_rev});
      // const result = await db.Order.create({name, deal_size, deal_count});
      res.json({created: result.dataValues});
    } catch (error) {
      res.status(400).json({error: {name: error.name, msg: error.message}});
    }
  });

  app.delete('/api/orders/:id', async (req, res) => {
    // Delete the Order with the id available to us in req.params.id
    // Due to the association set up in the model, deleting an order
    // will delete all of their orderdetails as well.
    try {
      const result = await db.Order.destroy(
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
  app.put('/api/orders', async (req, res) => {
    // Add code here to update a order using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
    // const {id, name} = req.body;
    const {id, name, deal_size, deal_count, deal_size_yoy, deal_count_yoy, next_year_deal_size, next_year_deal_count, next_year_sgmt_rev} = req.body;
    console.log("name: ", name);

    try {
      const result = await db.Order.update(
          {name, deal_size, deal_count, deal_size_yoy, deal_count_yoy, next_year_deal_size, next_year_deal_count, next_year_sgmt_rev},
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
