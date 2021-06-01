$(document).ready(function () {
  /* global moment */

  // blogContainer holds all of our orderdetails
  const blogContainer = $('.orderdetail-container');
  const orderdetailCategorySelect = $('#category');

  //Array of objects to hold data for upsert to Routes table
  let orderdetailChangeLog = [];
  let progfamChangeLog = [];
  let togChangeLog = [];
  let orderdetailsData = [];

  let blankOrderdetail = {
    OrderId: '',
    RouteId: '',
    acquisition: '',
    buyers: '',
    hurdle: '',
    markets: '',
    offerings: '',
    productivity: '',
    reputation: '',
    demand: '',
    engagement: '',
    enablement: '',
    intelligence: ''
  };

  const newTr = $('<tr>');
  const orderRowsToAdd = [];
  const orderdetailRowsToAdd = [];
  // const orderList = $('.order-list');
  // const orderdetailList = $('.orderdetail-list');
  const orderList = $('tbody');
  const orderdetailList = $('tbody');
  const orderContainer = $('.order-container');
  const orderdetailContainer = $('.orderdetail-container');

  // let chart1Data = [{}];
  // let chart2Data = [{}];

  // Click events for the edit and delete buttons
  // $(document).on('click', 'button.delete-orderdetail', handleOrderDetailDelete);
  $(document).on('click', '.delete-orderdetail', handleOrderDetailDelete);
  $(document).on('click', 'button.edit', handleOrderDetailEdit);
  $(document).on('click', '.form-check-input', handleCheckboxClick);
  $(document).on('change', '.progfam-input', programFamilyUpdate);
  $(document).on('submit', '#orderdetails-form', handleRoutesFormSubmit);
  // $(document).on('click', '#order_submit', handleRoutesFormSubmit);
  $(document).on('click', '.ddSelect', dropdownValue);
  $(document).on('click', '.update', handleRoutesFormSubmit);

  // Variable to hold our orderdetails
  let orderdetails;
  const orderdetailIndex = "0123456789";
  let rowCount = 0;
  let nextOrderdetailId = '';
  let orderdetailRecordFound = false;
  let testId = '';
  let searchString = '';
  let RouteIdRef = '';
  let menuvar = '';

  let NEWorder = '';
  let NEWorderdetails = '';

  // The code below handles the case where we want to get orderdetails for a specific order
  // Looks for a query param in the url for order_id - DO I NEED?
  const url = window.location.search;
  console.log("url: ", url);

  //Identifying the order ID for the page loaded
  let OrderId;

  // Getting Order info
  // getOrders();
  getOrderData();
  getOrderData();


  //Pulling order data from database
  async function getOrderData() {
    const orderData = await orderAPICall();
  }

  //Function to pull order data
  function orderAPICall() {
    return new Promise(nbOrder => {
      $.get('/api/orders', function (data) {
        NEWorder = data;
        console.log("NEWorder: ", NEWorder);

        orderRevTotal = 0;
        nextyearSgmtRevTotal = 0;

        for (let i = 0; i < NEWorder.length; i++) {
          const idMatch = ((NEWorder[i].id / 1) - (OrderId / 1));
          // console.log("idMatch: ", idMatch);

          if (idMatch == 0) {
            // console.log("*** Order id matches: ", OrderId, " ***")
            // console.log("order[i]: ", NEWorder[i])
            orderRowsToAdd.push(createOrderRow(NEWorder[i], i));
          };

          renderOrderList(orderRowsToAdd);
        };
      });
    })
  }

  //Pulling orderdetail data from database
  async function getOrderData() {

    //If order ID found, pull the data from the db for that order
    if (url.indexOf('?order_id=') !== -1) {
      OrderId = url.split('=')[1];
      // console.log("OrderId: ", OrderId);    
      orderURL = '/?order_id=' + OrderId;
      // console.log("orderURL: ", orderURL);
      const orderData = await orderAPICall(orderURL);
    }
  }

  //Function to pull orderdetail data
  function orderAPICall(orderURL) {
    return new Promise(nbOrder => {
      $.get('/api/orderdetails' + orderURL, function (data) {
        NEWorderdetails = data;
        console.log("NEWorderdetails: ", NEWorderdetails);
        // console.log("NEWorderdetails.length: ", NEWorderdetails.length);

        //Defining ID for blank row
        // nextOrderdetailId = OrderId + orderdetailIndex.substring(NEWorderdetails.length, NEWorderdetails.length + 1);
        nextOrderdetailId = OrderId + (getRandomInt(0, 1000));
        console.log("nextOrderdetailId: ", nextOrderdetailId);

        //Create orderdetail rows for this order
        for (let i = 0; i < NEWorderdetails.length; i++) {
          orderdetailRowsToAdd.push(createOrderDetailRow(NEWorderdetails[i]));
          console.log("orderdetailRowsToAdd: ", orderdetailRowsToAdd);
        };

        //Add in blank row in orderdetail table - to capture new entries
        orderdetailRowsToAdd.push(createBlankRow(NEWorder, nextOrderdetailId));

        //Render orderdetails to the screen
        renderOrderdetailList(orderdetailRowsToAdd);
      })
    })
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  // Function for retrieving orders and getting them ready to be rendered to the page
  function getOrders() {

    getOrderData();

    $.get('/api/orders', function (data) {
      let order = data;
      console.log("order: ", order);

      orderRevTotal = 0;
      nextyearSgmtRevTotal = 0;

      for (let i = 0; i < order.length; i++) {
        const idMatch = ((order[i].id / 1) - (OrderId / 1));
        // console.log("idMatch: ", idMatch);

        if (idMatch == 0) {
          console.log("*** Order id matches: ", OrderId, " ***")
          console.log("data[i]: ", data[i])
          console.log("order[i]: ", order[i])

          orderRowsToAdd.push(createOrderRow(order[i], i));

          nextOrderdetailId = OrderId + orderdetailIndex.substring(0, 1);
          console.log("nextOrderdetailId: ", nextOrderdetailId);

          // console.log("orderdetails exist?: ", orderdetails.length);
          console.log("orderdetails exist?: ", NEWorderdetails.length);
          if (NEWorderdetails.length > 0) {
            orderRowsToAdd.push(createBlankRow(order[i], i));
          };
        };
      };
      console.log("orderRowsToAdd: ", orderRowsToAdd);
      renderOrderList(orderRowsToAdd);
    });
  }


  // This function grabs orderdetails from the database and updates the view
  // function getOrderDetails(order) {

  //   OrderId = order || '';
  //   console.log("OrderId: ", OrderId);

  //   if (OrderId) {
  //     orderURL = '/?order_id=' + OrderId;
  //   }

  //   //API Call to get data for specific orderdetail
  //   $.get('/api/orderdetails' + orderURL, function (data) {
  //     orderdetails = data;
  //     console.log("orderdetails: ", orderdetails);
  //   });

  //   orderdetailRowsToAdd.push(createOrderDetailRow(orderdetails));
  //   console.log("orderdetailRowsToAdd: ", orderdetailRowsToAdd);

  // }



  // This function does an API call to delete orderdetails
  function deleteOrderDetail(id) {
    console.log("id: ", id);

    $.ajax({
      method: 'DELETE',
      url: '/api/orderdetails/' + id,
    })
      .then(function () {
        location.reload();
        // getOrderDetails(orderdetailCategorySelect.val());
      });
  }



  // InitializeRows handles appending all of our constructed orderdetail HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    console.log("orderdetails: ", orderdetails);
    console.log("orderdetails.length: ", orderdetails.length);
    const orderdetailsToAdd = [];
    for (let i = 0; i < orderdetails.length; i++) {
      orderdetailsToAdd.push(createNewRow(orderdetails[i]));
    }
    blogContainer.append(orderdetailsToAdd);
  }

  // This function constructs a orderdetail's HTML
  // function createNewRow(orderdetail) {
  //   let formattedDate = new Date(orderdetail.createdAt);
  //   formattedDate = moment(formattedDate).format('MMMM Do YYYY, h:mm:ss a');

  //   // console.log("orderdetail: ", orderdetail);

  //   const newOrderDetailCard = $('<div>');
  //   newOrderDetailCard.addClass('card');

  //   const newOrderDetailCardHeading = $('<div>');
  //   newOrderDetailCardHeading.addClass('card-header');

  //   const deleteBtn = $('<button>');
  //   deleteBtn.text('x');
  //   deleteBtn.addClass('delete btn btn-danger');

  //   const editBtn = $('<button>');
  //   editBtn.text('EDIT');
  //   editBtn.addClass('edit btn btn-info');

  //   const newOrderDetailTitle = $('<h2>');
  //   const newOrderDetailDate = $('<small>');
  //   const newOrderDetailOrder = $('<h5>');
  //   newOrderDetailOrder.text('Written by: ' + orderdetail.Order.name);
  //   newOrderDetailOrder.css({
  //     'float': 'right',
  //     'color': 'blue',
  //     'margin-top':
  //       '-10px',
  //   });

  //   const newOrderDetailCardBody = $('<div>');
  //   newOrderDetailCardBody.addClass('card-body');

  //   const newOrderDetailBody = $('<p>');
  //   newOrderDetailTitle.text(orderdetail.title + ' ');
  //   newOrderDetailBody.text(orderdetail.body);
  //   newOrderDetailDate.text(formattedDate);
  //   newOrderDetailTitle.append(newOrderDetailDate);
  //   newOrderDetailCardHeading.append(deleteBtn);
  //   newOrderDetailCardHeading.append(editBtn);
  //   newOrderDetailCardHeading.append(newOrderDetailTitle);
  //   newOrderDetailCardHeading.append(newOrderDetailOrder);
  //   newOrderDetailCardBody.append(newOrderDetailBody);
  //   newOrderDetailCard.append(newOrderDetailCardHeading);
  //   newOrderDetailCard.append(newOrderDetailCardBody);
  //   newOrderDetailCard.data('orderdetail', orderdetail);
  //   return newOrderDetailCard;
  // }

  // This function displays a message when there are no orderdetails
  // function displayEmpty(id) {
  //   const query = window.location.search;
  //   let partial = '';
  //   if (id) {
  //     partial = ' for Order #' + id;
  //   }
  //   blogContainer.empty();
  //   const messageH2 = $('<h2>');
  //   messageH2.css({ 'text-align': 'center', 'margin-top': '50px' });
  //   messageH2.html('No orderdetails yet' + partial + ', navigate <a href=\'/sms' + query +
  //     '\'>here</a> in order to get started.');
  //   blogContainer.append(messageH2);
  // }

  function dropdownValue(e) {
    menuvar = $(this).text();
    console.log("menuvar: ", menuvar);
    const menuvarId = $(this)[0].id;
    console.log("menuvarId: ", menuvarId);

    const tog_data = {
      id: menuvarId,
      value: menuvar,
      OrderId: OrderId
    };
    console.log("tog_data: ", tog_data);

    //Building log of changes to upload to db
    togChangeLog.push(tog_data);
    console.log("togChangeLog: ", togChangeLog);

    renderOrderdetailList(orderdetailRowsToAdd);
  }


  function programFamilyUpdate(e) {

    //Reads value of field clicked 
    // console.log("this.val(): ", $(this).val());
    console.log("e.target.id: ", e.target.id);
    console.log("e.target.value: ", e.target.value);
    // console.log("e: ", e);

    // Build object to capture each change
    const progfam_id = e.target.id;
    const progfam_value = e.target.value;

    const progfam_data = {
      id: progfam_id,
      value: progfam_value,
      OrderId: OrderId
    };
    console.log("progfam_data: ", progfam_data);

    //Building log of changes to upload to db
    progfamChangeLog.push(progfam_data);
    console.log("progfamChangeLog: ", progfamChangeLog);
  }

  function handleCheckboxClick(e) {

    //Resetting flag
    orderdetailRecordFound = false;

    //Identifies field clicked 
    // console.log("e.target.id: ", e.target.id);
    if (e.target.value == 'unchecked') {
      e.target.value = 'checked';
    } else {
      e.target.value = 'unchecked';
    }
    //Reads value of field clicked 
    // console.log("this.val(): ", $(this).val());
    console.log(e.target.id, ": ", e.target.value);
    // console.log("e: ", e);

    // Build object to capture each change
    const change_id = e.target.id;
    const change_value = e.target.value;

    const change_data = {
      id: change_id,
      value: change_value,
      OrderId: OrderId
    };
    // console.log("change_data: ", change_data);

    //Building log of changes to upload to db
    orderdetailChangeLog.push(change_data);
    // console.log("orderdetailChangeLog: ", orderdetailChangeLog);

    // console.log("NEWorderdetails: ", NEWorderdetails);

    // if (!NEWorderdetails || !NEWorderdetails.length) {
    //   console.log("NO ORDER DETAILS FOUND")
    // } else {
    //   console.log("OrderDetail", NEWorderdetails[0].OrderId.toString(), "FOUND");
    // };


    searchString = e.target.id.substr((e.target.id.indexOf('_') + 1), e.target.id.length);
    console.log("searchString: ", searchString);

    //Looping through orderdetailsData, to update clicks
    console.log("orderdetailsData: ", orderdetailsData);
    for (var i = 0; i < orderdetailsData.length; i++) {

      if (orderdetailsData[i].RouteId.toString() == e.target.id.substr((e.target.id.indexOf('_') + 1), e.target.id.length)) {
        console.log("MATCH!");

        // Defining IDs to be referenced when updating the OrderDetails table
        orderdetailRecordFound = true;
        console.log("orderdetailRecordFound: ", orderdetailRecordFound);

        const hurdle_id = ("hurdle_" + orderdetailsData[i].RouteId);
        // console.log("hurdle_id: ", hurdle_id);
        const markets_id = ("markets_" + orderdetailsData[i].RouteId);
        // console.log("markets_id: ", markets_id);
        const buyers_id = ("buyers_" + orderdetailsData[i].RouteId);
        // console.log("buyers_id: ", buyers_id);
        const offerings_id = ("offerings_" + orderdetailsData[i].RouteId);
        // console.log("offerings_id: ", offerings_id);
        const productivity_id = ("productivity_" + orderdetailsData[i].RouteId);
        // console.log("productivity_id: ", productivity_id);
        const acquisition_id = ("acquisition_" + orderdetailsData[i].RouteId);
        // console.log("acquisition_id: ", acquisition_id);

        // const hurdle_desc = $('#' + hurdle_id);
        // console.log('hurdle_desc:', hurdle_desc.val().trim());
        // orderdetailsData[i].hurdle = hurdle_desc.val().trim();

        console.log("orderdetailChangeLog: ", orderdetailChangeLog);

        //Looping through orderdetailChangeLog, and updating orderdetailsData if match found
        orderdetailChangeLog.forEach(change => {
          if (change.id == change_id) {
            orderdetailsData[i].markets = change_value;
          };

          if (buyers_id == change_id) {
            orderdetailsData[i].buyers = change_value;
          };

          if (offerings_id == change_id) {
            orderdetailsData[i].offerings = change_value;
          };

          if (productivity_id == change_id) {
            orderdetailsData[i].productivity = change_value;
          };

          if (acquisition_id == change_id) {
            orderdetailsData[i].acquisition = change_value;
          };
        })
      }
    }

    // console.log("orderdetailsData: ",orderdetailsData);
    console.log("orderdetailRecordFound: ", orderdetailRecordFound);

    if (orderdetailRecordFound == false) {

      console.log("No orderdetail record found");

      const hurdle_id = ("hurdle_" + searchString);
      const markets_id = ("markets_" + searchString);
      const buyers_id = ("buyers_" + searchString);
      const offerings_id = ("offerings_" + searchString);
      const productivity_id = ("productivity_" + searchString);
      const acquisition_id = ("acquisition_" + searchString);

      console.log("change_id: ", change_id);
      console.log("change_value: ", change_value);

      blankOrderdetail.OrderId = OrderId;
      console.log("blankOrderdetail.OrderId: ", blankOrderdetail.OrderId);
      blankOrderdetail.RouteId = e.target.id.substr((e.target.id.indexOf('_') + 1), e.target.id.length);
      console.log("blankOrderdetail.RouteId: ", blankOrderdetail.RouteId);

      orderdetailChangeLog.forEach(change => {
        if (markets_id == change_id) {
          blankOrderdetail.markets = change_value;
        };

        if (buyers_id == change_id) {
          blankOrderdetail.buyers = change_value;
        };

        if (offerings_id == change_id) {
          blankOrderdetail.offerings = change_value;
        };

        if (productivity_id == change_id) {
          blankOrderdetail.productivity = change_value;
        };

        if (acquisition_id == change_id) {
          blankOrderdetail.acquisition = change_value;
        };
      })
      blankOrderdetail.hurdle = ($('#hurdle_' + searchString).val());
      console.log("blankOrderdetail.hurdle: ", blankOrderdetail.hurdle);
    };

    console.log("blankOrderdetail: ", blankOrderdetail);
    console.log("orderdetailsData: ", orderdetailsData);

  };



  // This function figures out which orderdetail we want to delete and then calls deleteOrderDetail
  function handleOrderDetailDelete() {
    console.log("Deleting orderdetail record!");

    const currentOrderDetail = $(this)
      .parent()
      .parent()
      .data('orderdetail');

    console.log("currentOrderDetail: ", currentOrderDetail);
    console.log("currentOrderDetail.RouteId: ", currentOrderDetail.id);

    deleteOrderDetail(currentOrderDetail.id);
  }



  // This function figures out which orderdetail we want to edit and takes it to the appropriate url
  function handleOrderDetailEdit() {
    const currentOrderDetail = $(this)
      .parent()
      .parent()
      .data('orderdetail');
    window.location.href = '/sms?orderdetail_id=' + currentOrderDetail.id;
  }



  // A function to handle what happens when the form is submitted to create a new orderdetail record
  function handleRoutesFormSubmit(event) {
    event.preventDefault();

    console.log("blankOrderdetail: ", blankOrderdetail);
    console.log("orderdetailsData: ", orderdetailsData);

    let blankRowUpsert = [];
    blankRowUpsert.push(blankOrderdetail);
    console.log("blankRowUpsert: ", blankRowUpsert);
    upsertRoutes(blankRowUpsert);

    //Need to pull down existing records from the database - to determine if it needs to be POST or a PUT

    //If no orderdetail records exist
    // if (!orderdetailsData || !orderdetailsData.length) {
    console.log("orderdetailRecordFound: ", orderdetailRecordFound);
    if (orderdetailRecordFound == false) {

      console.log("orderdetailRecordFound false -- creating new row");

      createNewRoute();

      // console.log("Upserting new route to database")

      // let newOrderdetail = {
      //   OrderId: '',
      //   RouteId: '',
      //   acquisition: '',
      //   buyers: '',
      //   hurdle: '',
      //   markets: '',
      //   offerings: '',
      //   productivity: ''
      // };

      // //Build orderdetailsData object for upserting
      // orderdetailChangeLog.forEach(change => {
      //   console.log("change.id: :", change.id);
      //   console.log("change.value: :", change.value);
      //   console.log("change.OrderId: :", change.OrderId);

      //   newOrderdetail.OrderId = change.OrderId;
      //   console.log(" newOrderdetail.OrderId: ", newOrderdetail.OrderId);
      //   newOrderdetail.RouteId = change.id.substr((change.id.indexOf('_') + 1), change.id.length);
      //   console.log(" newOrderdetail.RouteId: ", newOrderdetail.RouteId);

      //   switch (change.id.substr(0, (change.id.indexOf('_')))) {
      //     case "markets":
      //       newOrderdetail.markets = change.value;
      //       break;
      //     case "buyers":
      //       newOrderdetail.buyers = change.value;
      //       break;
      //     case "offerings":
      //       newOrderdetail.offerings = change.value;
      //       break;
      //     case "productivity":
      //       newOrderdetail.productivity = change.value;
      //       break;
      //     case "acquisition":
      //       newOrderdetail.acquisition = change.value;
      //       break;
      //   }

      //   //Ensure Hurdle text included in upsert / update record
      //   let hurdle_id = ($('#hurdle_' + change.id.substr((change.id.indexOf('_') + 1), change.id.length)));
      //   // console.log("hurdle_id: ", hurdle_id);
      //   let hurdle_value = hurdle_id.val();
      //   console.log("hurdle_value: ", hurdle_value);

      //   newOrderdetail.hurdle = hurdle_value;
      //   console.log("newOrderdetail: ", newOrderdetail);

      //   orderdetailsData.push(newOrderdetail);
      //   console.log("orderdetailsData: ", orderdetailsData);
      // })
      // upsertRoutes(orderdetailsData);

    }
    else
      //If orderdetail records do exist
      console.log("orderdetailRecordFound true -- updating existing row");

    {
      console.log("orderdetailsData: ", orderdetailsData);

      for (let i = 0; i < orderdetailsData.length; i++) {
        console.log("orderdetailsData object: ", orderdetailsData[i]);

        //Checking each item in change log, to see if it matches the orderdetail record
        orderdetailChangeLog.forEach(update => {

          let searchId = update.id.substr((update.id.indexOf('_') + 1), update.id.length);
          console.log("searchId: ", searchId);

          if (searchId == orderdetailsData[i].RouteId) {
            console.log("*** Orderdetail match: ", searchId, orderdetailsData[i].RouteId, " ***");

            orderdetailRecordFound = true;
            console.log("orderdetailRecordFound: ", orderdetailRecordFound);

            switch (update.id) {
              case ("markets_" + searchId):
                orderdetailsData[i].markets = update.value;
                break;
              case ("buyers_" + searchId):
                orderdetailsData[i].buyers = update.value;
                break;
              case ("offerings_" + searchId):
                orderdetailsData[i].offerings = update.value;
                break;
              case ("productivity_" + searchId):
                orderdetailsData[i].productivity = update.value;
                break;
              case ("acquisition_" + searchId):
                orderdetailsData[i].acquisition = update.value;
                break;
            }

            let hurdle_id = ('#hurdle_' + searchId);
            let hurdle_value = $(hurdle_id).val();
            console.log("hurdle_value: ", hurdle_value);
            if (hurdle_value != orderdetailsData[i].hurdle && hurdle_value != '') {
              console.log("Updating hurdle value!")
              orderdetailsData[i].hurdle = hurdle_value;
            }

            console.log("orderdetailsData[i]: ", orderdetailsData[i]);

            console.log("UPDATING!");
            // updateRouteInfo(orderdetails, orderdetailsData[i])
            updateRouteInfo(orderdetailsData[i])

          }
        });
        console.log("orderdetailsData: ", orderdetailsData);


        // console.log("blankOrderdetail: ", blankOrderdetail);
        // orderdetailsData = [];
        // blankRowUpsert = [];
      };

    };
    // getOrderData();
    orderdetailChangeLog = [];
    location.reload();
  };


  function createNewRoute() {
    console.log("*** Creating new route in database ***")

    let newOrderdetail = {
      OrderId: '',
      RouteId: '',
      acquisition: '',
      buyers: '',
      hurdle: '',
      markets: '',
      offerings: '',
      productivity: ''
    };

    //Build orderdetailsData object for upserting
    orderdetailChangeLog.forEach(change => {
      console.log("change.id: :", change.id);
      console.log("change.value: :", change.value);
      console.log("change.OrderId: :", change.OrderId);

      newOrderdetail.OrderId = change.OrderId;
      console.log(" newOrderdetail.OrderId: ", newOrderdetail.OrderId);
      newOrderdetail.RouteId = change.id.substr((change.id.indexOf('_') + 1), change.id.length);
      console.log(" newOrderdetail.RouteId: ", newOrderdetail.RouteId);

      switch (change.id.substr(0, (change.id.indexOf('_')))) {
        case "markets":
          newOrderdetail.markets = change.value;
          break;
        case "buyers":
          newOrderdetail.buyers = change.value;
          break;
        case "offerings":
          newOrderdetail.offerings = change.value;
          break;
        case "productivity":
          newOrderdetail.productivity = change.value;
          break;
        case "acquisition":
          newOrderdetail.acquisition = change.value;
          break;
      }

      //Ensure Hurdle text included in upsert / update record
      let hurdle_id = ($('#hurdle_' + change.id.substr((change.id.indexOf('_') + 1), change.id.length)));
      // console.log("hurdle_id: ", hurdle_id);
      let hurdle_value = hurdle_id.val();
      console.log("hurdle_value: ", hurdle_value);

      newOrderdetail.hurdle = hurdle_value;
      console.log("newOrderdetail: ", newOrderdetail);

      orderdetailsData.push(newOrderdetail);
      console.log("orderdetailsData: ", orderdetailsData);
    })
    console.log("orderdetailsData: ", orderdetailsData);
    // upsertRoutes(orderdetailsData);
  }


  // A function for updating the OrderDetail table record
  function updateRouteInfo(newDetails) {
    // function updateRouteInfo(oldRecord, newDetails) {
    // console.log("oldRecord: ", oldRecord[0]);
    console.log("newDetails: ", newDetails);

    // for (let i = 0; i < oldRecord.length; i++) {
    //   orderdetailChangeLog.forEach(change => {

    //     switch (change.id) {
    //       case ("markets_" + oldRecord[i].OrderId):
    //         oldRecord[i].markets = change.value;
    //         break;
    //       case ("buyers_" + oldRecord[i].OrderId):
    //         oldRecord[i].buyers = change.value;
    //         break;
    //       case ("offerings_" + oldRecord[i].OrderId):
    //         oldRecord[i].offerings = change.value;
    //         break;
    //       case ("productivity_" + oldRecord[i].OrderId):
    //         oldRecord[i].productivity = change.value;
    //         break;
    //       case ("acquisition_" + oldRecord[i].OrderId):
    //         oldRecord[i].acquisition = change.value;
    //         break;
    //     }
    //   })
    // }
    // oldRecord[0].hurdle = newDetails.hurdle;
    // console.log("oldRecord (updated): ", oldRecord);

    $.ajax({
      method: 'PUT',
      url: '/api/orderdetails',
      // data: oldRecord[0],
      data: newDetails,
    });

  };



  // A function for creating a orderdetail.
  function upsertRoutes(orderdetailObj) {
    console.log("orderdetailObj in upsert: ", orderdetailObj);

    $.post('/api/orderdetails', orderdetailObj[0])
    // .then(getOrders);
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
    totalTr.append('<td><h4><b>$' + nextyearSgmtTotals + '</b></h4></td>');
    return totalTr;
  }



  // Function for creating a new list row for orders

  function createOrderRow(orderData) {
    console.log("orderData: ", orderData);

    const deal_size_yoy_id = "deal_size_yoy" + orderData.id;
    const deal_count_yoy_id = "deal_count_yoy" + orderData.id;

    const newTr = $('<tr>');
    newTr.data('order', orderData);

    console.log("rowCount: ", rowCount);

    //For first iteration, include order information - do not for subsequent rows
    if (rowCount === 0) {
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
    } else {
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
    }

    return newTr;
  }
  // End of createOrderRow 

  // function createBlankRow for creating a blank row at the end
  function createBlankRow(orderData) {
    // console.log("orderData: ", orderData);
    console.log("nextOrderdetailId: ", nextOrderdetailId);
    if (!nextOrderdetailId) {
      nextOrderdetailId = OrderId + "0";
      console.log("nextOrderdetailId: ", nextOrderdetailId);
    }

    const newTr = $('<tr>');
    newTr.data('orderdetail', orderData);
    newTr.append('<td>' + '<input id="hurdle_' + nextOrderdetailId + '" placeholder=' + 'E.g. Retention' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="markets_' + nextOrderdetailId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="buyers_' + nextOrderdetailId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="offerings_' + nextOrderdetailId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="productivity_' + nextOrderdetailId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="acquisition_' + nextOrderdetailId + '" value="unchecked">' + '</td>');

    // 11/20 Program Family add-in
    newTr.append('<td>' + '<input class="progfam-input" id="reputation_' + nextOrderdetailId + '" placeholder=' + 'Insert reputation action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="demand_' + nextOrderdetailId + '" placeholder=' + 'Insert demand action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="engagement_' + nextOrderdetailId + '" placeholder=' + 'Insert engagement action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="enablement_' + nextOrderdetailId + '" placeholder=' + 'Insert enablement action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="intelligence_' + nextOrderdetailId + '" placeholder=' + 'Insert intelligence action' + ' type="text" />' + '</td>');
    // End 11/20 Program Family add-in

    newTr.append('<td>' + '<button type="submit" class="btn btn-primary">Submit > </button>' + '</td>');

    return newTr;
  }
  // End of createBlankRow 


  //This function builds the OrderDetail details, to be appended to orderRowsToAdd
  // function createOrderDetailRow(OrderId) {
  function createOrderDetailRow(NEWorderdetails) {
    // console.log("NEWorderdetails: ", NEWorderdetails);

    //Creating row string for orderdetail
    const newTr = $('<tr>');
    newTr.data('orderdetail', NEWorderdetails);

    const orderdetailDetails = {
      id: NEWorderdetails.id,
      hurdle: NEWorderdetails.hurdle,
      markets: NEWorderdetails.markets,
      buyers: NEWorderdetails.buyers,
      offerings: NEWorderdetails.offerings,
      productivity: NEWorderdetails.productivity,
      acquisition: NEWorderdetails.acquisition,
      OrderId: NEWorderdetails.OrderId,
      RouteId: NEWorderdetails.RouteId
      // togId: menuvarId,
      // togValue: menuvar
    };

    console.log("orderdetailDetails: ", orderdetailDetails);
    console.log("Check if orderdetailsData already populated: ", orderdetailsData);


    //Building up array of orderdetail detail objects (for this order)
    orderdetailsData.push(orderdetailDetails);
    // console.log("orderdetailsData: ", orderdetailsData);

    if ((orderdetailDetails.OrderId.toString() === OrderId) && (orderdetailDetails.RouteId != RouteIdRef)) {
      // console.log("OrderId found:", OrderId);

      let hurdle_value;
      if (orderdetailDetails.hurdle) {
        hurdle_value = '"' + orderdetailDetails.hurdle + '"'
      } else {
        hurdle_value = '"E.g. Retention"';
      }

      const markets_value = orderdetailDetails.markets;
      // console.log("markets_value: ", markets_value);
      const buyers_value = orderdetailDetails.buyers;
      // console.log("buyers_value: ", buyers_value);
      const offerings_value = orderdetailDetails.offerings;
      // console.log("offerings_value: ", offerings_value);
      const productivity_value = orderdetailDetails.productivity;
      // console.log("productivity_value: ", productivity_value);
      const acquisition_value = orderdetailDetails.acquisition;
      // console.log("acquisition_value: ", acquisition_value);

      const hurdleScript = '<td>' + '<input id="hurdle_' + orderdetailDetails.RouteId + '" placeholder=' + hurdle_value + ' type="text" />' + '</td>'
      newTr.append(hurdleScript);

      // Setting checkboxes to checked or unchecked, depending on results from GET from Orderdetails table
      let marketsScript = "";
      let marketsUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="markets_' + orderdetailDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let marketsChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="markets_' + orderdetailDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (markets_value == "checked") {
        marketsScript = marketsChecked;
      } else {
        marketsScript = marketsUnchecked;
      }
      newTr.append(marketsScript);

      let buyersScript = "";
      let buyersUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="buyers_' + orderdetailDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let buyersChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="buyers_' + orderdetailDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (buyers_value == "checked") {
        buyersScript = buyersChecked;
      } else {
        buyersScript = buyersUnchecked;
      }
      newTr.append(buyersScript);

      let offeringsScript = "";
      let offeringsUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="offerings_' + orderdetailDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let offeringsChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="offerings_' + orderdetailDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (offerings_value == "checked") {
        offeringsScript = offeringsChecked;
      } else {
        offeringsScript = offeringsUnchecked;
      }
      newTr.append(offeringsScript);

      let productivityScript = "";
      let productivityUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="productivity_' + orderdetailDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let productivityChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="productivity_' + orderdetailDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (productivity_value == "checked") {
        productivityScript = productivityChecked;
      } else {
        productivityScript = productivityUnchecked;
      }
      newTr.append(productivityScript);

      let acquisitionScript = "";
      let acquisitionUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="acquisition_' + orderdetailDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let acquisitionChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="acquisition_' + orderdetailDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (acquisition_value == "checked") {
        acquisitionScript = acquisitionChecked;
      } else {
        acquisitionScript = acquisitionUnchecked;
      }
      newTr.append(acquisitionScript);

      console.log("orderdetailDetails: ", orderdetailDetails);
      const repTogId = 'repTog_'+orderdetailDetails.RouteId;
      const demTogId = 'demTog_'+orderdetailDetails.RouteId;
      const engTogId = 'engTog_'+orderdetailDetails.RouteId;
      const enabTogId = 'enabTog_'+orderdetailDetails.RouteId;
      const intTogId = 'intTog_'+orderdetailDetails.RouteId;

      //12/10 Commenting out dropdowm button
      /* <div class="dropdown"> */
      // newTr.append('<td><button class="btn btn-default dropdown-toggle "type="button" id="menu1" data-toggle="dropdown"  data-toggle="collapse">Program Type<span class="caret"></span></button><ul class="dropdown-menu" role="menuitem" aria-labelledby="menu1" data-toggle="collapse"><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + repTogId + '" data-toggle="collapse">Reputation</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + demTogId + '" data-toggle="collapse">Demand</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + engTogId + '" data-toggle="collapse">Engagement</a></li><li role="presentation" class="divider"></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + enabTogId + '" data-toggle="collapse">Enablement</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + intTogId + '" data-toggle="collapse">Intelligence</a></li></ul></td>');
      // newTr.append('<td><button class="btn btn-default dropdown-toggle "type="button" id="menu1" data-toggle="dropdown">Program Type<span class="caret"></span></button><ul class="dropdown-menu" role="menuitem" aria-labelledby="menu1" data-toggle="collapse"><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + repTogId + '" data-toggle="collapse">Reputation</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + demTogId + '" data-toggle="collapse">Demand</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + engTogId + '" data-toggle="collapse">Engagement</a></li><li role="presentation" class="divider"></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + enabTogId + '" data-toggle="collapse">Enablement</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + intTogId + '" data-toggle="collapse">Intelligence</a></li></ul></td>');
      // newTr.append('<td>' + menuvar + "</td>");
      // </div>
      //12/10 End of commenting out

      newTr.append('<td>' + '<input class="progfam-input" id="reputation_' + orderdetailDetails.RouteId + '" placeholder=' + 'Insert reputation action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="demand_' + orderdetailDetails.RouteId + '" placeholder=' + 'Insert demand action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="engagement_' + orderdetailDetails.RouteId + '" placeholder=' + 'Insert engagement action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="enablement_' + orderdetailDetails.RouteId + '" placeholder=' + 'Insert enablement action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="intelligence_' + orderdetailDetails.RouteId + '" placeholder=' + 'Insert intelligence action' + ' type="text" />' + '</td>');

      newTr.append('<td>' + '<button class="btn btn-success update"> Save </button>' + '</td>');
      newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-orderdetail\'>X</a></td>');

      newTr.append('</tr>');
    }

    RouteIdRef = orderdetailDetails.RouteId;
    console.log("RouteIdRef: ", RouteIdRef);

    //UNHIDE IF CHARTS REQUIRED ON ORDER DETAILS PAGE
    // buildChartObject(orderData);

    return newTr;
  };
  // End of createOrderDetailRow



  // This function grabs NEWorderdetails from the database and updates the view
  //10.02 Calling this function from 76 not 49 (so only pulling records with specific OrderId)
  // function getOrderDetailDetails() {
  // function getOrderDetailDetails(orderdetailsData) {
  //   console.log("orderdetailsData: ", orderdetailsData);

  //   for (let i = 0; i < orderdetailsData.length; i++) {

  //     OrderId = orderdetailsData[i].id || '';
  //     console.log("orderdetailsData[i].id: ", orderdetailsData[i].id);
  //     console.log("OrderId: ", OrderId);

  //     if (OrderId) {
  //       OrderId = '/?order_id=' + OrderId;
  //     }
  //     $.get('/api/orderdetails' + OrderId, function (data) {
  //       console.log('OrderDetail data', data);
  //       orderdetails = data;
  //     });
  //   }
  //   console.log("orderdetails: ", orderdetails);
  // };




  // A function for rendering the list of orders to the page
  function renderOrderList(rows) {
    orderList.children().not(':last').remove();
    orderContainer.children('.alert').remove();
    if (rows.length) {
      // orderList.prepend(rows);
      $("#order-table")
        // .find('tbody')
        .find('thead')
        .append(rows);
    } else {
      renderEmpty();
    }
  }

  // A function for rendering the list of orders to the page
  function renderOrderdetailList(rows) {
    orderdetailList.children().not(':last').remove();
    orderdetailContainer.children('.alert').remove();
    if (rows.length) {
      // orderdetailList.prepend(rows);
      $("#orderdetails-table")
        .find('tbody')
        .prepend(rows);
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
  // function renderChart1(chartData) {
  //   var ctx = $('#myBubbleChart1');

  //   var myBubbleChart = new Chart(ctx, {
  //     type: 'bubble',
  //     data: {
  //       "datasets": [{
  //         label: "Order Revenue - This Year",
  //         data: chart1Data,
  //         backgroundColor:
  //           'red'
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Size ($)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           }
  //         }],
  //         yAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Count (#)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           },
  //         }],
  //       }
  //     }
  //   });

  //   ctx.prepend(myBubbleChart);
  // }

  // // This creates the display object for the Revenue Bubble Chart(s)
  // function renderChart2(chartData) {
  //   var ctx = $('#myBubbleChart2');

  //   var myBubbleChart = new Chart(ctx, {
  //     type: 'bubble',
  //     data: {
  //       "datasets": [{
  //         label: "Next Year Order Revenue Plan",
  //         data: chart2Data,
  //         backgroundColor:
  //           'green'
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Size ($)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           }
  //         }],
  //         yAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Count (#)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           }
  //         }],
  //       }
  //     }
  //   });

  //   ctx.prepend(myBubbleChart);
  // }


  // Function for handling what to render when there are no orders
  function renderEmpty() {
    const alertDiv = $('<div>');
    alertDiv.addClass('alert alert-danger');
    alertDiv.text('You must create a Order before you can create a OrderDetail.');
    orderContainer.append(alertDiv);
  }

});