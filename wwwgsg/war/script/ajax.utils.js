var HOME = 'home';
var ENTITY_CUSTOMER = 'customer';
var ENTITY_BRAND = 'brand';
var ENTITY_ITEM = 'item';
var ENTITY_ORDER = 'order';
var ENTITY_PL = 'pl';
var ENTITY_ACCOUNT = 'account'
var ENTITY_STOCK = 'stock'
var ENTITY_BILLING = 'billing'
var ENTITY_EXPENSE = 'expense'
var ENTITY_PAYMENTS = 'payments'
var ENTITY_RETURNS = 'returns'
var ENTITY_ANNUAL_RETURNS = 'annual-returns'

// function to initialize the page
var init = function(entity) {
	$('#__sort__listing').change(function() {
		showlist($("#category").val());
	});
	$('#utr,#label_utr').hide();
	$('#copyadd').change(function() {
		if ($("#copyadd").is(':checked')) {
			var formEleList = $('input[name*=_bill]').serializeArray();
			for (var i = 0; i < formEleList.length; i++) {
				var newFiled = formEleList[i].name.replace('_bill', '');
				var vl = $('#' + newFiled).val();
				$('#' + formEleList[i].name).val(vl);
			}
		}
	});

	$('#email_match').bind("cut copy paste",function(e) {
         e.preventDefault();
     });
	$('#email_match').bind("contextmenu", function(e) {
		e.preventDefault();
	});

	// loadHome();
	$('#cust_name,#pincode, #address,#landmark,#city,#state').change(
			function() {
				if ($("#copyadd").is(':checked')) {
					var newFiled = $(this).attr('name') + '_bill';
					var vl = $(this).val();
					$('#' + newFiled).val(vl);
				}
			});
	$('#item_quantity').change(function() {
		var item_price = parseInt($('#item_price').val());
		var item_quantity = parseInt($(this).val());
		var item_line_tot = item_price * item_quantity;
		var item_vat = item_line_tot * .135;
		var item_grand_tot = item_line_tot + item_vat;

		$('#item_sub_tot').val(item_line_tot.toFixed(2));
		$('#item_line_tot').val(item_line_tot.toFixed(2));
		$('#item_vat').val(item_vat.toFixed(2));
		$('#item_grand_tot').val(item_grand_tot.toFixed(2));

		$('#label_item_sub_tot').html(item_line_tot.toFixed(2));
		$('#label_item_line_tot').html(item_line_tot.toFixed(2));
		$('#label_item_vat').html(item_vat.toFixed(2));
		$('#label_item_grand_tot').html(item_grand_tot.toFixed(2));

	});
	$('#pay_method')
			.change(
					function() {
						var tipe = $(this).val();
						if (tipe == 'Draft On Delivery') {
							$('#scan,#label_scan,#pay_method_msg').show();
							$('#utr,#label_utr,#pay_method_msgu').hide();
							$('#pay_method_msg')
									.html(
											'DD in favor of VIKRAMSHILA AGENCY payable at BHAGALPUR. Once consignment arrives, please handover the draft to the delivery person. At the time of order, please upload scanned copy of draft');
						}
						if (tipe == 'Account Deposit') {
							$('#scan,#label_scan,#pay_method_msg').show();
							$('#utr,#label_utr,#pay_method_msgu').hide();
							$('#pay_method_msg')
									.html(
											'Deposit to A/C number: 841400301000327  A/C Name: VIKRAMSHILA AGENCY Bank: VIJAYA BANK  Branch: BHAGALPUR.');

						}
						if (tipe == 'NEFT') {
							$('#pay_method_msgu')
									.html(
											'RTGS/NEFT to A/C number: 841400301000327, IFS Code: VIJB0008414, A/C name: VIKRAMSHILA AGENCY');
							$('#utr,#label_utr,#pay_method_msgu').show();
							$('#scan,#label_scan,#pay_method_msg').hide();
						}

					});

	$('#order-form').validate({
		onkeyup : true,
		rules : {
			email : {
				required : true,
				email : true
			},
			email_match : {
				equalTo : '#email'
			},
			phone : {
				required : true,
				digits : true
			},
			cust_name : {
				required : true
			},
			pincode : {
				required : true,
				digits : true,
				minlength : 6
			},
			address : {
				required : true
			},
			city : {
				required : true
			},
			cust_name_bill : {
				required : true
			},
			pincode_bill : {
				required : true,
				digits : true,
				minlength : 6
			},
			address_bill : {
				required : true
			},
			city_bill : {
				required : true
			},
			pay_method : {
				URNCheck : true
			}
		}
	});

	$.validator
			.addMethod(
					"URNCheck",
					function(value, element) {
						var response = true;
						if ($('#pay_method').val() == 'NEFT') {
							if ($('#utr').val() == '') {
								response = false;
							}
						}
						if (($('#pay_method').val() == 'Draft On Delivery')
								|| ($('#pay_method').val() == 'Account Deposit')) {
							if ($('#scan').val() == '') {
								response = false;
							}
						}
						return response;
					},
					"Please enter Unique Reference Number (UTR) of the NEFT/RTGS transfer Or scanned copy of DD / transfer reciept");

}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var showlist = function(category) {
	$("html, body").animate({
		scrollTop : 0
	}, "slow");
	$('#listing-items').html(
			' <div id="ajax_loader"><img src="images/ajax-loader.gif">	</div>');
	var successFn = function(resp) {
		var col = 4;
		var currow = 1;
		var curcol = 1;
		var htm = "";
		if (resp) {
			data = resp.data;
		}
		var items = data.length;

		for (var item = 0; item < items; item++) {
			var imageURL = data[item].__image__listing_thumbnail;
			var price = data[item].__number__price;
			var nme = data[item].name;
			var brand = data[item].__text__brand;
			var model = data[item].__text__model;

			var feature1 = data[item].__number__rating + '';
			var feature2 = data[item].__text__fuel + '';
			var feature3 = data[item].__text__startingSystem + '';
			var feature4 = data[item].__text__listingFeature + '';
			var feature5 = data[item].__text__listing_line5 + '';

			if (curcol > 4) {
				curcol = 1;
				currow++;
				htm = htm + '</div><div class="listing-w-row ">';
			}
			htm = htm
					+ '<div class="w-col w-col-3 listing-p1box">			<div class="summ">				<a class="greylink"					href="details.jsp?id='
					+ nme
					+ '"><img	height="150" width="150" src="'
					+ imageURL
					+ '"					alt="52ee9da9db9a854a4e0004b9_call.png"> <br />					<div class="listing-item-title">'
					+ brand
					+ '  &nbsp;'
					+ model
					+ ' </div> </a>				 <div class="listing-item-price">'
					+ 'Rs '
					+ price
					+ '</div>				<div class="listing-item-details-point"></div>';
			if ((feature1 != 'undefined') && (feature1 != 'null')) {
				htm = htm + '<div class="listing-item-details-point"> '
						+ feature1 + ' VA';
			}
			if ((feature2 != 'undefined') && (feature2 != 'null')) {
				htm = htm
						+ '</div>				<div class="listing-item-details-point">'
						+ feature2 + ' operated';
			}
			if ((feature3 != 'undefined') && (feature3 != 'null')) {
				htm = htm
						+ '</div>				<div class="listing-item-details-point">'
						+ feature3;
			}
			if ((feature4 != 'undefined') && (feature4 != 'null')) {
				htm = htm
						+ '</div>				<div class="listing-item-details-point"> '
						+ feature4;
			}
			if ((feature5 != 'undefined') && (feature5 != 'null')) {
				htm = htm
						+ '</div>				<div class="listing-item-details-point">'
						+ feature5;
			}
			htm = htm + '</div>			</div>				</div> ';
			curcol++;
		}
		htm = htm.replace('undefined', '');
		$('#listing-items').html(htm);
		$('#listing-items').remove('#ajax_loader');
		$('#ajax_loader').hide();
	};
	var errorFn = function(resp) {
		$('#listing-items').remove('#ajax_loader');

	};
	getData('/products?command=productlist&category=' + category, '',
			successFn, errorFn);
}

var showListMenu = function() {
	var successFn = function(resp) {
		var col = 4;
		var currow = 1;
		var curcol = 1;
		var dressedOption = "";
		var printed = "";
		var category = $("#category").val();
		if (resp) {
			data = resp.data;
		}
		var items = data.length;
		var htm = "";

		for (var item = 0; item < items; item++) {
			var sub = data[item];
			for ( var key in sub) {
				if ((key != 'name')) {
					htm += '<div class="linktext">' + key.toUpperCase()
							+ '</div><ul id="price_range">';
					var options = (sub[key]).split(",");
					for (var option = 0; option < options.length; option++) {
						dressedOption = ((options[option]).replace(' ', ''))
						if (dressedOption != '') {
							if (printed.indexOf(dressedOption) < 1) {
								htm += '<li><a> <input type="checkbox" value="'
										+ options[option]
										+ '" name="__filter__' + key
										+ '"  onclick="showlist(' + category
										+ ')"> <span>' + options[option]
										+ '</a></li>';
								printed = printed + '|' + dressedOption;
							}
						}
					}
					htm = htm + '</ul><br />';
				}
			}
		}
		$('#listing-menu').html(htm);
	};
	var errorFn = function(resp) {
		// alert('error');
	};
	getData('/products?command=menulist&category=Portable Generator', '',
			successFn, errorFn);
}

var getData = function(url, filterData, successFn, errorFn) {
	// making the ajax call
	var data = new Array();

	var formEleList = $('select,input[name*=__filter__]').serializeArray();
	// var formEleList = $('form#' + entity + '-create-form').serializeArray();
	for (var i = 0; i < formEleList.length; i++) {
		data[data.length] = new param(formEleList[i].name, formEleList[i].value);
	}
	// setting action as PUT
	if ((typeof action === "undefined") || ((action == ''))) {
		action = 'PUT';

	}
	data[data.length] = new param('action', action);

	$.ajax({
		url : url,
		type : "GET",
		data : data,
		success : function(resp) {
			// calling the user defined success function
			if (successFn)

				successFn(resp);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
