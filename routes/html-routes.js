// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const path = require('path');

// Routes
// =============================================================
module.exports = function (app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  // app.get('/', function(req, res) {
  //   res.sendFile(path.join(__dirname, '../public/comment.html'));
  // });


  // THIS IS THE START-UP ROUTING
  // index route loads view.html
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/order-manager.html'));
  });

  app.get('/main', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/order-manager.html'));
  });

  // Route to the cms page
  app.get('/cms', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/cms.html'));
  });

  // Route to the cms page
  app.get('/sms', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/sms.html'));
  });

    // Route to the sms page
    app.get('/sms', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/sms.html'));
    });
    
  // comment route loads comment.html
  app.get('/comment', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/comment.html'));
  });

  // orderdetail route loads orderdetail.html
  app.get('/order-details', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/order-details.html'));
  });

  // persons route loads person-manager.html
  app.get('/persons', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/person-manager.html'));
  });

  // orders route loads order-manager.html
  app.get('/orders', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/order-manager.html'));
  });

  // // routes_to_revenue route loads order-details.html
  // app.get('/route', function (req, res) {
  //   res.sendFile(path.join(__dirname, '../public/route.html'));
  // });

};
