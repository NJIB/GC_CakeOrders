$(document).ready(function () {

  // Getting references to the name input and report container, as well as the table body
  const firstnameInput = $('#order-firstname');
  const lastnameInput = $('#order-lastname');
  const orderdateInput = $('#order-delivery_date');
  const ordertimeInput = $('#order-delivery_pickup_time');
  const orderdeliverypickupInput = $('#order-delivery_pickup');

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

  let order_id;

  let orderGetData = {};
  let customerGetData = {};


  // Adding event listeners to the form to create a new object, and the button to delete
  // an report

  $(document).on('click', '.goHome', goHome);
  $(document).on('click', '.order-update', handleUpdateClick);

  getOrderDetail();

  function getOrderDetail() {
    const pageURL = window.location.href;
    console.log("pageURL: ", pageURL);

    const eqIndex = pageURL.indexOf("=") + 1;
    console.log("eqIndex: ", eqIndex);

    const urlLength = pageURL.length;
    console.log("urlLength: ", urlLength);

    order_id = (pageURL.substring(eqIndex, urlLength) / 1);
    console.log("order_id: ", order_id);

    $.get('/api/orderdetail/' + order_id, function (data) {
      console.log("data: ", data);

      orderGetData = data;
      console.log("orderGetData: ", orderGetData);

      console.log("data.customer_id:", data.customer_id);

      $.get('/api/customerdetail/' + data.customer_id, function (data) {
        console.log("data: ", data);

        customerGetData = data;
        console.log("customerGetData: ", customerGetData);

      const customername = [customerGetData.first_name, customerGetData.last_name];
      const customername_concat = customername.join(" ");
      console.log("customername_concat:", customername_concat);

      $('#order-customername').text(customername_concat);
      $('#order-customer_address').text(customerGetData.address);
      $('#order-customer_city').text(customerGetData.city);
      $('#order-customer_zip').text(customerGetData.zip);
      $('#order-customer_phone').text(customerGetData.phone);
      $('#order-customer_notes').text(customerGetData.customer_notes);
      
      $('#order-delivery_date').val(moment(orderGetData.order_date).format('YYYY-MM-DD'));
      $('#order-delivery_pickup_time').val(moment(orderGetData.order_date).format('HH:mm:ss'));
      $('#order-delivery_pickup').val(orderGetData.delivery_pickup);
      $('#order-cake_theme').val(orderGetData.cake_theme);
      $('#order-cake_description').val(orderGetData.cake_description);
      $('#order-cake_special').val(orderGetData.cake_special);
      $('#order-cake_name').val(orderGetData.cake_name);
      $('#order-cake_boygirl').val(orderGetData.cake_boygirl);
      $('#order-cake_servings').val(orderGetData.cake_servings);
      $('#order-cake_layers').val(orderGetData.cake_layers);
      $('#order-cake_age').val(orderGetData.cake_age);
      $('#order-cake_size1').val(orderGetData.cake_size1);
      $('#order-cake_shape1').val(orderGetData.cake_shape1);
      $('#order-cake_flavor1').val(orderGetData.cake_flavor1);
      $('#order-cake_filling1').val(orderGetData.cake_filling1);
      $('#order-cake_notes1').val(orderGetData.cake_notes1);
      $('#order-cake_size2').val(orderGetData.cake_size2);
      $('#order-cake_shape2').val(orderGetData.cake_shape2);
      $('#order-cake_flavor2').val(orderGetData.cake_flavor2);
      $('#order-cake_filling2').val(orderGetData.cake_filling2);
      $('#order-cake_notes2').val(orderGetData.cake_notes2);
      $('#order-cake_size3').val(orderGetData.cake_size3);
      $('#order-cake_shape3').val(orderGetData.cake_shape3);
      $('#order-cake_flavor3').val(orderGetData.cake_flavor3);
      $('#order-cake_filling3').val(orderGetData.cake_filling3);
      $('#order-cake_notes3').val(orderGetData.cake_notes3);
      $('#order-cake_price').val(orderGetData.cake_price);

      // renderDateDetails(getResults.create_date, getResults.update_date);
      });

    });
  }

  function handleUpdateClick(event) {
    event.preventDefault();

    // console.log("UPDATING ASSET DATA!")

    // if (!assetName) {
    //   return;
    // }

    // if (!assetURL) {
    //   return;
    // }

    const orderData = {
      id: orderGetData.id,
      customer_id: orderGetData.customer_id,
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

    updateOrder(orderData);
  }

  // A function for updating a link's details.
  function updateOrder(orderData) {
    $.ajax({
      method: 'PUT',
      url: '/api/orders',
      data: orderData,
    })
      .then(renderUpdateConf);
    // .then(function () {
    //   $.get('/main', function () {});
    // });
  };

  function renderUpdateConf() {
    const updateConf = $('<div>');
    updateConf.addClass('alert alert-success');
    updateConf.addClass('update-conf-msg');
    updateConf.addClass('update-conf-column');
    updateConf.text('Order details updated.');
    updateConf.append('<div><a class="btn btn-success update-conf-dismiss" type="button" href="/main"> Dismiss </a></div>');
    $('.card-body').append(updateConf);
  }


  // A function for updating a link's details.
  function goHome() {
    console.log("TRYING TO GO HOME!")
    // $.get('/', function () {});
    $.ajax({
      method: 'GET',
      url: '/',
    })
  };

});
