$(document).ready(function () {

  // Getting references to the name input and report container, as well as the table body
  // const reportDate = $('#report-date');
  let prioritySelected = ('#LinkPrioritySelect');
  let assetTypeSelected = ('#LinkAssetTypeSelect');
  let assetName = $('#link-asset-name-input');
  let assetURL = $('#link-asset-url-input');

  let order_id;

  let getResults = {
    assetId: '',
    priority: '',
    priority_code: '',
    asset_type: '',
    asset_name: '',
    asset_url: '',
    create_date: '',
    update_date: '',
  };

  let linkData = {
    id: '',
    priority: '',
    priority_code: '',
    asset_type: '',
    asset_name: '',
    asset_url: '',
  };


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

      // console.log(" getResults.asset_type: ", getResults.asset_type);
      // console.log(" getResults.asset_type.length: ", getResults.asset_type.length);

      // $('#LinkPrioritySelect').val(getResults.priority);
      // $('#LinkAssetTypeSelect').val(getResults.asset_type);
      // $('#link-asset-name-input').val(getResults.asset_name);
      // $('#link-asset-url-input').val(getResults.asset_url);
      // renderDateDetails(getResults.create_date, getResults.update_date);
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
