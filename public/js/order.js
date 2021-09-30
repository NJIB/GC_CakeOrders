$(document).ready(function () {
  // Getting references to the name inputs and order date
  const firstnameInput = $('#order-firstname');
  const lastnameInput = $('#order-lastname');
  const orderdateInput = $('#order-order_date');

  // Getting references to the cake detail inputs
  const cakethemeInput = $('#order-cake_theme');
  const cakedescriptionInput = $('#order-cake_description');
  const cakespecialInput = $('#order-cake_special');
  const cakenameInput = $('#order-cake_name');
  const cakeageInput = $('#order-cake_age');
  const cakeboygirlInput = $('#order-cake_boygirl');
  const cakeoccasionInput = $('#order-cake_occasion');
  const cakeservingsInput = $('#order-cake_servings');
  const cakelayersInput = $('#order-cake_layers');
  const cakesize1Input = $('#order-cake_size1');
  const cakeshape1Input = $('#order-cake_shape1');
  const cakeflavor1Input = $('#order-cake_flavor1');
  const cakefilling1Input = $('#order-cake_filling1');
  const cakenotes1Input = $('#order-cake_notes1');
  const cakesize2Input = $('#order-cake_size2');
  const cakeshape2Input = $('#order-cake_shape2');
  const cakeflavor2Input = $('#order-cake_flavor2');
  const cakefilling2Input = $('#order-cake_filling2');
  const cakenotes2Input = $('#order-cake_notes2');
  const cakesize3Input = $('#order-cake_size3');
  const cakeshape3Input = $('#order-cake_shape3');
  const cakeflavor3Input = $('#order-cake_flavor3');
  const cakefilling3Input = $('#order-cake_filling3');
  const cakenotes3Input = $('#order-cake_notes3');
  const cakepriceInput = $('#order-cake_price');

  const orderList = $('tbody');
  const orderTotals = $('tfooter');
  const orderContainer = $('.order-container');
  let orderRevTotal = 0;

  // 9-28-21 Making TR global
  let newTr;
  let OrderGetData = [];
  let CustomerGetData = [];

  // const chart1Area = $('#myBubbleChart1');
  // const chart2Area = $('#myBubbleChart2');
  // var ctx = $('#myBubbleChart');
  // let chart1Data = [{}];
  // let chart2Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Order
  $(document).on('submit', '.order-form', handleOrderFormSubmit);
  $(document).on('click', '.delete-order', handleDeleteButtonPress);
  $(document).on('click', '.update', handleUpdateButtonPress);

  // Getting the initial list of Orders
  getOrders();

    // Getting the initial list of Orders
  getCustomers();


  // A function to handle what happens when the form is submitted to create a new Order
  function handleOrderFormSubmit(event) {
    event.preventDefault();

    console.log("CREATE ORDER BUTTON PRESSED!")

    // Don't do anything if the name fields hasn't been filled out
    console.log("firstnameInput: ", firstnameInput.val().trim());

    if (!firstnameInput.val().trim()) {
      return;
    }

    console.log("firstnameInput: ", firstnameInput.val().trim());
    console.log("lastnameInput: ", lastnameInput.val().trim());
    console.log("orderdateInput: ", orderdateInput.val().trim());

    let customerId = lastnameInput.val().trim() + firstnameInput.val().trim().substr(0, 1);
    console.log("customerId: ", customerId);

    const customerData = {
      first_name: firstnameInput
        .val()
        .trim(),
      last_name: lastnameInput
        .val()
        .trim(),
      order_date: orderdateInput
        .val()
        .trim()
    }

    console.log("customerData: ", customerData);

    const orderData = {
      customer_id: customerId,
      order_date: orderdateInput
        .val()
        .trim(),
      cake_theme: cakethemeInput
        .val()
        .trim(),
      cake_description: cakedescriptionInput
        .val()
        .trim(),
      cake_special: cakespecialInput
        .val()
        .trim(),
      cake_name: cakenameInput
        .val()
        .trim(),
      cake_age: cakeageInput
        .val()
        .trim(),
      cake_boygirl: cakeboygirlInput
        .val()
        .trim(),
      cake_servings: cakeservingsInput
        .val()
        .trim(),
      cake_layers: cakelayersInput
        .val()
        .trim(),
      cake_size1: cakesize1Input
        .val()
        .trim(),
      cake_shape1: cakeshape1Input
        .val()
        .trim(),
      cake_flavor1: cakeflavor1Input
        .val()
        .trim(),
      cake_filling1: cakefilling1Input
        .val()
        .trim(),
      cake_notes1: cakenotes1Input
        .val()
        .trim(),
      cake_size2: cakesize2Input
        .val()
        .trim(),
      cake_shape2: cakeshape2Input
        .val()
        .trim(),
      cake_flavor2: cakeflavor2Input
        .val()
        .trim(),
      cake_filling2: cakefilling2Input
        .val()
        .trim(),
      cake_notes2: cakenotes2Input
        .val()
        .trim(),
      cake_size3: cakesize3Input
        .val()
        .trim(),
      cake_shape3: cakeshape3Input
        .val()
        .trim(),
      cake_flavor3: cakeflavor3Input
        .val()
        .trim(),
      cake_filling3: cakefilling3Input
        .val()
        .trim(),
      cake_notes3: cakenotes3Input
        .val()
        .trim(),
      cake_price: cakepriceInput
        .val()
        .trim()
    }

    console.log("orderData object: ", orderData)

    upsertCustomer(customerData);
    upsertOrder(orderData);

  }

  // A function for creating an order. Calls getOrders upon completion
  function upsertOrder(orderData) {
    $.post('/api/orders', orderData)
      .then(getOrders);
  }

  function upsertCustomer(customerData) {
    console.log("customerData: ", customerData)
    $.post('/api/customers', customerData)
      .then(getCustomers);
  }

  // Function for creating a new list row for orders
  function createOrderRow(orderData) {

    console.log('orderData: ', orderData);

    // const deal_size_yoy_id = "deal_size_yoy" + orderData.id;
    // const deal_count_yoy_id = "deal_count_yoy" + orderData.id;

    // 9-28-21 Commented out to make a global var
    // const newTr = $('<tr>');
    const newTr = $('<tr>');
    // 9-28-21 End of commenting out

    newTr.data('order', orderData);
    newTr.append('<td>' + orderData.order_date + '</td>');
    newTr.append('<td>' + orderData.cake_theme + '</td>');

    // 9-27-21 Commented out
    // newTr.append('<td>' + orderData.first_name + ' ' + orderData.last_name + '</td>');
    // 9-27-21 End of commenting out 

    // newTr.append('<td>' + orderData.first_name + '</td>');
    // newTr.append('<td>' + orderData.last_name + '</td>');

    // console.log("orderData.deal_size_yoy: ", orderData.deal_size_yoy);
    // if (orderData.deal_size_yoy) {
    //   newTr.append('<td>' + '<input placeholder=' + orderData.deal_size_yoy + ' id=' + deal_size_yoy_id + ' type="text" />' + '</td>');
    // } else {
    //   newTr.append('<td>' + '<input placeholder="+/-  %"' + 'id=' + deal_size_yoy_id + ' type="text" />' + '</td>');
    // }

    // if (orderData.deal_count_yoy) {
    //   newTr.append('<td>' + '<input placeholder=' + orderData.deal_count_yoy + ' id=' + deal_count_yoy_id + ' type="text" />' + '</td>');
    // } else {
    //   newTr.append('<td>' + '<input placeholder="+/-  %"' + 'id=' + deal_count_yoy_id + ' type="text" />' + '</td>');
    // }

    // Potentially only show button, if change field is populated?
    // newTr.append('<td>' + '<button class="btn btn-success update">></button>' + '</td>');

    // if (!orderData.next_year_deal_size) {
    //   newTr.append('<td>$' + orderData.deal_size + '</td>');
    // }
    // else {
    //   newTr.append('<td>$' + orderData.next_year_deal_size + '</td>');
    // }

    // if (!orderData.next_year_deal_count) {
    //   newTr.append('<td>$' + orderData.order_date + '</td>');
    // }
    // else {
    //   newTr.append('<td>' + orderData.next_year_deal_count + '</td>');
    // }

    // if (!orderData.next_year_sgmt_rev) {
    //   newTr.append('<td>$' + orderData.sgmt_rev + '</td>');
    // }
    // else {
    //   newTr.append('<td>$' + orderData.next_year_sgmt_rev + '</td>');
    // };
    //10.05 Testing change to button class

    // 9-27-21 Commented out
    // newTr.append('<td> <button class="btn btn-success"><a style=\'cursor:pointer;color:white;\' href=\'/orderdetail?order_id=' + orderData.id + '\' /a> >> </button></td>');
    // 9-27-21 End of commenting out

    // if (orderData.OrderDetails) {
    //   newTr.append('<td> ' + orderData.OrderDetails.length + '</td>');
    // } else {
    //   newTr.append('<td>0</td>');
    // }
    // newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/orderdetail?order_id=' + orderData.id + '\'>...</a></td>');

    // 9-27-21 Commented out
    // newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-order\'>X</a></td>');
    // 9-27-21 End of commenting out

    console.log("orderData: ", orderData);

    // buildChartObject(orderData);

    return newTr;
  }

  function createOrderRow2(customerData) {

    console.log('customerData: ', customerData);

    // const newTr = $('<tr>');
    // newTr.data('order', customerData);
    newTr.append('<td>' + customerData.first_name + ' ' + customerData.last_name + '</td>');
    newTr.append('<td> <button class="btn btn-success"><a style=\'cursor:pointer;color:white;\' href=\'/orderdetail?order_id=' + orderData.id + '\' /a> >> </button></td>');

    newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-order\'>X</a></td>');

    console.log("customerData: ", customerData);

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

    $.get('/api/orders', function (orderdata) {

      console.log('orderdata: ', orderdata);

      //Copy orderdata to OrderGetData array (to build TR)
      for (let i = 0; i < orderdata.length; i++) {
        OrderGetData.push(orderdata[i]);
        console.log("OrderGetData: ", OrderGetData);
      };

      
      // orderRevTotal = 0;
      // nextyearSgmtRevTotal = 0;
      const rowsToAdd = [];

      for (let i = 0; i < orderdata.length; i++) {
        rowsToAdd.push(createOrderRow(orderdata[i], i));

        // Calculating total order revenue
        // orderRevTotal += data[i].sgmt_rev;
        // if (!data[i].next_year_sgmt_rev) {
        //   nextyearSgmtRevTotal += data[i].sgmt_rev;
        // }
        // else {
        //   nextyearSgmtRevTotal += data[i].next_year_sgmt_rev;
        // };

        //When all orders logged, insert Totals row
        console.log("i: ", i);
        console.log("orderdata.length: ", orderdata.length);
        if ((i + 1) == orderdata.length) {
          // rowsToAdd.push(createOrderTotals("TOTAL", orderRevTotal, nextyearSgmtRevTotal));
        }
      }

      renderOrderList(rowsToAdd);
      firstnameInput.val('');
      lastnameInput.val('');
      orderdateInput.val('');
      cakethemeInput.val('');
    });
  }

  function getCustomers() {

    $.get('/api/customers', function (customerdata) {

      console.log('customerdata: ', customerdata);

            //Copy customerdata to CustomerGetData array (to build TR)
            for (let i = 0; i < customerdata.length; i++) {
              CustomerGetData.push(customerdata[i]);
              console.log("CustomerGetData: ", CustomerGetData);

              // After copying customerdata to CustomerGetData, create table rows row for rendering
              console.log("i: ", i);
              console.log("customerdata.length: ", customerdata.length);
              if ((i + 1) == customerdata.length) {
                createOrderSummary();                
              }
      
            };
      

      // const rowsToAdd = [];

      // for (let i = 0; i < data.length; i++) {
      //   rowsToAdd.push(createOrderRow(data[i], i));

      //   console.log("i: ", i);
      //   console.log("data.length: ", data.length);
      //   if ((i + 1) == data.length) {
      //     // rowsToAdd.push(createOrderTotals("TOTAL", orderRevTotal, nextyearSgmtRevTotal));
      //   }
      // }

      // renderOrderList(rowsToAdd);
      // firstnameInput.val('');
      // lastnameInput.val('');
      // orderdateInput.val('');
      // cakethemeInput.val('');

    })
  }
  // }

  function createOrderSummary() {
    for (let i = 0; i < OrderGetData.length; i++) {
      console.log("OrderGetData line ", i+1);
      console.log(OrderGetData[i]);
    };
  };

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
