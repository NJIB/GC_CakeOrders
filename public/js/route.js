$(document).ready(function () {
  /* global moment */

  // blogContainer holds all of our routes
  const blogContainer = $('.route-container');
  const routeCategorySelect = $('#category');

  //Array of objects to hold data for upsert to Routes table
  let routesData = [];

  // Click events for the edit and delete buttons
  $(document).on('click', 'button.delete', handleOrderDetailDelete);
  $(document).on('click', 'button.edit', handleOrderDetailEdit);
  $(document).on('click', '.form-check-input', handleCheckboxClick);
  $(document).on('submit', '#routes-form', handleRoutesFormSubmit);

  // $(document).on('click', '.form-check-input:checked', function (e) {
  // $(document).on('click', '.form-check-input', function (e) {
  function handleCheckboxClick(e) {
    // console.log("e.target.id: ", e.target.id);
    if (e.target.value == 'unchecked') {
      e.target.value = 'checked';
    } else {
      e.target.value = 'unchecked';
    }
    // console.log("this.val(): ", $(this).val());
    console.log(e.target.id, ": ", e.target.value);
    // console.log("e: ", e);

    for (var i = 0; i < routesData.length; i++) {
      // console.log(e.target.id.substr((e.target.id.indexOf('_') + 1),e.target.id.length));
      if (routesData[i].id == e.target.id.substr((e.target.id.indexOf('_') + 1),e.target.id.length)) {
        switch (e.target.id.substr(0, e.target.id.indexOf('_'))) {
          case "markets":
            routesData[i].markets = e.target.value;
            break;
          case "buyers":
            routesData[i].buyers = e.target.value;
            break;
          case "offerings":
            routesData[i].offerings = e.target.value;
            break;
          case "productivity":
            routesData[i].productivity = e.target.value;
            break;
          case "acquisition":
            routesData[i].acquisition = e.target.value;
            break;
        }
      }
    }
    console.log("routesData: ", routesData);
  };

  // Variable to hold our routes
  let routes;

  // The code below handles the case where we want to get route routes for a specific order
  // Looks for a query param in the url for order_id
  const url = window.location.search;
  let OrderId;
  if (url.indexOf('?order_id=') !== -1) {
    OrderId = url.split('=')[1];
    getOrderDetails(OrderId);
  }
  // If there's no OrderId we just get all routes as usual
  else {
    getOrderDetails();
  }

  // This function grabs routes from the database and updates the view
  function getOrderDetails(order) {
    OrderId = order || '';
    if (OrderId) {
      OrderId = '/?order_id=' + OrderId;
    }
    $.get('/api/route' + OrderId, function (data) {
      console.log('OrderDetails', data);
      routes = data;
      if (!routes || !routes.length) {
        displayEmpty(order);
      } else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete routes
  function deleteOrderDetail(id) {
    $.ajax({
      method: 'DELETE',
      url: '/api/route/' + id,
    })
      .then(function () {
        getOrderDetails(routeCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed route HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    const routesToAdd = [];
    for (let i = 0; i < routes.length; i++) {
      routesToAdd.push(createNewRow(routes[i]));
    }
    blogContainer.append(routesToAdd);
  }

  // This function constructs a route's HTML
  function createNewRow(route) {
    let formattedDate = new Date(route.createdAt);
    formattedDate = moment(formattedDate).format('MMMM Do YYYY, h:mm:ss a');

    const newOrderDetailCard = $('<div>');
    newOrderDetailCard.addClass('card');

    const newOrderDetailCardHeading = $('<div>');
    newOrderDetailCardHeading.addClass('card-header');

    const deleteBtn = $('<button>');
    deleteBtn.text('x');
    deleteBtn.addClass('delete btn btn-danger');

    const editBtn = $('<button>');
    editBtn.text('EDIT');
    editBtn.addClass('edit btn btn-info');

    const newOrderDetailTitle = $('<h2>');
    const newOrderDetailDate = $('<small>');
    const newOrderDetailOrder = $('<h5>');
    newOrderDetailOrder.text('Written by: ' + route.Order.name);
    newOrderDetailOrder.css({
      'float': 'right',
      'color': 'blue',
      'margin-top':
        '-10px',
    });

    const newOrderDetailCardBody = $('<div>');
    newOrderDetailCardBody.addClass('card-body');

    const newOrderDetailBody = $('<p>');
    newOrderDetailTitle.text(route.title + ' ');
    newOrderDetailBody.text(route.body);
    newOrderDetailDate.text(formattedDate);
    newOrderDetailTitle.append(newOrderDetailDate);
    newOrderDetailCardHeading.append(deleteBtn);
    newOrderDetailCardHeading.append(editBtn);
    newOrderDetailCardHeading.append(newOrderDetailTitle);
    newOrderDetailCardHeading.append(newOrderDetailOrder);
    newOrderDetailCardBody.append(newOrderDetailBody);
    newOrderDetailCard.append(newOrderDetailCardHeading);
    newOrderDetailCard.append(newOrderDetailCardBody);
    newOrderDetailCard.data('route', route);
    return newOrderDetailCard;
  }

  // This function figures out which route we want to delete and then calls deleteOrderDetail
  function handleOrderDetailDelete() {
    const currentOrderDetail = $(this)
      .parent()
      .parent()
      .data('route');
    deleteOrderDetail(currentOrderDetail.id);
  }

  // This function figures out which route we want to edit and takes it to the appropriate url
  function handleOrderDetailEdit() {
    const currentOrderDetail = $(this)
      .parent()
      .parent()
      .data('route');
    window.location.href = '/sms?route_id=' + currentOrderDetail.id;
  }

  // This function displays a message when there are no routes
  function displayEmpty(id) {
    const query = window.location.search;
    let partial = '';
    if (id) {
      partial = ' for Order #' + id;
    }
    blogContainer.empty();
    const messageH2 = $('<h2>');
    messageH2.css({ 'text-align': 'center', 'margin-top': '50px' });
    messageH2.html('No routes yet' + partial + ', navigate <a href=\'/sms' + query +
      '\'>here</a> in order to get started.');
    blogContainer.append(messageH2);
  }

  //INSERTING ROUTES TO REVENUE CODE

  const orderList = $('tbody');
  const orderTotals = $('tfooter');
  const orderContainer = $('.order-container');
  let orderRevTotal = 0;

  let chart1Data = [{}];
  let chart2Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Order
  // $(document).on('submit', '#routes-form', handleRoutesFormSubmit);

  // Getting the initial list of Orders
  getOrders();

  // A function to handle what happens when the form is submitted to create a new Order
  function handleRoutesFormSubmit(event) {
    event.preventDefault();
    console.log("Submit button clicked!!")
    console.log("event: ", event);
    console.log("routesData object: ", routesData)
    upsertRoutes(routesData);

  }

  // A function for creating an order. Calls getOrders upon completion
  function upsertRoutes(routesData) {

    console.log("routesData in upsert function: ", routesData);
    $.post('/api/route', routesData)
    .then(getOrders);
  }

  // Function for creating a new list row for orders
  function createOrderRow(orderData) {

    // console.log('orderData: ', orderData);
    const deal_size_yoy_id = "deal_size_yoy" + orderData.id;
    const deal_count_yoy_id = "deal_count_yoy" + orderData.id;

    const newTr = $('<tr>');
    newTr.data('order', orderData);
    newTr.append('<td>' + orderData.name + '</td>');
    newTr.append('<td>$' + orderData.deal_size + '</td>');
    newTr.append('<td>' + orderData.deal_count + '</td>');
    newTr.append('<td>$' + orderData.sgmt_rev + '</td>');

    if (orderData.deal_size_yoy) {
      newTr.append('<td>' + orderData.deal_size_yoy + '</td>');
    } else {
      newTr.append('<td>' + ' - ' + '</td>');
    }

    if (orderData.deal_count_yoy) {
      newTr.append('<td>' + orderData.deal_count_yoy + '%' + '</td>');
    } else {
      newTr.append('<td>' + '-' + '</td>');
    }

    if (!orderData.next_year_deal_size) {
      newTr.append('<td>$' + orderData.deal_size + '</td>');
    }
    else {
      newTr.append('<td>$' + orderData.next_year_deal_size + '</td>');
    }

    if (!orderData.next_year_deal_count) {
      newTr.append('<td>$' + orderData.deal_count + '</td>');
    }
    else {
      newTr.append('<td>$' + orderData.next_year_deal_count + '</td>');
    }

    if (!orderData.next_year_sgmt_rev) {
      newTr.append('<td>$' + orderData.sgmt_rev + '</td>');
    }
    else {
      newTr.append('<td>$' + orderData.next_year_sgmt_rev + '</td>');
    };

    newTr.append('<td>' + '<input id="hurdle_' + orderData.id + '" placeholder=' + 'E.g. Retention' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="markets_' + orderData.id + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="buyers_' + orderData.id + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="offerings_' + orderData.id + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="productivity_' + orderData.id + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="acquisition_' + orderData.id + '" value="unchecked">' + '</td>');

    buildChartObject(orderData);

    return newTr;
  }
  // End of createOrderRow


  // Function for creating a new list row for orders
  function createOrderTotals(title, orderTotals, nextyearSgmtTotals) {

    const totalTr = $('<tr>');
    // totalTr.data('totals', orderTotals);
    totalTr.append('<td><h4><b>' + title + '</b></h4></td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + orderTotals + '</b></h4></td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + nextyearSgmtTotals + '</b></h4></td>');
    return totalTr;
  }


  // Function for retrieving orders and getting them ready to be rendered to the page
  function getOrders() {

    chart1Data = [{}];
    chart2Data = [{}];

    $.get('/api/orders', function (data) {

      // console.log('data: ', data);

      orderRevTotal = 0;
      nextyearSgmtRevTotal = 0;
      const rowsToAdd = [];

      for (let i = 0; i < data.length; i++) {
        rowsToAdd.push(createOrderRow(data[i], i));

        // Populate object for [ulitmate] upload to Routes table
        const routesDetails = {
          id: data[i].id,
          markets: "",
          buyers: "",
          offerings: "",
          productivity: "",
          acquisition: ""
        };
        routesData.push(routesDetails);
        console.log("routesData: ", routesData);

        // Calculating total order revenue
        orderRevTotal += data[i].sgmt_rev;
        if (!data[i].next_year_sgmt_rev) {
          nextyearSgmtRevTotal += data[i].sgmt_rev;
        }
        else {
          nextyearSgmtRevTotal += data[i].next_year_sgmt_rev;
        };

        console.log("i: ", i);
        console.log("data.length: ", data.length);
        if ((i + 1) == data.length) {
          rowsToAdd.push(createOrderTotals("TOTAL", orderRevTotal, nextyearSgmtRevTotal));
        }
      }

      console.log("orderRevTotal: ", orderRevTotal);
      // console.log("rowsToAdd: ", rowsToAdd);

      renderOrderList(rowsToAdd);
      nameInput.val('');
      dealsizeInput.val('');
      dealcountInput.val('');
    });

  }

  // A function for rendering the list of orders to the page
  function renderOrderList(rows) {
    orderList.children().not(':last').remove();
    orderContainer.children('.alert').remove();
    if (rows.length) {
      // console.log("rows: ", rows);
      orderList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // This populates the object for the Revenue Bubble Chart(s)
  function buildChartObject(orderData) {

    chart1Data.push({
      x: orderData.deal_size,
      y: orderData.deal_count,
      r: (orderData.sgmt_rev / 100)
    });

    chart2Data.push({
      x: orderData.next_year_deal_size,
      y: orderData.next_year_deal_count,
      r: (orderData.next_year_sgmt_rev / 100)
    });

    renderChart1(chart1Data);
    renderChart2(chart2Data);

  }

  // This creates the display object for the Revenue Bubble Chart(s)
  function renderChart1(chartData) {
    var ctx = $('#myBubbleChart1');

    var myBubbleChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        "datasets": [{
          label: "Order Revenue - This Year",
          data: chart1Data,
          backgroundColor:
            'red'
        }]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Size ($)',
            },
            ticks: {
              beginAtZero: false
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Count (#)',
            },
            ticks: {
              beginAtZero: false
            },
          }],
        }
      }
    });

    ctx.prepend(myBubbleChart);
  }

  // This creates the display object for the Revenue Bubble Chart(s)
  function renderChart2(chartData) {
    var ctx = $('#myBubbleChart2');

    var myBubbleChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        "datasets": [{
          label: "Next Year Order Revenue Plan",
          data: chart2Data,
          backgroundColor:
            'green'
        }]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Size ($)',
            },
            ticks: {
              beginAtZero: false
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Count (#)',
            },
            ticks: {
              beginAtZero: false
            }
          }],
        }
      }
    });

    ctx.prepend(myBubbleChart);
  }


  // Function for handling what to render when there are no orders
  function renderEmpty() {
    const alertDiv = $('<div>');
    alertDiv.addClass('alert alert-danger');
    alertDiv.text('You must create a Order before you can create a OrderDetail.');
    orderContainer.append(alertDiv);
  }

});
