$(document).ready(function () {
  // Getting references to the name input and order container, as well as the table body
  const firstnameInput = $('#order-firstname');
  const dealsizeInput = $('#order-lastname');
  const orderdateInput = $('#order-order_date');

  const orderList = $('tbody');
  const orderTotals = $('tfooter');
  const orderContainer = $('.order-container');
  let orderRevTotal = 0;

  // const chart1Area = $('#myBubbleChart1');
  // const chart2Area = $('#myBubbleChart2');
  // var ctx = $('#myBubbleChart');
  let chart1Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Order
  $(document).on('submit', '#order-form', handleOrderFormSubmit);
  $(document).on('click', '.delete-order', handleDeleteButtonPress);
  $(document).on('click', '.update', handleUpdateButtonPress);

  // Getting the initial list of Orders
  getOrderDetail();

  function getOrderDetail() {
    const pageURL = window.location.href;
    console.log("pageURL: ", pageURL);

    const eqIndex = pageURL.indexOf("=") + 1;
    console.log("eqIndex: ", eqIndex);

    const urlLength = pageURL.length;
    console.log("urlLength: ", urlLength);

    assetId = (pageURL.substring(eqIndex, urlLength) / 1);
    console.log("id: ", assetId);

    $.get('/api/orderdetail/' + assetId, function (data) {
      console.log("data: ", data);
      // getResults.priority = data.priority.trim();
      // getResults.priority = getResults.priority.replace(/\s\s+/g, ' ');
      // getResults.priority = data.priority.replace(/\n/g, '');
      // getResults.priority_code = data.priority_code;
      // getResults.asset_type = data.asset_type.replace(/\n/g, '');
      // getResults.asset_type = getResults.asset_type.replace(/\s\s+/g, ' ');
      // getResults.asset_name = data.asset_name;
      // getResults.asset_url = data.asset_url;
      // getResults.create_date = moment(data.createdAt).format('MMMM Do YYYY, h:mma');;
      // getResults.update_date = moment(data.updatedAt).format('MMMM Do YYYY, h:mma');;

      // $('#LinkPrioritySelect').val(getResults.priority);
      // $('#LinkAssetTypeSelect').val(getResults.asset_type);
      // $('#link-asset-name-input').val(getResults.asset_name);
      // $('#link-asset-url-input').val(getResults.asset_url);
      // renderOrderDetails(getResults.create_date, getResults.update_date);
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

    // renderChart1(chart1Data);

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
