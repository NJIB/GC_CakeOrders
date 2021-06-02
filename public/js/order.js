$(document).ready(function () {
  // Getting references to the name input and order container, as well as the table body
  const firstnameInput = $('#order-firstname');
  const lastnameInput = $('#order-lastname');
  const fullnameInput = $('#order-firstname') + $('#order-lastname');
  // const dealsizeInput = $('#order-lastname');
  const orderdateInput = $('#order-order_date');
  const cakethemeInput = $('#order-cake_theme');

  const orderList = $('tbody');
  const orderTotals = $('tfooter');
  const orderContainer = $('.order-container');
  let orderRevTotal = 0;

  // const chart1Area = $('#myBubbleChart1');
  // const chart2Area = $('#myBubbleChart2');
  // var ctx = $('#myBubbleChart');
  // let chart1Data = [{}];
  // let chart2Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Order
  $(document).on('submit', '#order-form', handleOrderFormSubmit);
  $(document).on('click', '.delete-order', handleDeleteButtonPress);
  $(document).on('click', '.update', handleUpdateButtonPress);

  // Getting the initial list of Orders
  getOrders();

  // A function to handle what happens when the form is submitted to create a new Order
  function handleOrderFormSubmit(event) {
    event.preventDefault();

    // Don't do anything if the name fields hasn't been filled out
    if (!firstnameInput.val().trim().trim()) {
      return;
    }

    console.log("firstnameInput: ", firstnameInput.val().trim());
    console.log("lastnameInput: ", lastnameInput.val().trim());
    console.log("orderdateInput: ", orderdateInput.val().trim());

    const orderData = {
      first_name: firstnameInput
        .val()
        .trim(),
      last_name: lastnameInput
        .val()
        .trim(),
      order_date: orderdateInput
        .val()
        .trim(),
      cake_theme: cakethemeInput
        .val()
        .trim()
    }

    console.log("orderData object: ", orderData)

    upsertOrder(orderData);

  }

  // A function for creating an order. Calls getOrders upon completion
  function upsertOrder(orderData) {
    $.post('/api/orders', orderData)
      .then(getOrders);
  }

  // Function for creating a new list row for orders
  function createOrderRow(orderData) {

    // console.log('orderData: ', orderData);
    // const deal_size_yoy_id = "deal_size_yoy" + (i + 1);
    const deal_size_yoy_id = "deal_size_yoy" + orderData.id;
    // const deal_count_yoy_id = "deal_count_yoy" + (i + 1);
    const deal_count_yoy_id = "deal_count_yoy" + orderData.id;

    const newTr = $('<tr>');
    newTr.data('order', orderData);
    newTr.append('<td>' + orderData.name + '</td>');
    newTr.append('<td>$' + orderData.deal_size + '</td>');
    newTr.append('<td>' + orderData.order_date + '</td>');
    newTr.append('<td>$' + orderData.sgmt_rev + '</td>');

    console.log("orderData.deal_size_yoy: ", orderData.deal_size_yoy);
    if (orderData.deal_size_yoy) {
      newTr.append('<td>' + '<input placeholder=' + orderData.deal_size_yoy + ' id=' + deal_size_yoy_id + ' type="text" />' + '</td>');
    } else {
      newTr.append('<td>' + '<input placeholder="+/-  %"' + 'id=' + deal_size_yoy_id + ' type="text" />' + '</td>');
    }

    if (orderData.deal_count_yoy) {
      newTr.append('<td>' + '<input placeholder=' + orderData.deal_count_yoy + ' id=' + deal_count_yoy_id + ' type="text" />' + '</td>');
    } else {
      newTr.append('<td>' + '<input placeholder="+/-  %"' + 'id=' + deal_count_yoy_id + ' type="text" />' + '</td>');
    }

    // Potentially only show button, if change field is populated?
    newTr.append('<td>' + '<button class="btn btn-success update">></button>' + '</td>');

    if (!orderData.next_year_deal_size) {
      newTr.append('<td>$' + orderData.deal_size + '</td>');
    }
    else {
      newTr.append('<td>$' + orderData.next_year_deal_size + '</td>');
    }

    if (!orderData.next_year_deal_count) {
      newTr.append('<td>$' + orderData.order_date + '</td>');
    }
    else {
      newTr.append('<td>' + orderData.next_year_deal_count + '</td>');
    }

    if (!orderData.next_year_sgmt_rev) {
      newTr.append('<td>$' + orderData.sgmt_rev + '</td>');
    }
    else {
      newTr.append('<td>$' + orderData.next_year_sgmt_rev + '</td>');
    };
    //10.05 Testing change to button class
    // newTr.append('<td> <button class="btn btn-success update"><a style=\'cursor:pointer;color:white;\' href=\'/orderdetail?order_id=' + orderData.id + '\' /a> >> </button></td>');
    newTr.append('<td> <button class="btn btn-success"><a style=\'cursor:pointer;color:white;\' href=\'/orderdetail?order_id=' + orderData.id + '\' /a> >> </button></td>');
    //10.05 End test

    if (orderData.OrderDetails) {
      newTr.append('<td> ' + orderData.OrderDetails.length + '</td>');
    } else {
      newTr.append('<td>0</td>');
    }
    // newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/sms?order_id=' + orderData.id + '\'>...</a></td>');
    // newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/orderdetail?order_id=' + orderData.id + '\'>...</a></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/orderdetail?order_id=' + orderData.id + '\'>...</a></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-order\'>X</a></td>');

    console.log("orderData: ", orderData);

    buildChartObject(orderData);

    return newTr;
  }

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
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + nextyearSgmtTotals + '</b></h4></td>');
    return totalTr;
  }


  // Function for retrieving orders and getting them ready to be rendered to the page
  function getOrders() {

    chart1Data = [{}];
    chart2Data = [{}];

    $.get('/api/orders', function (data) {

      console.log('data: ', data);

      // orderRevTotal = 0;
      // nextyearSgmtRevTotal = 0;
      const rowsToAdd = [];

      for (let i = 0; i < data.length; i++) {
        rowsToAdd.push(createOrderRow(data[i], i));

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
      firstnameInput.val('');
      lastnameInput.val('');
      fullnameInput.val('');
      // dealsizeInput.val('');
      orderdateInput.val('');
      cakethemeInput.val('');
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
      y: orderData.order_date,
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
    console.log("chart1 data: ", chartData);
    var ctx = $('#myBubbleChart1');

    var myBubbleChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        "datasets": [{
          label: "Order Revenue - This Year",
          data: chartData,
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
              beginAtZero: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Count (#)',
            },
            ticks: {
              beginAtZero: true
            },
          }],
        }
      }
    });

    ctx.prepend(myBubbleChart);
  }

  // This creates the display object for the Revenue Bubble Chart(s)
  function renderChart2(chartData) {
    console.log("chart2 data: ", chartData);
    var ctx = $('#myBubbleChart2');

    var myBubbleChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        "datasets": [{
          label: "Next Year Order Revenue Plan",
          data: chartData,
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
              beginAtZero: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Count (#)',
            },
            ticks: {
              beginAtZero: true
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

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    const listItemData = $(this).parent('td').parent('tr').data('order');

    const id = listItemData.id;
    $.ajax({
      method: 'DELETE',
      url: '/api/orders/' + id,
    })
      .then(getOrders);
  }

  function handleUpdateButtonPress() {

    const listItemData = $(this).parent('td').parent('tr').data('order');
    // console.log("listItemData: ", listItemData);

    const id = listItemData.id;
    // console.log("listItemData.id: ", listItemData.id);

    let nextyearDealsize = 0;
    let nextyearDealcount = 0;

    const dealsizeyoychangeInput = $('#deal_size_yoy' + listItemData.id);
    const dealcountyoychangeInput = $('#deal_count_yoy' + listItemData.id);

    // console.log('dealsizeyoychangeInput: ', dealsizeyoychangeInput.val());
    if (dealsizeyoychangeInput === '') {
      nextyearDealsize = listItemData.deal_size;
      // console.log("nextyearDealsize: ", nextyearDealsize);
    } else {
      nextyearDealsize = (listItemData.deal_size * (1 + (dealsizeyoychangeInput.val() / 100)));
      // console.log("nextyearDealsize: ", nextyearDealsize);
    }

    // console.log('dealcountyoychangeInput: ', dealcountyoychangeInput.val());
    if (dealcountyoychangeInput === '') {
      nextyearDealcount = listItemData.order_date;
      // console.log("nextyearDealcount: ", nextyearDealcount);
    } else {
      nextyearDealcount = (listItemData.order_date * (1 + (dealcountyoychangeInput.val() / 100)));
      // console.log("nextyearDealcount: ", nextyearDealcount);
    }

    const nextyearSgmtrev = (nextyearDealsize * nextyearDealcount);
    // console.log("nextyearSgmtrev: ", nextyearSgmtrev);


    const orderData = {
      id: listItemData.id,
      name: listItemData.name,
      deal_size: listItemData.deal_size,
      order_date: listItemData.order_date,
      deal_size_yoy: dealsizeyoychangeInput.val() * 1,
      deal_count_yoy: dealcountyoychangeInput.val() * 1,
      next_year_deal_size: nextyearDealsize,
      next_year_deal_count: nextyearDealcount,
      next_year_sgmt_rev: nextyearSgmtrev
    }

    console.log("orderData object: ", orderData)


    $.ajax({
      method: 'PUT',
      url: '/api/orders',
      data: orderData,
    })
      .then(getOrders);
  }
});
