$(document).ready(function() {
  // Getting jQuery references to the orderdetail body, title, form, and order select
  const bodyInput = $('#body');
  const titleInput = $('#title');
  const smsForm = $('#sms');
  const orderSelect = $('#order');
  // Adding an event listener for when the form is submitted
  $(smsForm).on('submit', handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a orderdetail)
  const url = window.location.search;
  let orderdetailId;
  let OrderId;
  // Sets a flag for whether or not we're updating a orderdetail to be false initially
  let updating = false;

  // If we have this section in our url, we pull out the orderdetail id from the url
  // In '?orderdetail_id=1', orderdetailId is 1
  if (url.indexOf('?orderdetail_id=') !== -1) {
    orderdetailId = url.split('=')[1];
    getOrderDetailData(orderdetailId, 'orderdetail');
  }
  // Otherwise if we have an order_id in our url, preset the order select box to be our Order
  else if (url.indexOf('?order_id=') !== -1) {
    OrderId = url.split('=')[1];
  }

  // Getting the orders, and their orderdetails
  getOrders();

  // A function for handling what happens when the form to create a new orderdetail is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the orderdetail if we are missing a body, title, or order
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !orderSelect.val()) {
      return;
    }
    // Constructing a newOrderDetail object to hand to the database
    const newOrderDetail = {
      title: titleInput
          .val()
          .trim(),
      body: bodyInput
          .val()
          .trim(),
      OrderId: orderSelect.val(),
    };

    // If we're updating a orderdetail run updateOrderDetail to update a orderdetail
    // Otherwise run submitOrderDetail to create a whole new orderdetail
    if (updating) {
      newOrderDetail.id = orderdetailId;
      updateOrderDetail(newOrderDetail);
    } else {
      submitOrderDetail(newOrderDetail);
    }
  }

  // Submits a new orderdetail and brings user to orderdetail page upon completion
  function submitOrderDetail(orderdetail) {
    $.post('/api/orderdetails', orderdetail, function() {
      window.location.href = '/orderdetail';
    });
  }

  // Gets orderdetail data for the current orderdetail if we're editing, or if we're adding to an order's existing orderdetails
  function getOrderDetailData(id, type) {
    let queryUrl;
    switch (type) {
      case 'orderdetail':
        queryUrl = '/api/orderdetails/' + id;
        break;
      case 'order':
        queryUrl = '/api/orders/' + id;
        break;
      default:
        return;
    }

    console.log("queryUrl: ", queryUrl);

    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.OrderId || data.id);
        // If this orderdetail exists, prefill our sms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        OrderId = data.OrderId || data.id;
        // If we have a orderdetail with this id, set a flag for us to know to update the orderdetail
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Orders and then render our list of Orders
  function getOrders() {
    $.get('/api/orders', renderOrderList);
  }
  // Function to either render a list of orders, or if there are none, direct the user to the page
  // to create an order first
  function renderOrderList(data) {
    if (!data.length) {
      window.location.href = '/orders';
    }
    $('.hidden').removeClass('hidden');
    const rowsToAdd = [];
    for (let i = 0; i < data.length; i++) {
      rowsToAdd.push(createOrderRow(data[i]));
    }
    orderSelect.empty();
    console.log(rowsToAdd);
    console.log(orderSelect);
    orderSelect.append(rowsToAdd);
    orderSelect.val(OrderId);
  }

  // Creates the order options in the dropdown
  function createOrderRow(order) {
    const listOption = $('<option>');
    listOption.attr('value', order.id);
    listOption.text(order.name);
    return listOption;
  }

  // Update a given orderdetail, bring user to the orderdetail page when done
  function updateOrderDetail(orderdetail) {
    $.ajax({
      method: 'PUT',
      url: '/api/orderdetails',
      data: orderdetail,
    })
        .then(function() {
          window.location.href = '/orderdetail';
        });
  }
});
