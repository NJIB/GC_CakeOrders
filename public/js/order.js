$(document).ready(function () {

  // Getting references to the name inputs and order date
  let firstnameInput = $('#order-firstname');
  let lastnameInput = $('#order-lastname');
  let orderdateInput = $('#order-delivery_date');
  const ordertimeInput = $('#order-delivery_pickup_time');
  const orderdeliverypickupInput = $('#order-delivery_pickup');
  const address = $('#order-customer_address');
  const city = $('#order-customer_city');
  const zip = $('#order-customer_zip');
  const phone = $('#order-customer_phone');

  const newCustomerfirstname = $('#newcustomer-firstname');
  const newCustomerlastname = $('#newcustomer-lastname');
  const newCustomeraddress = $('#newcustomer-customer_address');
  const newCustomercity = $('#newcustomer-customer_city');
  const newCustomerzip = $('#newcustomer-customer_zip');
  const newCustomerphone = $('#newcustomer-customer_phone');

  let customersPull = [];
  let rowsToBeAdded = [];
  let customersToAdd = [];
  let customerOptionsToAdd = [];
  let newCustomerselect = $('<select>');
  const customersList = $('ul');
  const customersContainer = $('customerDropdown');
  const customerSelect = $('#CustomerSelect');
  const customerSelectContainer = $('CustomerSelect')
  let customerSelected = {};

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

  // const orderList = $('tbody');
  const orderList = $('#orderList');
  const orderContainer = $('.order-container');
  let orderRevTotal = 0;

  // 9-28-21 Making TR global
  let newTr;
  let OrderGetData = [];
  let CustomerGetData = [];
  let rowsToAdd = [];
  let rowsAdded;

  // const chart1Area = $('#myBubbleChart1');
  // const chart2Area = $('#myBubbleChart2');
  // var ctx = $('#myBubbleChart');
  // let chart1Data = [{}];
  // let chart2Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Order
  $(document).on('click', '#add-customer', handleCustomerCreateSubmit);
  $(document).on('submit', '.order-form', handleOrderFormSubmit);
  $(document).on('click', '.delete-order', handleDeleteButtonPress);
  $(document).on('click', '.update', handleUpdateButtonPress);
  $(document).on('change', '#CustomerSelect', handleDisplayCustomerInfo);

  // Getting the initial list of Customers and Orders
  getOrders();
  getCustomers();

  // A function to handle what happens when the form is submitted to create a new Order
  function handleCustomerCreateSubmit(event) {
    event.preventDefault();

    console.log("Create Customer button clicked");

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

    console.log("Order submitted!");
    console.log("customerSelected: ", customerSelected);

    // Don't do anything if the name fields hasn't been filled out
    // if (!firstnameInput.val().trim()) {
    if (!customerSelected.first_name) {
      return;
    }

    // let customerId = lastnameInput.val().trim() + firstnameInput.val().trim().substr(0, 1);
    let customerId = customerSelected.last_name + customerSelected.first_name.substr(0, 1);
    console.log("customerId: ", customerId);

    const customerData = {
      customer_id: customerId,
      first_name: customerSelected.first_name,
      last_name: customerSelected.last_name,
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

    rowsToAdd.length = 0;
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
    // let dupCounter = 0;

    const newTr = $('<tr>');
    newTr.data('order', orderData);
    const orderDate = moment(orderData.order_date).format('dddd MMMM Do YYYY');
    newTr.append('<td>' + orderDate + '</td>');
    newTr.append('<td>' + orderData.cake_theme + '</td>');
    newTr.append('<td>' + orderData.customer_id + '</td>');
    newTr.append('<td> <button class="btn btn-success"><a style=\'cursor:pointer;color:white;\' href=\'/order-details?order_id=' + orderData.id + '\' /a> >> </button></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-order\'>X</a></td>');
    return newTr;
  }

  // Function for retrieving orders and getting them ready to be rendered to the page
  function getOrders() {

    $.get('/api/orders', function (orderdata) {

      //Copy orderdata to OrderGetData array (to build TR)
      for (let i = 0; i < orderdata.length; i++) {
        OrderGetData.push(orderdata[i]);
        if ((i + 1) == orderdata.length) {
          createOrderSummary();
        }
      };

      // console.log("OrderGetData: ", OrderGetData);

      // renderOrderList(rowsToAdd);
      firstnameInput.val('');
      lastnameInput.val('');
      orderdateInput.val('');
    });
  }

  async function getCustomers() {
    customersPull.length = 0;

    const data = await $.get('/api/customers', function () { });
    // console.log('data: ', data);

    const rowsToAdd = [];

    //Sorting by Customer
    for (let i = 0; i < data.length; i++) {
      data.sort(compare);
    }

    // Populating prioritiesPull array and Priorities dropdown
    for (let i = 0; i < data.length; i++) {
      customersPull.push(data[i]);
      // console.log("customersPull[", i, "]: ", customersPull[i]);
    }

    customersToAdd.length = 0;

    // console.log("customersPull.length: ", customersPull.length);

    // for (let j = 0; j < customersPull.length; j++) {
    //   if (j == 0) {
    //     // console.log("j == 0 !!!")
    //     const selectCustomer = $('<li>');
    //     selectCustomer.data(customersPull[j]);

    // console.log("selectCustomer.data", selectCustomer.data);

    // selectCustomer.append('<a class="dropdown-item customerDropdown" value="#" href="#">Select All</a></li>');
    // customersToAdd.push(selectCustomer)

    // const dropdownDivider = $('<li>');
    // dropdownDivider.append('<hr class="dropdown-divider">');
    // customersToAdd.push(dropdownDivider)
    //   }

    //   customersToAdd.push(createCustomersDropDown(customersPull[j], j));
    // };

    //Building priority select dropdown (in Add Asset form)
    for (let l = 0; l < customersPull.length; l++) {
      customerOptionsToAdd.push(createCustomersSelect(customersPull[l], l));
      renderCustomersDropdown(customersToAdd);
      renderCustomersSelect(customerOptionsToAdd);

    };

    // function createCustomersDropDown(customerPull, i) {
    //   // console.log("customerPull: ", customerPull)

    //   const newCustomerli = $('<li>');
    //   newCustomerli.data('customer', customerPull);
    //   newCustomerli.append('<a class="dropdown-item customerDropdown" value=' + customerPull.customer + ' href="#">' + customerPull.customer + '</a></li>');
    //   return newCustomerli;
    };

    function createCustomersSelect(customersPull, l) {
      // console.log("customersPull: ", customersPull)

      newCustomerselect.data('customertype', customersPull);

      if (l == 0) {
        newCustomerselect.append('<option>Select Customer... </option>');
      }
      const comma = ", ";
      const spacer = "&nbsp &nbsp";
      const nameConcat = customersPull.last_name + comma + customersPull.first_name + spacer + "(" + customersPull.address + ")";
      // console.log("nameConcat: ", nameConcat);
      // console.log("customersPull[", i, "].customer: :", customersPull.customer);
      newCustomerselect.append('<option value=' + nameConcat + '>' + nameConcat + '</option>');
      // console.log("newCustomerselect: ", newCustomerselect);

      return newCustomerselect;
    };

    function handleDisplayCustomerInfo() {
      // console.log("customersPull: ", customersPull);

      const IDconcat = $(CustomerSelect).find("option:selected").text().trim();
      // console.log("IDconcat: ", IDconcat);

      const last_nameSelected = IDconcat.substring(0, IDconcat.indexOf(","));
      const first_nameSelected = IDconcat.substring((IDconcat.indexOf(",") + 2), (IDconcat.indexOf("(") - 3));
      const addressSelected = IDconcat.substring((IDconcat.indexOf("(") + 1), (IDconcat.indexOf(")")));
      // console.log("first_nameSelected: ", first_nameSelected);
      // console.log("last_nameSelected: ", last_nameSelected);
      // console.log("addressSelected: ", addressSelected);

      for (let k = 0; k < customersPull.length; k++) {
        // console.log("customersPull[", k, "].first_name: ", customersPull[k].first_name);
        // console.log("customersPull[", k, "].last_name: ", customersPull[k].last_name);
        // console.log("customersPull[", k, "].address: ", customersPull[k].address);
        if ((customersPull[k].first_name == first_nameSelected) && (customersPull[k].last_name == last_nameSelected) && (customersPull[k].address == addressSelected)) {
          const customername = [customersPull[k].first_name, customersPull[k].last_name];
          const customername_concat = customername.join(" ");
          customerSelected.first_name = customersPull[k].first_name;
          customerSelected.last_name = customersPull[k].last_name;

          $('#order-customername').text(customername_concat);
          $('#order-firstname').text(customersPull[k].first_name);
          $('#order-lastname').text(customersPull[k].last_name);
          $('#order-customer_address').text(customersPull[k].address);
          $('#order-customer_city').text(customersPull[k].city);
          $('#order-customer_zip').text(customersPull[k].zip);
          $('#order-customer_phone').text(customersPull[k].phone);
          // $('#order-customer_notes').text(customersPull[k].notes);
          $('#order-customer_notes').text("*** Customer notes here ***");
        };
      };
      createOrderSummary();
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



    //4/6/22 - Commented out to replace with async function above
    // function getCustomers() {

    //   $.get('/api/customers', function (customerdata) {

    //     //Copy customerdata to CustomerGetData array (to build TR)     
    //     for (let i = 0; i < customerdata.length; i++) {
    //       CustomerGetData.push(customerdata[i]);
    //       // After copying customerdata to CustomerGetData, create table rows row for rendering
    //       if ((i + 1) == customerdata.length) {
    //         createOrderSummary();
    //       }
    //     };
    //   })
    // }

    function createOrderSummary() {
      // Display Current Order Summary Table
      const selectedCustomerId = lastnameInput[0].childNodes[0].data + (firstnameInput[0].childNodes[0].data.substr(0, 1));
      console.log("selectedCustomerId: ", selectedCustomerId);

      rowsToAdd.length = 0;
      for (let i = 0; i < OrderGetData.length; i++) {
        rowsAdded = i;

        if (OrderGetData[i].customer_id == selectedCustomerId) {
          rowsToAdd.push(createOrderRow(OrderGetData[i]));
        }

        renderOrderList(rowsToAdd);
      };

      rowsToAdd.length = 0;
    };

    // A function for rendering the list of orders to the page
    function renderOrderList(rows) {
      orderList.children().not(':last').remove();
      orderContainer.children('.alert').remove();
      if (rows.length) {
        // orderList.prepend(rows);
        orderList.append(rows);
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

      console.log("$(this): ", $(this));
      console.log("$(this).parent('td'): ", $(this).parent('td'));
      console.log("$(this).parent('td').parent('tr'): ", $(this).parent('td').parent('tr'));
      console.log("$(this).parent('td').parent('tr').data('order'): ", $(this).parent('td').parent('tr').data('order'));


      const listItemData = $(this).parent('td').parent('tr').data('order');
      console.log("listItemData: ", listItemData);

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
