$(document).ready(function () {

  // Getting references to the name input and report container, as well as the table body
  // const reportDate = $('#report-date');
  let prioritySelected = ('#LinkPrioritySelect');
  let assetTypeSelected = ('#LinkAssetTypeSelect');
  let assetName = $('#link-asset-name-input');
  let assetURL = $('#link-asset-url-input');

  let order_id;

  let orderGetData = {};
  let customerGetData = {};


  // Adding event listeners to the form to create a new object, and the button to delete
  // an report

  $(document).on('click', '#UpdateLink', handleUpdateClick);
  $(document).on('click', '#headertitle', goHome);

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
      $('#order-delivery_pickup').text(orderGetData.delivery_pickup);
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

    var selectedPriority = $("#LinkPrioritySelect").find("option:selected").text();
    var selectedAssetType = $("#LinkAssetTypeSelect").find("option:selected").text();
    // console.log(selectedPriority);
    // console.log(selectedAssetType);

    // if (!assetName.val().trim()) {
    if (!assetName) {
      return;
    }

    // if (!assetURL.val().trim()) {
    if (!assetURL) {
      return;
    }

    // console.log("assetName: ", assetName.val());
    // console.log("assetURL: ", assetURL.val());

    linkData = {
      id: assetId,
      priority: selectedPriority,
      priority_code: selectedPriority.replace(/\s+/g, ''),
      asset_type: selectedAssetType,
      asset_name: assetName
        .val()
        .trim(),
      asset_url: assetURL
        .val()
    };

    // console.log("linkData object: ", linkData)

    updateAsset(linkData);
  }

  // A function for updating a link's details.
  function updateAsset(linkData) {
    $.ajax({
      method: 'PUT',
      url: '/api/linkDetail',
      data: linkData,
    })
      .then(renderUpdateConf);
    // .then(function () {
    //   $.get('/main', function () {});
    // });
  };

  function renderDateDetails(linkCreate, linkUpdate) {
    $('#link-create-date').append(linkCreate);
    $('#link-update-date').append(linkUpdate);
  }

  function renderUpdateConf() {
    const updateConf = $('<div>');
    updateConf.addClass('alert alert-success');
    updateConf.addClass('update-conf-msg');
    updateConf.addClass('update-conf-column');
    updateConf.text('Document details updated.');
    // updateConf.append('</div>');

    // console.log("updateConf: ", updateConf);
    updateConf.append('<div><a class="btn btn-success update-conf-dismiss" type="button" href="/main"> Dismiss </a></div>');
    $('.card-body').append(updateConf);
  }


  // A function for updating a link's details.
  function goHome() {
    console.log("TRYING TO GO HOME!")
    // $.get('/main', function () {});
    $.ajax({
      method: 'GET',
      url: '/main',
    })
  };

});
