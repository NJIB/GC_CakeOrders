$(document).ready(function () {

  // Getting references to the name inputs and order date

  let customersPull = [];
  let rowsToBeAdded = [];
  let customersToAdd = [];
  let customerOptionsToAdd = [];
  let newCustomerselect = $('<select>');
  const customersList = $('ul');
  const customersContainer = $('customerDropdown');
  const customerSelect = $('#CustomerSelect');
  const customerSelectContainer = $('CustomerSelect')

  // const orderList = $('tbody');
  const customerList = $('#customerList');
  const customerContainer = $('.customer-container');
  let orderRevTotal = 0;

  // 9-28-21 Making TR global
  let newTr;
  let CustomerGetData = [];
  let rowsToAdd = [];
  let rowsAdded;

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Order
  $(document).on('click', '#add-customer', handleCustomerCreateSubmit);
  // $(document).on('submit', '.order-form', handleOrderFormSubmit);
  $(document).on('click', '.delete-customer', handleDeleteButtonPress);
  // $(document).on('click', '.update', handleUpdateButtonPress);
  $(document).on('click', '#manage-customer-section', handleDisplayCustomerInfo);


  // Getting the initial list of Orders
  // getOrders();

  // Getting the initial list of Customers
  getCustomers();

  // A function to handle what happens when the form is submitted to create a new Order
  function handleCustomerCreateSubmit(event) {
    event.preventDefault();

    console.log("newCustomerfirstname: ", newCustomerfirstname.val().trim());
    console.log("newCustomerlastname: ", newCustomerlastname.val().trim());

    // Don't do anything if the name fields hasn't been filled out
    if (!newCustomerfirstname.val().trim()) {
      return;
    }

    let customerId = newCustomerlastname.val().trim() + newCustomerfirstname.val().trim().substr(0, 1);
    console.log("customerId: ", customerId);

    const customerData = {
      customer_id: customerId,
      first_name: newCustomerfirstname
        .val()
        .trim(),
      last_name: newCustomerlastname
        .val()
        .trim(),
      // order_date: orderdateInput
      //   .val()
      //   .trim(),
      address: newCustomeraddress
        .val()
        .trim(),
      city: newCustomercity
        .val()
        .trim(),
      zip: newCustomerzip
        .val()
        .trim(),
      phone: newCustomerphone
        .val()
        .trim(),
    }

    upsertCustomer(customerData);
  }


  // A function to handle what happens when the form is submitted to create a new Order
  function handleOrderFormSubmit(event) {
    event.preventDefault();

    console.log("Order submitted!")
    console.log("firstnameInput: ", firstnameInput.val().trim());
    console.log("lastnameInput: ", lastnameInput.val().trim());
    console.log("orderdateInput: ", orderdateInput.val().trim());

    // Don't do anything if the name fields hasn't been filled out
    if (!firstnameInput.val().trim()) {
      return;
    }

    console.log("firstnameInput: ", firstnameInput.val().trim());
    console.log("lastnameInput: ", lastnameInput.val().trim());
    console.log("orderdateInput: ", orderdateInput.val().trim());

    let customerId = lastnameInput.val().trim() + firstnameInput.val().trim().substr(0, 1);
    console.log("customerId: ", customerId);

    const customerData = {
      customer_id: customerId,
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

    const orderData = {
      customer_id: customerId,
      order_date: orderdateInput
        .val()
        .trim(),
      order_time: ordertimeInput
        .val()
        .trim(),
      delivery_pickup: orderdeliverypickupInput
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

    // upsertCustomer(customerData);
    upsertOrder(orderData);
    rowsToAdd.length = 0;
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
  function createCustomerRow(customerData) {
    // function createOrderRow(orderData) {
    // let dupCounter = 0;

    // console.log("orderData", orderData);

    const newTr = $('<tr>');
    newTr.data('customer', customerData);
    // console.log("newTr.data: ",newTr.data('customer'));

    newTr.append('<td>' + customerData.last_name + '</td>');
    newTr.append('<td>' + customerData.first_name + '</td>');
    newTr.append('<td>' + customerData.customer_id + '</td>');
    newTr.append('<td>' + customerData.address + ", " + customerData.city + '</td>');
    newTr.append('<td>' + moment(customerData.createdAt).format('YYYY-MM-DD') + '</td>');
    newTr.append('<td>' + "# Orders" + '</td>');
    newTr.append('<td> <button class="btn" id="manage-customer-section" data-bs-toggle="collapse" data-bs-target="#collapseCustomer" aria-expanded="false" aria-controls="collapseCustomer"> &#x1F469 </button></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-customer\'>X</a></td>');

    return newTr;
  }


  async function getCustomers() {
    customersPull.length = 0;

    $.get('/api/customers', function (customerdata) {

      //Sorting by Customer
      for (let i = 0; i < customerdata.length; i++) {
        customerdata.sort(compare);
      }

      // Populating customersPull array
      for (let i = 0; i < customerdata.length; i++) {
        customersPull.push(customerdata[i]);
      }

      console.log("customerdata", customerdata);

      const rowsToAdd = [];
      CustomerGetData.length = 0;

      //Copy orderdata to OrderGetData array (to build TR)
      for (let i = 0; i < customerdata.length; i++) {
        CustomerGetData.push(customerdata[i]);
        if ((i + 1) == customerdata.length) {
          createCustomerList();
        }
      };
    });

  };


  function handleDisplayCustomerInfo() {

    console.log("***GETTING CUSTOMER INFO ***")
    console.log("customersPull: ", customersPull);

    const listItemData = $(this).parent('td').parent('tr').data('customer');
    console.log("listItemData: ", listItemData);

    console.log("listItemData.id: ", listItemData.id);

    for (let k = 0; k < customersPull.length; k++) {
      if ((customersPull[k].id == listItemData.id)) {
        console.log("***MATCH***");
        $('#customer-firstname').val(customersPull[k].first_name);
        $('#customer-lastname').val(customersPull[k].last_name);
        $('#customer-address').val(customersPull[k].address);
        $('#customer-city').val(customersPull[k].city);
        $('#customer-zip').val(customersPull[k].zip);
        $('#customer-phone').val(customersPull[k].phone);
      };
    };
  };


  //Sort by priority
  function compare(a, b) {

    const aVal = a.last_name + a.first_name;
    // console.log("aVal: ", aVal);

    const bVal = b.last_name + b.first_name;
    // console.log("bVal: ", bVal);

    // if (a.customer < b.customer) {
    if (aVal < bVal) {
      return -1;
    }
    // if (a.customer > b.customer) {
    if (aVal > bVal) {
      return 1;
    }
    return 0;
  }

  function renderCustomersDropdown(customers) {
    customersList.children().not(':last').remove();
    customersContainer.children('.alert').remove();
    customersList.prepend(customers);
  };

  function renderCustomersSelect(customers) {
    // console.log("customers: ", customers)
    customerSelect.children().not(':last').remove();
    customerSelectContainer.children('.alert').remove();
    customerSelect.prepend(customers);
  };



  function createCustomerList() {

    console.log("CustomerGetData: ", CustomerGetData)

    // Display Current Order Summary Table
    const rowsToAdd = [];
    for (let i = 0; i < CustomerGetData.length; i++) {

      rowsAdded = i;

      rowsToAdd.push(createCustomerRow(CustomerGetData[i]));
      renderCustomerList(rowsToAdd);
    };
    rowsToAdd.length = 0;
  };

  // A function for rendering the list of orders to the page
  function renderCustomerList(rows) {
    customerList.children().not(':last').remove();
    customerContainer.children('.alert').remove();
    if (rows.length) {
      // orderList.prepend(rows);
      customerList.append(rows);
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

  // Function for handling what to render when there are no orders
  function renderEmpty() {
    const alertDiv = $('<div>');
    alertDiv.addClass('alert alert-danger');
    alertDiv.text('You must create a Order before you can create a OrderDetail.');
    orderContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {

    const listItemData = $(this).parent('td').parent('tr').data('customer');
    console.log("listItemData: ", listItemData);

    const id = listItemData.id;
    $.ajax({
      method: 'DELETE',
      url: '/api/customers/' + id,
    })
      .then(getCustomers);
  }

  // A function for updating a link's details.
  function payOrder(paidData) {
    $.ajax({
      method: 'PUT',
      url: '/api/payorder',
      data: paidData,
    })
      .then(getOrders);
  };

  function renderPaidConf() {
    const paidConf = $('<div>');
    updateConf.addClass('alert alert-success');
    updateConf.addClass('update-conf-msg');
    updateConf.addClass('update-conf-column');
    updateConf.text('Order paid.');
    updateConf.append('<div><a class="btn btn-success update-conf-dismiss" type="button" href="/main"> Dismiss </a></div>');
    $('.card-body').append(paidConf);
  }


});
