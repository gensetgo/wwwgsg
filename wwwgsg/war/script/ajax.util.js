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
		// showListMenu();
		showlist($("#category").val());
	});

//	loadHome();
	$("#payments-create-form").validate({
		rules : {
			payments_amount : {
				customvalidation : true
			},
			payments_item_total : {
				number : true
			}
		}
	});

	$.validator.addMethod("customvalidation", function(value, element) {
		// $(element).error;
		return /^[0]+$/.test(value);
	}, "Should be Zero");

	$("#home").click(function() {
		loadHome();
	})
	$(function() {
		$(".column").sortable({
			connectWith : ".column"
		});
		$(".portlet").addClass(
				"ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
				.find(".portlet-header").addClass(
						"ui-widget-header ui-corner-all").prepend(
						"<span class='ui-icon ui-icon-minusthick'></span>")
				.end().find(".portlet-content");
		$(".portlet-header .ui-icon").click(
				function() {
					$(this).toggleClass("ui-icon-minusthick").toggleClass(
							"ui-icon-plusthick");
					$(this).parents(".portlet:first").find(".portlet-content")
							.toggle();
				});
	});

	$(this).ajaxStart(function() {
	//	$('#tbl_products_item').html(' <div id="ajax_loader"><img src="images/ajax-loader.gif">	</div>');
	});

	$(this).ajaxStop(function() {
		$('#ajax_loader1').hide();
	});
	$(this).ajaxComplete(function() {
		$('#ajax_loader1').hide();
	});

	$(this).ajaxComplete(function() {
		$('#ajax_loader1').hide();
	});

	$('#annual_returns_year').change(
			function() {
				fillItemM1('annual-returns', $(this).val(), 'new',
						'returns_sale_item', 'tbl_sale_annual_returns_item');
				fillItemM1('annual-returns', $(this).val(), 'new',
						'returns_pur_item', 'tbl_pur_annual_returns_item');
				fillItemM1('annual-returns', $(this).val(), 'new',
						'returns_pur_inv_item',
						'tbl_pur_inv_annual_returns_item');
				fillItemM1('annual-returns', $(this).val(), 'new',
						'returns_payment_item',
						'tbl_annual_returns_payments_item'); // data
				// fillItemM1('annual-returns', $(this).val(), 'new',
				// 'returns_summary', 'tbl_annual_returns_summary'); // data
				fillItem('annual-returns', $(this).val(), 'returns_summary',
						'tbl_annual_returns_summary');
				$('#annual_returns_status').val('new');
				denableOnStatus(entity);

			});

	// renmove the lines below
	$('#payments_amount').change(function() {
		var paid = parseInt($("#payments_amount").val());
		var bal = parseInt($("#payments_balance").val());
		var needed = parseInt($('#payments_due').val());
		var diff = paid + bal - needed
		$("#payments_diff").val(paid + bal - needed);
	});
	$('#company').change(function() {
		regenerateBalance($(this).val());
		// var par = $("#payments_type").val(); // why??
		// filterOutitems($(this).val());
	});
	$('#supSurCharge').change(
			function() {
				calculateStockTotal();
				$('#orderValue').val(
						parseInt($('#stock_total').val())
								+ parseInt($(this).val()));
			});

	$('#payments_to_account').change(function() {
		filterOutitems($(this).val());
	});

	$('#pay_amount').change(function() {
		calPayTot();
	});

	// $('#products_attribute_type').val('Text');
	// $('#products_attribute_file_value').hide();

	$('#products_attribute_type').change(function() {
		var par = $(this).val();
		if (par == "Text") {
			$('#products_attribute_value').show();
			$('#products_attribute_file_value').hide();

		} else {
			$('#products_attribute_file_value').show();
			$('#products_attribute_value').hide();

		}

	});

	$('#products_category_new, #products_item_new').hide();

	$('#products_category_new').change(function() {
		var par = $(this).val();
		if (par == "") {
			$('#products_category').show();
			$(this).hide();
			$('#products_item').val('');
			$('#products_item').change();

		}

	});
	$('#products_item_new').change(function() {
		var par = $(this).val();
		if (par == "") {
			$('#products_item').show();
			$(this).hide();
		}

	});

	$('#products_item').change(function() {

		// fillM
		// resetall('payments');
		var par = $(this).val();
		if (par == "New") {
			$('#products_item_new').show();
			$(this).hide();
		} else {
			$('#products_item').show();
			$('#products_item_new').hide();
			// $('.' + displayItem + '_cloned').remove();
			// $('.' + displayTable + '_cloned').remove();
			// $('#trow:gt(0)').empty();

			resetAll('products');
			editM('products', par);
			$('#category_status').val("");

		}

	});
	$('#products_category').change(
			function() {

				// fillM
				// resetall('payments');
				var par = $(this).val();
				if (par == "New") {
					$('#products_category_new').show();
					$(this).hide();
					$('#products_item').val('New');
					$('#products_item').change();
				} else {
					populateSelectBox('products_item',
							'products?command=edit_new&code=product_items&category='
									+ par);

				}

			});

	$('#payments_item_tot,#payments_due,#payments_round').change(
			function calcPayDif() {
				calPayDiff();
			});

	$('.menuItem a').click(function(event) {
		$('a').removeClass('selected');
		$(this).addClass('selected');
		showDisplayArea(event.currentTarget.id);
	});

	addNeededAutoComplete($('#oppor_cust_name'), 'oppor');
	addNeededAutoComplete($('#billing_cust_name'), 'oppor');

	$(
			"#pay_date, #oppor_date, #work_deadline, #work_start_date, #sale_date,#returns_date,	#recieve_date,#expense_date, #dateOfOrder, #expectedDateOfDelivery, #actualDespatchDate, #arrivalDate, #billing_date,#payments_date")
			.datepicker({
				dateFormat : 'yy-mm-dd'
			});

	$(
			"#billingTable,#expenseTable,#accountTable,#paymentsTable,#stockTable,#plTable,#brandTable,#orderTable")
			.tablesorter({
				sortList : [ [ 0, 1 ] ]
			});

	// type --> what type of upload this is ..suvidha, logo, template
	// valueElement --> primary key for this element
	$("#Upload").click(
			function(type, valueElement) {
				var value = $('#' + valueElement).val();
				var dest = "test.jsp?type=" + type + "&id="
						+ $('#' + valueElement)
				$(
						'<iframe id="upload-dialog-form" class="ui-dialog" src='
								+ dest + ' />').dialog(
						{
							title : 'Upload Attachment',
							autoOpen : true,
							width : 300,
							height : 200,
							modal : true,
							resizable : true,
							buttons : {
								OK : function() {
									$(this).dialog("close");
								}
							},
							close : function() {
								fillItem('order', $("#tblOrderId").val(),
										'order', 'tblTransit');
							}
						}).width(300 - 25);
			});

	// one day this function will go. will be replaced by more generic function
	// written above
	$("#UploadSuv").click(
			function() {
				var dest = "test.jsp?orderId=" + $("#tblOrderId").val();
				$(
						'<iframe id="upload-dialog-form" class="ui-dialog" src='
								+ dest + ' />').dialog(
						{
							title : 'Suvidha',
							autoOpen : true,
							width : 300,
							height : 200,
							modal : true,
							resizable : true,
							buttons : {
								OK : function() {
									$(this).dialog("close");
								}
							},
							close : function() {
								fillItem('order', $("#tblOrderId").val(),
										'order', 'tblTransit');
							}
						}).width(300 - 25);
			});

	$("#stockInstantSearch").autocomplete(
			{
				width : 1900,
				height : 10,
				delay : 250,
				minLength : 1,
				autoFocus : true,
				cacheLength : 1,
				scroll : true,
				highlight : true,
				focus : function(event, ui) {
					// cal.css({left: left + 'px', top: top + 'px'});
					wid = parseInt($('#stock-create-ctr').outerWidth());

					$('#stock-create-ctr').css({
						position : 'absolute',
						left : wid - 150,
						top : 80
					}).animate({
						top : 80,
						left : wid - 150
					});
					$('#stock-create-ctr').show();
					regenerateSearchedStockDetails(ui.item.value);
				},
				select : function(event, ui) {
					$('#stock-create-ctr').animate({
						top : 80,
						left : 0
					});

					$("#stock-search-ctr").show();
					edit('stock', $('#stock-create-form').find(
							'input[name=stock_code]').val());
				},
				source : function(request, response) {
					$.ajax({
						url : "stock?command=suggest",
						dataType : "json",
						data : request,
						success : function(data, textStatus, jqXHR) {
							var items = data;
							response(items);
						},
						error : function(jqXHR, textStatus, errorThrown) {
						}
					});
				}

			});
	// showing the home tab on initializing
	showTab(HOME);
	// adding event listeners to the tabs
	$('#tabs a').click(function(event) {
		showTab(event.currentTarget.id);
	});

	// ADD ROWS DYNAMICALLY WITH UNIQUE IDS
	var i = 1;
	addChangeListener('');
	makeAutoComplete("type1", "pl", '');
	// makeAutoComplete("pur_des", "purchasedetails", ''); // to be changed
	makeAutoComplete("billing_item_des", "stock", '');

	// $('#add').click(dupWithId());
	$('#add').click(function() {
		$('#tbl tr:last').clone().find('input').each(function() {
			$(this).attr({
				'id' : function(_, id) {
					return id + i
				},
				'name' : function(_, name) {
					return name + i
				},
				'value' : ''
			});
		}).end().appendTo('#tbl');
		addChangeListener(i);
		makeAutoComplete("type1", "pl", i);
		// makeAutoComplete("billing_item_des", "pl", i);

		$('#item_roz').val(i);
		i++;
	});
	var j = 1;

	$('#item_add').click(function() {
		$('#tblItem tr:last').clone().find('input').each(function() {
			$(this).attr({
				'id' : function(_, id) {
					return id + j
				},
				'name' : function(_, name) {
					return name + j
				},
				'value' : ''
			});
		}).end().appendTo('#tblItem');
		addChangeListener(j);
		makeAutoComplete("type1", "pl", j);
		makeAutoComplete("billing_item_des", "stock", j);
		$('#item_roz').val(j);
		j++;
	});

	var g = 1;

	$('#item_pay_add').click(function() {
		addNewRow('tbl_pay_item', 'payments', '', '');
	});
	$('#item_products_add').click(
			function() {
				// addNewRow('tbl_products_item', 'products', '', '');
				$('#category_status').val("new");
				fillItemM('products', $('#products_item').val(), 'onenewrow',
						'tbl_products_item');

			});

	$('#oppor_item_add').click(
			function() {
				fillItemMG('oppor', $('#oppor_code').val(), 'oppor_item_new',
						'tbl_oppor_item');
			});
	$('#billing_item_add').click(
			function() {
				fillItemMG('billing', $('#billing_code').val(),
						'billing_item_new', 'tbl_billing_item');
			});

	// k strarts from zero ....roz starts from 1
	$('#item_pur_add')
			.click(
					function() {
						var k = parseInt('0' + $('#item_pur_roz').val());
						$('#tblPurInvoice tr')
								.eq(1)
								.clone()
								.find('input')
								.each(
										function() {
											$(this).attr({
												'id' : function(_, id) {
													return id + k
												},
												'name' : function(_, name) {
													return name + k
												},
												'value' : ''
											});
											$(this).addClass('clone');
											if ($(this).attr("id").indexOf(
													'pur_des') >= 0) {
												addNeededAutoComplete($(this),
														"purchasedetails");
											}
											if (($(this).attr("id").indexOf(
													'pur_rate') >= 0)
													|| ($(this)
															.attr("id")
															.indexOf('pur_unit') >= 0)) {
												addNeededChangeListener($(this));
											}
											if ($(this).attr("id") == 'pur_bill_date'
													+ k) {
												$(this).removeClass(
														'hasDatepicker');
												$(this).datepicker({
													dateFormat : 'yy-mm-dd'
												});
											}
										}).end().appendTo('#tblPurInvoice');
						$('#item_pur_roz').val(k + 1);
					});

	$('#item_pur_save').click(
			function() {
				var parameter = new Array();
				$('#tblPurInvoice').find('input').each(
						function() {
							parameter[parameter.length] = new param($(this)
									.attr('name'), $(this).val());
						});
				parameter[parameter.length] = new param("company",
						$("#company").val());
				parameter[parameter.length] = new param("tblOrderId", $(
						"#tblOrderId").val());
				parameter[parameter.length] = new param("command",
						"savePurInvDetails");
				parameter[parameter.length] = new param("item_pur_roz", $(
						"#item_pur_roz").val());
				parameter[parameter.length] = new param("suvidha_num", $(
						"#suvidha_num").val());
				parameter[parameter.length] = new param("pur_gto",
						$("#pur_gto").val());

				$.ajax({
					url : "/" + 'purchasedetails',
					type : "POST",
					data : parameter,
					success : function(resp) {
					}
				});
			});

	$('#stock_add').click(function() {
		var stockRz = parseInt($('#stock_roz').val());
		if (isNaN(parseInt($('#stock_roz').val()))) {
			stockRz = 1;
			$('#stock_roz').val('1');
		}
		$('#stock_tbl tr:last').clone().find('input').each(function() {
			$(this).attr({
				'id' : function(_, id) {
					return id
				},
				'name' : function(_, name) {
					return name + stockRz
				},
				'value' : ''
			});
		}).end().appendTo('#stock_tbl').find('td').each(function() {
			$(this).attr({
				'class' : 'stock_cloned'
			})
		});
		addChangeListener(stockRz);
		makeAutoComplete("type1", "pl", stockRz);
		stockRz++;
		$('#stock_roz').val(stockRz);
	});

	makeAutoComplete("type1", "pl");
	makeAutoComplete("billing_item_des", "pl", j);
	// this needs to eb removed
	$('#quantity1').change(
			function recalculate() {
				var d = $('this');
				var a = parseInt($('#tbl tr:last td:eq(2) input').val())
						* parseInt($('#tbl tr:last td:eq(3) input').val());
				var a = parseInt($('#price1').val())
						* parseInt($('#quantity').val());
				$('#tbl tr:last td:eq(4) input').val(a);
			});

	$('#add1').click(function() {
		AddRow({});
		makeAutoComplete("type1", "pl");
	});
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var showlist = function(category) {
	$("html, body").animate({ scrollTop: 0 }, "slow");
	$('#listing-items').html(' <div id="ajax_loader"><img src="images/ajax-loader.gif">	</div>');
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
					+ '"><img	height="150" width="150" src="'					+ imageURL
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
	getData('/products?command=productlist&category='+category, '', successFn,
			errorFn);
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
										+ '"  onclick="showlist('+category+')"> <span>'
										+ options[option] + '</a></li>';
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
		//alert('error');
	};
	getData('/products?command=menulist&category=Portable Generator', '', successFn,
			errorFn);
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

var loadHome = function() {
	$("#home-tab").show();
	var parame = new Array();
	parame[parame.length] = new param('command', 'db_pending_sale_payments');
	// polulate porlets - pending sale payments
	populateDB('stock', parame, 'db_pending_sale_payments', 'home_pending_sale');
	populateDB('expense', parame, 'db_pending_expense_payments',
			'home_pending_expense');
	populateDB('order', parame, 'db_pending_order_payments',
			'home_pending_order');
	populateDB('stock', parame, 'db_order_placed_stock',
			'db_order_placed_stock');
	populateDB('stock', parame, 'db_sold_stock', 'db_sold_stock');
	populateDB('work', parame, 'db_in_progress_work', 'db_in_progress_work');
	populateDB('customer', parame, 'db_active_comm', 'db_active_comm');

	// $("#home_pending_sale").innerHTML("dekho dekho");
}

var m = 1;

// $('#payment_item_add').click(addNewRow('tbl_payments_item','payments','',''))
// generic function to add a new row
var addNewRow = function(tableName, entity, auto_element, auto_entity) {
	var cloned_element = '#' + tableName + ' tr:last';
	var roz = '#' + entity + '_roz';
	var roz1 = '#' + tableName + '_roz';
	m = $(roz1).val();
	m++;
	// $('#tbl_bill tr:last').clone().end().appendTo('#tbl_bill');
	// alert($('#tbl_bill').val());
	$(cloned_element).clone().find('input,select').each(function() {
		$(this).attr({
			'id' : function(_, id) {
				return id + m
			},
			'name' : function(_, name) {
				return name + m
			},
			'value' : function(_, value) {
				value
			}
		});
		$(this).removeAttr('readonly');
	}).end().appendTo('#' + tableName).find('td').each(function() {
		$(this).attr({
			'class' : tableName + '_cloned'
		});

	});

	addChangeListener(m);
	makeAutoComplete(auto_element, auto_entity, m);
	$(roz).val(m);
	$(roz1).val(m);
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var addChangeListener = function(counter) {

	$('#quantity' + counter).change(
			function recalculate() {
				var a = parseInt($('#price1' + counter).val())
						* parseInt($('#quantity' + counter).val());
				$('#total' + counter).val(a);
				regenerateStockDetails();
			});

	$('#products_attribute_type' + counter).change(function() {
		var par = $(this).val();
		if (par == "Text") {
			$('#products_attribute_value' + counter).show();
			$('#products_attribute_file_value' + counter).hide();

		} else {
			$('#products_attribute_file_value' + counter).show();
			$('#products_attribute_value' + counter).hide();
		}
	});

	$('#price1' + counter).change(
			function recalculate() {
				var a = parseInt($('#price1' + counter).val())
						* parseInt($('#quantity' + counter).val());
				$('#total' + counter).val(a);
				regenerateStockDetails();
			});

	$('#pay_amount' + counter).change(function recalculate() {
		calPayTot();
	});
	$(
			'#payments_item_total,#payments_to_account,#payments_include, #payments_item_total'
					+ counter + ', #payments_include' + counter).change(
			function recalculate() {
				// alert();
				calPaymentTot($('#payments_to_account').val());
			});

	var focus = '#billing_item_sp' + counter + ',' + '#billing_item_quantity'
			+ counter;
	$(focus).change(function recalculate() {
		var tot = 0;
		var a = parseInt($('#billing_item_sp' + counter).val())
		// * parseInt($('#billing_item_quantity' + counter)
		// .val());
		// $('#billing_item_total' + counter).val(a);
		$('[class="gsc-input-price-total"]').each(function() {
			if (!isNaN(parseInt($(this).val()))) {
				tot = tot + parseInt($(this).val());
			}
		});
		$('#billing_Value').val(tot);

	});

	oldVal = '';
	$(
			'#suvidha_num, #actualDespatchDate,#arrivalDate, #suvidhaNo, #transporter, #despatchId')
			.change(function autoSave1() {
				if (oldVal != $(this).val()) {
					autoSave($(this).attr('name'), $(this).val(), 'order');
					oldVal = $(this).val()
				}
			});

	$(
			'#org_name,#address1, #address2,#address3,#phone,#email,#vatno,#cstno,#etno')
			.change(function autoSave1() {
				if (oldVal != $(this).val()) {
					autoSave($(this).attr('name'), $(this).val(), 'Settings');
					oldVal = $(this).val()
				}
			});

	$(
			'#customer_cust_name,#customer_cust_add, #customer_cust_phone,#customer_cust_email,#customer_cust_type')
			.change(function autoSave1() {
				if (oldVal != $(this).val()) {
					autoSave($(this).attr('name'), $(this).val(), 'customer');
					oldVal = $(this).val()
				}
			});

	$(
			'#oppor_date,#oppor_owner, #oppor_status,#oppor_net_value,#oppor_vat, #oppor_tax,#oppor_gross_value')
			.change(function autoSave1() {
				if (oldVal != $(this).val()) {
					autoSave($(this).attr('name'), $(this).val(), 'oppor');
					oldVal = $(this).val()
				}
			});

	$(
			'#work_desc,#work_status, #work_allocated,#work_start_date,#work_deadline, #work_comments')
			.change(function autoSave1() {
				if (oldVal != $(this).val()) {
					autoSave($(this).attr('name'), $(this).val(), 'work');
					oldVal = $(this).val()
				}
			});

	$('#oppor_cust_name,#oppor_cust_add,#oppor_cust_phone,#oppor_cust_email')
			.change(
					function autoSave1() {
						if (oldVal != $(this).val()) {
							$('#oppor_cust_id').val('');
							autoSaveGroup(
									'oppor_cust_id,oppor_cust_name,oppor_cust_add,oppor_cust_phone,oppor_cust_email',
									'oppor', 'oppor_code');
							oldVal = $(this).val()
						}
					});

	$(
			'#billing_cust_id,#billing_cust_name,#billing_cust_add,#billing_cust_phone,#billing_cust_email,#billing_status,#billing_date,#billing_Value,#billing_vat,#billing_value_net,#billing_sold_by,#vat_appl')
			.change(
					function autoSave1() {
						if (oldVal != $(this).val()) {
							$('#billing_cust_id').val('');
							autoSaveGroup(
									'billing_cust_id,billing_cust_name,billing_cust_add,billing_cust_phone,billing_cust_email,billing_status,billing_date,billing_Value,billing_vat,billing_value_net,billing_sold_by,vat_appl',
									'billing', 'billing_code');
							oldVal = $(this).val()
						}
					});

}

var calculateStockTotal = function() {
	var tot = 0;
	var sur = 0;
	var ratio = 0;
	$('[id="stock_gross_cost_price"]').each(function() {
		if (!isNaN(parseInt($(this).val()))) {
			tot = tot + parseInt($(this).val());
		}
	});
	$('#stock_total').val(tot);

	if (!isNaN(parseInt($('#supSurCharge').val()))) {
		sur = parseInt($('#supSurCharge').val()).toFixed(2);
	} else {
		$('#supSurCharge').val('0')
	}
	ratio = sur / (parseFloat($('#stock_total').val()).toFixed(2));
	$('[id="stock_gross_cost_price"]').each(
			function() {
				if (!isNaN(parseInt($(this).val()))) {
					vl = parseFloat($(this).val()).toFixed(2);
					var surName = $(this).attr('name').replace(
							'stock_gross_cost_price', 'stock_supp_sur');
					// alert(surName);
					$('[name="' + surName + '"]').val((vl * ratio).toFixed(2));

				}
			});

}
var calculateBillSum = function() {
	var pur_gto = 0;
	var rate = 0;
	var unit = 0;
	var total = 0;
	var vat_appl = 5.0;
	var total_np = 0;
	var vat = 0;
	var pur_nto = 0;
	var pur_vat = 0;
	var desc = "";
	var brand = "";
	var descSum = "";

	$("input[name^='billing_item_rate']").each(
			function() {
				var elementId = $(this).attr('id');
				var elementName = $(this).attr('name');
				counter = elementName.substr(elementId.length,
						elementName.length - 1);
				desc = $("input[name=billing_item_des" + counter + "]").val();
				descSum = descSum
						+ $("input[name=billing_item_des" + counter + "]")
								.val().substring(0, 20) + "..| ";

				if ($.trim(desc) != '') {
					rate = parseFloat('0'
							+ $("input[name=billing_item_rate" + counter + "]")
									.val());
					unit = parseFloat('0'
							+ $(
									"input[name=billing_item_quantity"
											+ counter + "]").val());
					vat_appl = parseFloat('0'
							+ $(
									"input[name=billing_item_vat_appl"
											+ counter + "]").val());
					total = (rate * unit);
					total_np = ((100 * total) / (100 + vat_appl));
					vat = (total_np * (vat_appl / 100));

					$("input[name=billing_item_total" + counter + "]").val(
							total.toFixed(2));
					$("input[name=billing_item_sp_net" + counter + "]").val(
							total_np.toFixed(2));
					$("input[name=billing_item_vat" + counter + "]").val(
							vat.toFixed(2));

					pur_gto = pur_gto + (total);
					pur_nto = pur_nto + (total_np);
					pur_vat = pur_vat + vat;
					brand = $("input[name=billing_item_brand" + counter + "]")
							.val();

				}
			});
	$("#billing_Value").val(pur_gto.toFixed(2));
	$("#billing_value_net").val(pur_nto.toFixed(2));
	$("#billing_vat").val(pur_vat.toFixed(2));
	$("input[name=vat_appl]").val(vat_appl.toFixed(1));
	$("#billing_brand").val(brand);
	$("#billing_summ").val(descSum);

}
var calculateOppSum = function() {
	var pur_gto = 0;
	var rate = 0;
	var unit = 0;
	var total = 0;
	var vat_appl = 5.0;
	var total_np = 0;
	var vat = 0;
	var pur_nto = 0;
	var pur_vat = 0;
	var desc = "";
	var brand = "";
	var descSum = "";
	var net_rate = 0;
	$("input[name^='oppor_item_rate']")
			.each(
					function() {
						var elementId = $(this).attr('id');
						var elementName = $(this).attr('name');
						counter = elementName.substr(elementId.length,
								elementName.length - 1);
						desc = $("input[name=oppor_item_des" + counter + "]")
								.val();
						descSum = descSum
								+ " | "
								+ $("input[name=oppor_item_des" + counter + "]")
										.val().substring(0, 20) + "..";

						if ($.trim(desc) != '') {
							rate = parseFloat($(
									"input[name=oppor_item_rate" + counter
											+ "]").val());
							vat_appl = parseFloat($(
									"input[name=oppor_item_vat_appl" + counter
											+ "]").val());
							net_rate = (100 * rate) / (100 + vat_appl);
							unit = parseFloat($(
									"input[name=oppor_item_unit" + counter
											+ "]").val());
							total = (rate * unit);
							total_np = ((100 * total) / (100 + vat_appl));
							vat = (total_np * (vat_appl / 100));

							$("input[name=oppor_item_net_rate" + counter + "]")
									.val(net_rate.toFixed(2));

							$(
									"input[name=oppor_item_gross_price"
											+ counter + "]").val(
									total.toFixed(2));
							$("input[name=oppor_item_net_price" + counter + "]")
									.val(total_np.toFixed(2));
							$("input[name=oppor_item_vat" + counter + "]").val(
									vat.toFixed(2));

							pur_gto = pur_gto + (total);
							pur_nto = pur_nto + (total_np);
							pur_vat = pur_vat + vat;
							brand = $(
									"input[name=oppor_item_brand" + counter
											+ "]").val();
						}
					});
	$("#oppor_gross_value").val(pur_gto.toFixed(2));
	$("#oppor_net_value").val(pur_nto.toFixed(2));
	$("#oppor_tax").val(pur_vat.toFixed(2));
	$("#oppor_vat").val(vat_appl.toFixed(1));
	$("#oppor_brand").val(brand);
	$("#oppor_summ").val(descSum);
}

var calculatePurSum = function() {
	var pur_tot = 0;
	var pur_rate = 0;
	var pur_unit = 0;
	var pur_gto = 0;
	var rate = 0;
	var unit = 0;
	var total = 0;
	var itemRows = $('#item_pur_roz').val();
	for (var itemRow = 0; itemRow < itemRows; itemRow++) {
		if (itemRow == 0) {
			itemRow = "";
		}
		rate = parseInt($("#pur_rate" + itemRow).val());
		unit = parseInt($("#pur_unit" + itemRow).val());
		total = rate * unit;
		if (isNaN(total)) {
			total = 0;
		}
		$("#pur_tot" + itemRow).val(total);
		pur_gto = pur_gto + (rate * unit);
		$("#pur_gto").val(pur_gto);
	}

	// $("#tblPurInvoice").find('[id=pur_tot]').parents('#pur_trow').each(function()
	// {
	// pur_rate = "0" +
	// $(this).children().children().children("#pur_rate").val();
	// pur_unit = "0" +
	// $(this).children().children().children("#pur_unit").val();
	// pur_tot = pur_rate * pur_unit;
	// $(this).children().children().children("#pur_tot").val(pur_tot);
	// pur_gto = pur_gto + pur_tot;
	// });
	// alert(pur_gto);
}

var calculateTaxSum = function() {
	var saleTotAG = 0;
	var saleTotNAG = 0;
	var vatTotalNAG = 0;
	var vatTotalAG = 0;

	var purTotAGStateInv = 0;
	var purTotNAGStateInv = 0;
	var purVatTotalNAGStateInv = 0;
	var purVatTotalAGStateInv = 0;

	var purTotAGNStateInv = 0;
	var purTotNAGNStateInv = 0;
	var purVatTotalNAGNStateInv = 0;
	var purVatTotalAGNStateInv = 0;
	var purVatTotalNAGInv = 0;
	var purETTotalAGNStateInv = 0;
	var purETTotalNAGNStateInv = 0;

	var purTotAGState = 0;
	var purTotNAGState = 0;
	var purVatTotalNAGState = 0;
	var purVatTotalAGState = 0;

	var purTotAGNState = 0;
	var purTotNAGNState = 0;
	var purVatTotalNAGNState = 0;
	var purVatTotalAGNState = 0;
	var purVatTotalNAG = 0;
	var purETTotalAGNState = 0;
	var purETTotalNAGNState = 0;
	var payVAT = 0;
	var payET = 0;

	var vatCat = 0;
	var isCnf = "";
	var statePur = 0;
	var osStatePur = 0;
	var et = 0;
	var status = "";
	var purNotSold = 0;
	var purSold = 0;
	var payPurchase = 0;
	var payExpense = 0;
	var paySale = 0;
	var payIncentive = 0;

	var taxType = "";
	$("#tbl_sale_returns_item")
			.find('[id=returns_sale_vat_appl]')
			.parents('#item_sale_trow')
			.each(
					function() {
						vatCat = $(this).children().children().children(
								"#returns_sale_vat_appl").val();
						if ($(this).children().children().children(
								"#returns_sale_include").is(':checked')) {

							if ((vatCat == "5.0") || (vatCat == "5")) {
								saleTotAG = parseInt(saleTotAG)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_sale_net_selling_price")
												.val());
								vatTotalAG = parseInt(vatTotalAG)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_sale_output_vat")
												.val());
							}
							if (vatCat == "13.5") {
								saleTotNAG = parseInt(saleTotNAG)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_sale_net_selling_price")
												.val());
								vatTotalNAG = parseInt(vatTotalNAG)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_sale_output_vat")
												.val());
							}
						}
					});

	$("#tbl_pur_returns_item")
			.find('[id=returns_pur_vat_appl]')
			.parents('#item_pur_trow')
			.each(
					function() {
						vatCat = $(this).children().children().children(
								"#returns_pur_vat_appl").val();
						isCnf = $(this).children().children().children(
								"#returns_pur_is_cnf").val();
						if ($(this).children().children().children(
								"#returns_pur_include").is(':checked')) {

							status = $(this).children().children().children(
									"#returns_pur_status").val().toLowerCase();

							if (status == "sold") {
								purSold = parseInt(purSold)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_pur_net_cost_price")
												.val());
							} else if (status == "in stock") {
								purNotSold = parseInt(purNotSold)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_pur_net_cost_price")
												.val());
							}

							if (isCnf == "Y") {
								if ((vatCat == "5.0") || (vatCat == "5")) {
									purTotAGState = parseInt(purTotAGState)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_net_cost_price")
													.val());
									purVatTotalAGState = parseInt(purVatTotalAGState)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_input_vat")
													.val());
								}
								if (vatCat == "13.5") {
									purTotNAGState = parseInt(purTotNAGState)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_net_cost_price")
													.val());
									purVatTotalNAG = parseInt(purVatTotalNAG)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_input_vat")
													.val());
								}

							}
							if (isCnf == "N") {
								if ((vatCat == "5.0") || (vatCat == "5")) {
									purTotAGNState = parseInt(purTotAGNState)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_net_cost_price")
													.val());
									purETTotalAGNState = parseInt(purETTotalAGNState)
											+ parseInt($(this).children()
													.children().children(
															"#returns_pur_et")
													.val());
								}
								if (vatCat == "13.5") {
									purTotNAGNState = parseInt(purTotNAGNState)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_net_cost_price")
													.val());
									purETTotalNAGNState = parseInt(purETTotalNAGNState)
											+ parseInt($(this).children()
													.children().children(
															"#returns_pur_et")
													.val());
								}
							}

						} // /checked ...

					});

	$("#tbl_pur_inv_returns_item")
			.find('[id=returns_pur_inv_vat_appl]')
			.parents('#item_pur_inv_trow')
			.each(
					function() {
						vatCatInv = $(this).children().children().children(
								"#returns_pur_inv_vat_appl").val();
						isCnfInv = $(this).children().children().children(
								"#returns_pur_inv_is_cnf").val();
						if ($(this).children().children().children(
								"#returns_pur_inv_include").is(':checked')) {

							if (isCnfInv == "Y") {
								if ((vatCatInv == "5.0") || (vatCatInv == "5")) {
									purTotAGStateInv = parseInt(purTotAGStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_net_cost_price")
													.val());
									purVatTotalAGStateInv = parseInt(purVatTotalAGStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_input_vat")
													.val());

								}
								if (vatCatInv == "13.5") {
									purTotNAGStateInv = parseInt(purTotNAGStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_net_cost_price")
													.val());
									purVatTotalNAGInv = parseInt(purVatTotalNAGInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_input_vat")
													.val());
								}
							}
							if (isCnfInv == "N") {
								if ((vatCatInv == "5.0") || (vatCatInv == "5")) {
									purTotAGNStateInv = parseInt(purTotAGNStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_net_cost_price")
													.val());
									purETTotalAGNStateInv = parseInt(purETTotalAGNStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_et")
													.val());
								}
								if (vatCatInv == "13.5") {
									purTotNAGNStateInv = parseInt(purTotNAGNStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_net_cost_price")
													.val());
									purETTotalNAGNStateInv = parseInt(purETTotalNAGNStateInv)
											+ parseInt($(this)
													.children()
													.children()
													.children(
															"#returns_pur_inv_et")
													.val());
								}
							}

						} // /checked ...

					});

	$("#tbl_returns_payments_item")
			.find('[id=returns_payments_amount]')
			.parents('#item_payments_trow')
			.each(
					function() {
						taxType = $(this).children().children().children(
								"#returns_payments_type").val();

						if ($(this).children().children().children(
								"#returns_payments_include").is(':checked')) {
							if (taxType.indexOf('VAT') >= 0) {
								payVAT = parseInt(payVAT)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_payments_amount")
												.val());
							}
							if (taxType.indexOf('Order') >= 0) {
								payPurchase = parseInt(payPurchase)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_payments_amount")
												.val());
							}
							if (taxType.indexOf('Expense') >= 0) {
								payExpense = parseInt(payExpense)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_payments_amount")
												.val());
							}
							if (taxType.indexOf('Incentive') >= 0) {
								payIncentive = parseInt(payIncentive)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_payments_amount")
												.val());
							}
							if (taxType.indexOf('Sale') >= 0) {
								paySale = parseInt(paySale)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_payments_amount")
												.val());
							}
							if (taxType.indexOf('ET') >= 0) {
								payET = parseInt(payET)
										+ parseInt($(this)
												.children()
												.children()
												.children(
														"#returns_payments_amount")
												.val());
							}
						}

					});

	$('#ag_sale').val(saleTotAG);
	$('#nag_sale').val(saleTotNAG);
	$('#tot_sale').val(saleTotAG + saleTotNAG);
	$('#ag_ovat').val(vatTotalAG);
	$('#nag_ovat').val(vatTotalNAG);
	$('#tot_ovat').val(vatTotalAG + vatTotalNAG);

	$('#ag_pur_state').val(purTotAGState);
	$('#nag_pur_state').val(purTotNAGState); // /////////////////
	$('#tot_pur_state').val(purTotAGState + purTotNAGState);
	$('#ag_ivat_state').val(purVatTotalAGState);
	$('#nag_ivat_state').val(purVatTotalNAG); // //////////////////
	$('#tot_ivat_state').val(purVatTotalAGState + purVatTotalNAG);

	$('#ag_pur_non_state').val(purTotAGNState);
	$('#nag_pur_non_state').val(purTotNAGNState);
	$('#tot_pur_non_state').val(purTotAGNState + purTotNAGNState);

	$('#ag_et_state').val(purETTotalAGNState);
	$('#nag_et_state').val(purETTotalNAGNState);
	$('#tot_et_state').val(purETTotalAGNState + purETTotalNAGNState);
	$('#output_input_diff').val(
			vatTotalAG + vatTotalNAG - purVatTotalAGState - purVatTotalNAG);

	$('#pay_vat').val(payVAT);
	$('#pay_et').val(payET);
	$('#pay_purchase').val(payPurchase);
	$('#pay_sale').val(paySale);
	$('#pay_incentive').val(payIncentive);
	$('#pay_expense').val(payExpense);

	// $('#outstanding_vat').val(
	// vatTotalAG + vatTotalNAG - purVatTotalAGState - purVatTotalNAGState
	// - payVAT - payET);
	$('#outstanding_vat').val(
			vatTotalAG + vatTotalNAG - purVatTotalAGStateInv
					- purVatTotalNAGStateInv + payVAT + payET);
	$('#outstanding_et').val(
			purETTotalAGNStateInv + purETTotalNAGNStateInv + payET);

	$('#ag_pur_state_inv').val(purTotAGStateInv);
	$('#nag_pur_state_inv').val(purTotNAGStateInv); // /////////////////
	$('#tot_pur_state_inv').val(purTotAGStateInv + purTotNAGStateInv);
	$('#ag_ivat_state_inv').val(purVatTotalAGStateInv);
	$('#nag_ivat_state_inv').val(purVatTotalNAGInv); // //////////////////
	$('#tot_ivat_state_inv').val(purVatTotalAGStateInv + purVatTotalNAGInv);

	$('#ag_pur_non_state_inv').val(purTotAGNStateInv);
	$('#nag_pur_non_state_inv').val(purTotNAGNStateInv);
	$('#tot_pur_non_state_inv').val(purTotAGNStateInv + purTotNAGNStateInv);

	$('#ag_et_state_inv').val(purETTotalAGNStateInv); // here
	$('#nag_et_state_inv').val(purETTotalNAGNStateInv);
	$('#tot_et_state_inv').val(purETTotalAGNStateInv + purETTotalNAGNStateInv);
	$('#output_input_diff_inv').val(
			vatTotalAG + vatTotalNAG - purVatTotalAGStateInv
					- purVatTotalNAGInv);
	var ratio = ((purTotAGStateInv + purTotNAGStateInv + purTotAGNStateInv + purTotNAGNStateInv) / (purTotAGState
			+ purTotNAGState + purTotAGNState + purTotNAGNState));
	$('#pur_sold').val((purSold * ratio).toFixed(2));
	$('#pur_not_sold').val((purNotSold * ratio).toFixed(2));

}

/*
 * Variant of autoSave. Takes comma separated field names as input. Same will be
 * parsed and saved in 'entity'
 */
var autoSaveGroup = function(group, entity, id) {
	showMessage('Saving...', entity);
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'autoSaveGroup');
	// parameter[parameter.length] = new param('id', $('#' + id).val());
	parameter[parameter.length] = new param('code', $("input[name=" + id + "]")
			.val());
	var elements = group.split(',');

	for (var element = 0; element < elements.length; element++) {
		parameter[parameter.length] = new param(elements[element], $(
				"input[name=" + elements[element] + "]").val());

	}
	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			var data = resp.data;
			/*
			 * if (entity == 'order') {
			 * $('#orderStatus').val(data[0].orderStatus); } if (entity ==
			 * 'customer') { $('#customer_code').val(data[0].name); }
			 * 
			 * denableOnStatus(entity);
			 */
			showMessage('Data saved succesfully !!!', entity);
		}
	});
}

/*
 * saves value against name filed in entity table
 */
var autoSave = function(nme, vlue, entity) {
	showMessage('Saving...', entity);
	var parameter = new Array();

	parameter[parameter.length] = new param('command', 'autoSave');
	parameter[parameter.length] = new param('name', nme);
	parameter[parameter.length] = new param('value', vlue);
	if (entity == 'order') {
		parameter[parameter.length] = new param('order', $('#tblOrderId').val());
	}
	if (entity == 'customer') {
		parameter[parameter.length] = new param('code', $('#customer_code')
				.val());
	} else {
		parameter[parameter.length] = new param('code', $(
				'#' + entity + '_code').val());
	}

	// var add=$("#order-create-form").attr('action');
	// alert($("#order-create-form").attr('action'));

	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			var data = resp.data;
			if (entity == 'order') {
				$('#orderStatus').val(data[0].orderStatus);
			}
			if (entity == 'customer') {
				$('#customer_code').val(data[0].name);
			}

			denableOnStatus(entity);
			showMessage('Data saved succesfully !!!', entity);
		}
	});
}

var regenerateBalance = function(company) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'balance');
	parameter[parameter.length] = new param('company', company);
	$.ajax({
		url : "/" + 'account',
		type : "GET",
		data : parameter,
		success : function(resp) {
			$('#balance').val('');
			var data = resp.data;
			$('#payments_due,#balance').val(data[0].balance);
		}
	});
}

var calPayTot = function() {
	var payTot = 0;
	var pay = 0;
	var items = 0;
	$("#tbl_pay_item").find('input[id*=pay_amount]').each(function() {
		$(this).removeAttr('disabled');
		pay = $(this).val();
		if (pay == '') {
			pay = 0;
		}
		payTot = parseInt(payTot) + parseInt(pay);
		$("#payments_due").val(parseInt(payTot));
		items = items + 1;
		$(this).show();
	});
}

var calPayDiff = function() {
	var payments_due = $('#payments_due').val();
	var payments_item_tot = $('#payments_item_tot').val();
	var payments_round = $('#payments_round').val();

	if (payments_due == "") {
		payments_due = 0;
	}
	if (payments_item_tot == "") {
		payments_item_tot = 0;
	}
	if (payments_round == "") {
		payments_round = 0;
	}

	$('#payments_amount').val(
			parseInt(payments_item_tot) - parseInt(payments_due)
					+ parseInt(payments_round));

}

var calPaymentTot = function(company) {
	var payTot = 0;
	var pay = 0;
	var payStr = "0";
	var items = 0;
	if (company != "") {
		$("#tbl_payments_item tr")
				.each(
						function() {
							if (typeof $(this).children().children().find(
									'input[name*=payments_item_total]').first()
									.val() != "undefined") {
								pay = parseInt($(this)
										.children()
										.children()
										.find(
												'input[name*=payments_item_total]')
										.first().val());
								if (isNaN(pay)) {
									pay = 0;
								}
								payTot = parseInt(payTot)
										+ $(this)
												.children()
												.children()
												.find(
														'input[name*=payments_include]')
												.first().prop('checked') * pay;
								// items = items + 1;
								// $(this).show();
							}
						});
		$("#payments_item_tot").val(parseInt(payTot));
	} else {

		$("#tbl_payments_item").find('input[id*=payments_item_tot]').each(
				function() {
					$(this).removeAttr('disabled');
					pay = $(this).val();
					if (pay == '') {
						pay = 0;
					}
					payTot = parseInt(payTot) + parseInt(pay);
					$("#payments_item_tot").val(parseInt(payTot));
					items = items + 1;
				});

		/*
		 * $("#tbl_payments_item").find( 'input[id=payments_account]').parents(
		 * '#item_trow').each( function() { alert('aaya kya'); payTot =
		 * parseInt(payTot) + $(this).children().children().children(
		 * "#payments_include").prop('checked')
		 * parseInt($(this).children().children().children(
		 * "#payments_item_total").val());
		 * $("#payments_item_tot").val(parseInt(payTot)); items = items + 1;
		 * $(this).show(); });
		 */
	}

}

var filterOutitems = function(company) {
	var payTot = 0;
	var items = 0;
	$('#tbl_payments_item').find('input,select').attr("readonly", "readonly");
	$("#payments_include").prop('checked', false);
	$('.payments_cloned').remove();
	$("#tbl_pay_item").find('input[id*=pay_party]').each(function() {
		$(this).val(company);
	});

	$("#tbl_payments_item")
			.find('input[value="' + company + '"][id=payments_account]')
			.parents('#item_trow')
			.each(
					function() {
						$(this).removeAttr('disabled');
						payTot = parseInt(payTot)
								+ parseInt($(this).children().children()
										.children("#payments_item_total").val());
						$("#payments_item_tot").val(parseInt(payTot));
						$(this).children().children().children(
								"#payments_include").prop('checked', true)
								.removeAttr('readonly');
						$(this).children().children().children(
								"#payments_item_total").removeAttr('readonly');
						$(this)
								.children()
								.children()
								.children(
										"#payments_include ,#payments_item_due,#payments_item_total")
								.change(function() {
									// calPaymentTot($('#payments_to_account').val());
								})
						$(this).removeClass('ignore');
						items = items + 1;
					});
	$("#tbl_payments_item")
			.find('input[value!="' + company + '"][id=payments_account]')
			.parents('#item_trow')
			.each(
					function() {

						if ($(this).children().children().children(
								"#payments_item_total").val() != '') {
							$(this).children().children().children(
									"#payments_include").prop('checked', false);
							$(this).addClass('ignore');

						} else { // forlast line that is to be made editable
							$(this).children().children().children(
									"#payments_include").prop('checked', true)
									.removeAttr('readonly');
							$(this)
									.children()
									.children()
									.children(
											"#payments_item_total,#payments_item_due,#payments_item_category, #payments_item_des")
									.removeAttr('readonly');
							$(this).children().children().children(
									"#payments_account").val(company);

						}
						// $(this).hide();
					});
}
var suffFund = function() {
	balance = parseInt($('#balance').val());
	value = parseInt($('#orderValue').val());
	if (!isNaN(balance) && !isNaN(value))
		if (value > balance) {
			alert('Not enough balance in account');
		}
}

var regenerateStockDetails = function() {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'freeslot');
	parameter[parameter.length] = new param('code', '');
	$.ajax({
		url : "/" + 'stock',
		type : "GET",
		data : parameter,
		success : function(resp) {
			var data = resp.data;
			var formElements = $('form#' + 'entity' + '-create-form :input');
			var grandTotal = 0;
			// var grandTotalStock=0;

			var itemRows = $('#tblItem tr').length - 1;
			var stockCode = parseInt(data[0].name);
			// alert(stockCode);
			var c = '';
			var stockRows = 0;
			var supSurCharge = 0;
			if (!isNaN(parseInt($('#supSurCharge').val()))) {
				supSurCharge = parseInt($('#supSurCharge').val());
			}
			$('.stock_cloned').remove();
			for (var itemRow = 0; itemRow < itemRows; itemRow++) {
				var qty = parseInt($('#quantity' + c).val());
				des = $('#type1' + c).val();
				if ((des != "") && (des != null)) {
					var substr = des.split("|");
					price = $('#price1' + c).val();
					// alert(parseInt($('#total' + c).val()));
					grandTotal = parseInt(grandTotal
							+ parseInt($('#total' + c).val()));
					for (var i = 0; i < qty; i++) {
						stockCode++;
						stockRows++;
						// alert( "Generating Stock row" +i);
						$('#stock_tbl tr:last').clone().find('input').each(
								function() {
									$(this).attr({
										'id' : function(_, id) {
											return id
										},
										'name' : function(_, name) {
											return name + stockRows
										},
										'value' : ''
									});
								}).end().appendTo('#stock_tbl').find('td')
								.each(function() {
									$(this).attr({
										'class' : 'stock_cloned'
									})
								});
						$('[name="stock_type' + stockRows + '"]')
								.val(substr[1]);
						$('[name="stock_subtype' + stockRows + '"]').val(
								substr[2]);
						$('[name="stock_subsubtype' + stockRows + '"]').val(
								substr[3]);

						$('[name="stock_code' + stockRows + '"]')
								.val(stockCode);
						$('[name="stock_gross_cost_price' + stockRows + '"]')
								.val(price);
						$('[name="is_cnf' + stockRows + '"]').val(substr[6]);
						$('[name="et_appl' + stockRows + '"]').val(substr[7]);
						$('[name="vat_appl' + stockRows + '"]').val(substr[8]);

					}
				}

				if (c == '') {
					c = 1;
				} else {
					c++;
				}
			}
			$('#orderValue').val(grandTotal + supSurCharge);
			// $('#stock_total').val(grandTotalStock);
			$('#stock_roz').val(stockRows + 1);
			calculateStockTotal();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}

	});

}

var regenerateSearchedStockDetails = function(word) {
	if ((word != "") && (word != null)) {
		var substr = word.split("|");
		$('#stock-create-form').find('input[name=brand]').val(substr[0]);
		$('#stock-create-form').find('input[name=stock_type]').val(substr[1]);
		$('#stock-create-form').find('input[name=stock_subtype]')
				.val(substr[2]);
		$('#stock-create-form').find('input[name=stock_subsubtype]').val(
				substr[3]);
		$('#stock-create-form').find('input[name=stock_description]').val(
				substr[4]);
		$('#stock-create-form').find('input[name=stock_code]').val(substr[5]);
	}
}

var makeAutoComplete = function(element, entity, counter) {
	$("#" + element + counter).autocomplete(
			{
				width : 300,
				max : 10,
				delay : 250,
				minLength : 1,
				autoFocus : true,
				cacheLength : 1,
				scroll : true,
				highlight : false,
				select : function(event, ui) {
					var strng = ui.item.value;
					var substr = strng.split("|");
					if (entity == ENTITY_PL) {
						$('#brand1' + counter).val(substr[0]);
						$('#price1' + counter).val(substr[5]);
						$('#quantity' + counter).val('1');
						var a = parseInt($('#price1' + counter).val())
								* parseInt($('#quantity' + counter).val());
						$('#total' + counter).val(a);
						regenerateStockDetails();
					} else if (entity == ENTITY_STOCK) {
						$('#billing_item_stockcode' + counter).val(substr[5]);
						$('#billing_item_des' + counter).val(substr[0]);
						addNewRow('tbl_billing_item', 'billing',
								'billing_item_des', 'stock');
						// $('#billing_item_sp' +
						// counter).val(substr[0]);
					}
				},
				source : function(request, response) {
					$.ajax({
						url : entity + "?command=suggest",
						dataType : "json",
						data : request,
						success : function(data, textStatus, jqXHR) {
							var items = data;
							response(items);
						},
						error : function(jqXHR, textStatus, errorThrown) {
						}
					});
				}
			});
}

/*
 * oppor_item_des --> element whose value will be split [{},{}] --> split value
 * above will be distributed in arrays: name defines name of the element and val
 * is the index
 */
var breakNDistMap = {};
breakNDistMap['oppor_item_des'] = [ {
	name : 'oppor_item_des',
	val : [ '1', '2', '3' ],
	dest : 'opporitem',
	pkField : 'name'
}, {
	name : 'oppor_item_brand',
	val : '0',
	dest : 'opporitem',
	pkField : 'name'
}, {
	name : 'oppor_item_rate',
	val : '5',
	dest : 'opporitem',
	pkField : 'name'
}, {
	name : 'oppor_item_unit',
	val : [ '-1' ],
	dest : 'opporitem',
	pkField : 'name'
}, {
	name : 'oppor_item_gross_price',
	val : '5',
	dest : 'opporitem',
	pkField : 'name'
}, {
	name : 'oppor_item_vat_appl',
	val : '8',
	dest : 'opporitem',
	pkField : 'name'
} ];

breakNDistMap['billing_item_des'] = [ {
	name : 'billing_item_des',
	val : [ '1', '2', '3' ],
	dest : 'billingitem',
	pkField : 'name'
}, {
	name : 'billing_item_brand',
	val : '0',
	dest : 'opporitem',
	pkField : 'name'
}, {
	name : 'billing_item_stockcode',
	val : '5',
	dest : 'billingitem',
	pkField : 'name'
}, {
	name : 'billing_item_quantity',
	val : [ '-1' ],
	dest : 'billingitem',
	pkField : 'name'
}, {
	name : 'billing_item_sp',
	val : '5',
	dest : 'billingitem',
	pkField : 'name'
}, {
	name : 'billing_item_vat_appl',
	val : '7',
	dest : 'billingitem',
	pkField : 'name'
} ];

/*
 * This will take a autoselect event and ui which is autoselected. WIll split
 * the ui content through "|" and distribute the content to other elements based
 * on configuration
 */
var breakNDist = function(event, ui, element) {
	event.preventDefault();
	var elementId = $(element).attr('id');
	var elementName = $(element).attr('name');
	counter = elementName.substr(elementId.length, elementName.length - 1);
	var substr = ui.item.value.split("|");
	var nme = "";
	var fldVal = "";
	var nmeList = "";
	var dest = "";
	var pkField = "";
	if (isNaN(parseInt(counter))) {
		counter = "";
	}

	var fieldsArr = eval('breakNDistMap.' + elementId);
	for (var i = 0; i < fieldsArr.length; i++) {

		nme = fieldsArr[i].name;
		valArr = fieldsArr[i].val;
		fldVal = "";
		dest = fieldsArr[i].dest;
		pkField = fieldsArr[i].pkField;
		for (var j = 0; j < valArr.length; j++) {
			if (parseInt(valArr[j]) < 0) {
				fldVal = parseInt(valArr[j]) * (-1);
			} else {
				fldVal = fldVal + '  ' + substr[valArr[j]];
			}
		}
		$("input[name=" + nme + counter + "]").val($.trim(fldVal));
		// $("input[name=" + nme + counter + "]").change(); // calls this
		// function recursively
		nmeList = nmeList + "," + nme + counter;
	}
	$("input[name=" + nme + counter + "]").change(); // this will trigger
	// changeaction on last
	// field thus avoiding
	// recursion - assuming
	// last entry is not the
	// element itself
	autoSaveGroup(nmeList, dest, pkField + counter);
}

/*
 * variant of makeAutoComplete - more generic version, Element on which
 * autocomplete is required need not be discovered - this is passed as parameter
 */
var autoCompMap = {};
autoCompMap['oppor_item_des'] = [ "pl" ];
autoCompMap['billing_item_des'] = [ "stock" ];

var addNeededAutoCompleteG = function(element) {
	var elementId = $(element).attr('id');
	var entt = autoCompMap[elementId];
	if (entt instanceof Object) {
		$(element).autocomplete({
			width : 300,
			max : 10,
			delay : 250,
			minLength : 1,
			autoFocus : true,
			cacheLength : 1,
			scroll : true,
			highlight : false,
			select : function(event, ui) {
				breakNDist(event, ui, $(this));
			},
			source : function(request, response) {
				$.ajax({
					url : entt + "?command=suggest",
					dataType : "json",
					data : request,
					success : function(data, textStatus, jqXHR) {
						var items = data;
						response(items);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						console.log(textStatus, errorThrown);
					}
				});
			}
		});
	}
}

/*
 * variant of makeAutoComplete. Element on which autocomplete is required need
 * not be discovered - this is passed as parameter
 */

var addNeededAutoComplete = function(element, entity) {
	$(element)
			.autocomplete(
					{
						width : 300,
						max : 10,
						delay : 250,
						minLength : 1,
						autoFocus : true,
						cacheLength : 1,
						scroll : true,
						highlight : false,
						select : function(event, ui) {
							var elementId = $(this).attr('id');
							var substr = ui.item.value.split("|");
							var counter = "";
							if (elementId.indexOf('pur_des') >= 0) {
								counter = elementId.substr(
										elementId.length - 1, 1);
								if (isNaN(parseInt(counter))) {
									counter = "";
								}
								$("input[name=pur_cnf" + counter + "]").val(
										substr[1]);
								$("input[name=pur_et" + counter + "]").val(
										substr[2]);
								$("input[name=pur_tax_appl" + counter + "]")
										.val(substr[3]);
								event.preventDefault();
								$("input[name=pur_des" + counter + "]").val(
										substr[0]);
							} else if ((elementId.indexOf('oppor_cust_name') >= 0)
									|| (elementId.indexOf('oppor_cust_add') >= 0)
									|| (elementId.indexOf('oppor_cust_phone') >= 0)
									|| (elementId.indexOf('oppor_cust_email') >= 0)) {
								event.preventDefault();
								$("#oppor_cust_id").val(substr[0]);
								$("#oppor_cust_name").val(substr[1]);
								$("#oppor_cust_add").val(substr[2]);
								$("#oppor_cust_phone").val(substr[3]);
								$("#oppor_cust_email").val(substr[4]);
								autoSaveGroup(
										'oppor_cust_id,oppor_cust_name,oppor_cust_add,oppor_cust_phone,oppor_cust_email',
										'oppor', 'oppor_code');
							} else if ((elementId.indexOf('billing_cust_name') >= 0)
									|| (elementId.indexOf('billing_cust_add') >= 0)
									|| (elementId.indexOf('billing_cust_phone') >= 0)
									|| (elementId.indexOf('billing_cust_email') >= 0)) {
								event.preventDefault();
								$("#billing_cust_id").val(substr[0]);
								$("#billing_cust_name").val(substr[1]);
								$("#billing_cust_add").val(substr[2]);
								$("#billing_cust_phone").val(substr[3]);
								$("#billing_cust_email").val(substr[4]);
								autoSaveGroup(
										'billing_cust_id,billing_cust_name,billing_cust_add,billing_cust_phone,billing_cust_email',
										'billing', 'billing_code');
							} else if ((elementId.indexOf('oppor_item_code') >= 0)
									|| (elementId.indexOf('oppor_item_des') >= 0)
									|| (elementId.indexOf('oppor_item_rate') >= 0)
									|| (elementId.indexOf('oppor_item_unit') >= 0)
									|| (elementId
											.indexOf('oppor_item_net_price') >= 0)) {
								event.preventDefault();
								counter = elementId.substr(
										elementId.length - 1, 1);
								if (isNaN(parseInt(counter))) {
									counter = "";
								}
								$("input[name=oppor_item_rate" + counter + "]")
										.val(substr[5]);
								$("input[name=oppor_item_unit" + counter + "]")
										.val('1');
								$(
										"input[name=oppor_item_net_price"
												+ counter + "]").val(substr[5]);
								event.preventDefault();
								$("input[name=oppor_item_des" + counter + "]")
										.val(
												substr[0] + " : " + substr[1]
														+ " : " + substr[2]
														+ " : " + substr[3]
														+ " : " + substr[4]);
								// autoSaveGroup('oppor_cust_id,oppor_cust_name,oppor_cust_add,oppor_cust_phone,oppor_cust_email',
								// 'oppor','oppor_code');
							}
						},
						source : function(request, response) {
							$
									.ajax({
										url : entity + "?command=suggest",
										dataType : "json",
										data : request,
										success : function(data, textStatus,
												jqXHR) {
											var items = data;
											response(items);
										},
										error : function(jqXHR, textStatus,
												errorThrown) {
										}
									});
						}
					});
}

// function to show the tab
var showTab = function(tab) {
	// remove the active class from all the tabs
	$('.tab').removeClass("active");
	// setting the active class to the selected tab
	$('#' + tab).addClass("active");
	// hiding all the tabs
	$('.g-unit').hide();

	// showing the selected tab
	$('#' + tab + '-tab').show();
	// hiding the message block
	$('.message').hide();
	// hiding the create block
	// showHideCreate(tab, false);
	if (tab != HOME)
		$('#' + tab + '-search-reset').click();
	$('.displayArea').hide();
	// showMenu(tab);

}
var showDisplayArea = function(entityURL) {
	var substr = entityURL.split("?");
	var entity = substr[0];
	// $('.menuItem .a').attr('class','selected');
	$('.displayArea').hide();
	$('#' + entity + '-display').show();
	showHideCreate(entityURL, false);
}

// function to show/hide create block for an entity in a tab
var showHideCreate = function(entityURL, show) {
	var substr = entityURL.split("?");
	var entity = substr[0];
	var par = substr[1];
	// checking if the block is show or not
	clearMessage(entity);

	if (show) {
		// hiding the search container
		$('#' + entity + '-search-ctr').hide();
		// hiding the list container
		$('#' + entity + '-list-ctr').hide();
		// showing the create container
		$('#' + entity + '-create-ctr').show();

	} else {
		// showing the search container
		$('#' + entity + '-search-ctr').show();
		// showing the list container
		$('#' + entity + '-list-ctr').show();
		// hiding the create container
		$('#' + entity + '-create-ctr').hide();
		// checking if the entity is not a home then populating the list of the
		// entity
		if ((entity != HOME) && (entity != 'salereport')) {

			populateList(entity, par, 'list');
			// function(entity, filter, command, currentCursor, clickedLink)
		}
		if ((entity == 'salereport')) {
			$('#salereport-display').show();
			$('#salereport-list-ctr')
					.html(
							"<iframe src='/graph.jsp' width='98%' height='800' frameBorder='0' style = 'margin-top: 2em'></iframe>");
		}
	}
	if (entity == ENTITY_STOCK)
		$('#' + entity + '-search-ctr').show();

}
var showMenu = function(tab) {
	$('#' + tab + '-menu-ctr').show();
}

// parameter object definition
var param = function(name, value) {
	this.name = name;
	this.value = value;
}

// function to add an entity when user clicks on the add button in UI
var createOrder = function(entity) {
	// creating the data object to be sent to backend
	var data = new Array();
	// collecting the field values from the form
	var formEleList = $('form#' + entity + '-create-form').serializeArray();
	for (var i = 0; i < formEleList.length; i++) {
		data[data.length] = new param(formEleList[i].name, formEleList[i].value);
	}
	// setting action as PUT
	data[data.length] = new param('action', 'PUT');
	// making the ajax call
	$.ajax({
		url : "/" + entity,
		type : "POST",
		data : data,
		success : function(data) {
			showHideCreate(entity, false);
		}
	});
	$('#' + entity + '-reset').click();
}

// entity --> which table
// row --> suvidha? et? logo? which row
// col --> which element to be toggled after upload
// toggleLink --> This is the id of the div that will become link when blob is
// present. Else will be text
// buttonId. Id of the toggle button for upload/delte.
// blobKeyHolder --> The hidden input elemetn that houses blob key
var upload = function(entity, rowId, colId, toggleLink, buttonId, blobKeyHolder) {
	var ids = $('#' + toggleLink).val();
	var token = "";
	var orgBtnVal = $('#' + buttonId).attr('value');
	if (orgBtnVal == 'Upload') {
		var dest = "test.jsp?entity=" + entity + "&rowId=" + rowId + "&colId="
				+ colId + "&blobKeyHolder=" + blobKeyHolder;
		$(
				'<iframe id="upload-dialog-form" class="ui-dialog" src=' + dest
						+ ' />').dialog(
				{
					title : 'Upload Attachment',
					autoOpen : true,
					width : 300,
					height : 200,
					modal : true,
					resizable : true,
					buttons : {
						OK : function() {
							$(this).dialog("close");
						}
					},
					close : function() {
						var token = $('#' + blobKeyHolder).val();
						if (token != "") {
							var orgVal = $('#' + toggleLink).attr('value');
							var htm = '<a target="new" href=serve?blob-key='
									+ token + '>' + orgVal + '</a>';
							$('#' + toggleLink).html(htm);
							$('#' + buttonId).attr('value', 'Delete');
						}
					}
				}).width(300 - 25);
	} else {
		var parameter = new Array();
		var idFeld = $('#billing_Id').val();
		parameter[parameter.length] = new param('command', 'delete');
		parameter[parameter.length] = new param('token', $('#' + blobKeyHolder)
				.val());
		parameter[parameter.length] = new param('entity', entity);
		parameter[parameter.length] = new param('rowId', rowId);
		parameter[parameter.length] = new param('colId', colId);

		$.ajax({
			url : "/test?command=delete&token=" + $('#' + blobKeyHolder).val(),
			type : "GET",
			data : parameter,
			success : function(resp) {
				$('#' + buttonId).val('Upload');
				$('#' + blobKeyHolder).val('');
				var orgVal = $('#' + toggleLink).attr('value');
				var htm = orgVal;
				$('#' + toggleLink).html(htm);
				$('#' + buttonId).attr('value', 'Upload');
				// $("#upload-dialog-form").contents().find("#token").val("")

			}
		});

	}

}

// function to add an entity when user clicks on the add button in UI
var add = function(entity) {
	// $('.message').hide();
	showHideCreate(entity, true);
	resetAll(entity);
	$("span.readonly input").attr('readonly', false);
	$("select[id$=order-customer-list] > option").remove();
	$("select[id$=order-item-list] > option").remove();
	$("select[id$=item-product-list] > option").remove();
	// checking the entity to populate the select box
	if (entity == ENTITY_ITEM) {
		// populating the product and contact by making an ajax call
		populateSelectBox('item-product-list', '/product');
	} else if (entity == ENTITY_ORDER) {
		// populating the customer and item select box by making an ajax call
		// populateSelectBox('order-customer-list', '/customer');
		populateSelectBox('company', '/brand?command=list');
		populateSelectBox(entity + '_company', '/brand?command=list');
		denableOnStatus(entity);
		// clone first row, add listener etc and hide the first one
		// $('#item_pur_add').click();
		$('#item_pur_roz').val("1");
		addNeededChangeListener('#pur_rate');
		addNeededChangeListener('#pur_unit');
		$("#pur_bill_date").datepicker({
			dateFormat : 'yy-mm-dd'
		});
		addNeededAutoComplete('#pur_des', 'purchasedetails');
		// $('#tblPurInvoice tr:first').hide();
		// $('#tblPurInvoice tr:first').remove();
		// $('.orgRow').hide();
		// $('.clone').hide();

	} else if (entity == ENTITY_BILLING) {
		// populateSelectBox('company', '/brand?command=list');
		// populateSelectBox(entity + '_company', '/brand?command=list');
		denableOnStatus(entity);
	} else if (entity == ENTITY_RETURNS) {
		// populateSelectBox('company', '/brand?command=list');
		$('#returns_type').val("quarterly");
		fillItemM1('returns', '', 'new', 'returns_sale_item',
				'tbl_sale_returns_item');
		fillItemM1('returns', '', 'new', 'returns_pur_item',
				'tbl_pur_returns_item');
		fillItemM1('returns', '', 'new', 'returns_pur_inv_item',
				'tbl_pur_inv_returns_item');
		fillItemM1('returns', '', 'new', 'returns_payment_item',
				'tbl_returns_payments_item'); // data
		// has
		// to
		// be
		// "formed".
		// calculateReturnsFig();
		$('#returns_status').val("new");
		denableOnStatus(entity);
	} else if (entity == ENTITY_ANNUAL_RETURNS) {
		$('#annual_returns_status').val('start');
		// denableOnStatus(entity);
		denableOnStatus(entity);

		$('#annual_returns_year').find('option').remove();
		// $("#annual_returns_master").find("tr:gt(2)").hide();
		// $('#annual_retuns_buttons').hide();
		fillItem('annual-returns', 'unfiled_year', 'new', 'tbl_annual_returns');
	} else if (entity == 'products') {
		// populateSelectBox('company', '/brand?command=list');
		/*
		 * fillItemM1('payments', '', '', 'pay_item', 'tbl_pay_item');
		 */

		// fill a <given> select box with <given> column as specified for all
		// rows of a <given> entity
		populateSelectBox('products_category',
				'products?command=edit_new&code=category');
		$('.products_item_cloned').remove();
		denableOnStatus(entity);
	}
}

var denableOnStatus = function(entity) {
	// alert(entity);
	if (entity == 'products') {
		var status = $('#category_status').val();
		// alert(status);
		if (status == '') {
			$('#tbl_products_item').children().find(
					'input[name*="products_attribute_id"]').attr("readonly",
					"readonly");
			$('#tbl_products_item').children().find(
					'input[name*="products_attribute_name"]').attr("readonly",
					"readonly");
			$('#tbl_products_item').children().find(
					'input[name*="products_attribute_type"]').attr("readonly",
					"readonly");
		}
		if (status == 'new') {
			$('#tbl_products_item').children().find(
					'input[name*="products_attribute_id"]').removeattr(
					"readonly");
			$('#tbl_products_item').children().find(
					'input[name*="products_attribute_name"]').removeattr(
					"readonly", "readonly");
			$('#tbl_products_item').children().find(
					'input[name*="products_attribute_type"]').removeattr(
					"readonly", "readonly");
		}

	} else if (entity == ENTITY_BILLING) {
		var status = $('#billing_status').val();
		// alert(status);
		if (status == '') {
			$('#billing_master').find('input').removeAttr("disabled");
			$('#billing_date').datepicker('setDate', '+0');
			$('#billing_Value, #billing_date, #billing_item_total').attr(
					"readonly", "readonly");
			$('#trowbillingDet1, #cancel_billing,#billing_print').hide();
			$('#billing_submit').show();
		}
		if (status == 'Generated') {
			$('#billing_date').datepicker('setDate', '+0');
			$('#billing_master').find('input').attr("disabled", "disabled");
			$('#trowbillingDet,#cancel_billing,#billing_print').show();
			$('#billing_submit').hide();
		}
		if (status == 'Cancelled') {
			$('#trowbillingDet,#cancel_billing').show();
			$('#billing_master').find('input').attr("disabled", "disabled");
			$('#billing_submit,#cancel_billing,#billing_print').hide();
			$('#back_billing').show();
		}

	} else if (entity == ENTITY_PAYMENTS) {
		var status = $('#status').val();
		clearAll(entity);
		if (status == '') {

			$("#payments_include").prop('checked', true).removeAttr("readonly");
			$('#payments_item_code').attr("readonly", "readonly");
			$('.payments_cloned').remove();
			$('#payments_item_code').val('NEW');
			$(
					'#tbl_payments_item,#tbl_payments,#tbl_payments_summary,#tbl_pay_item,#payments_comments')
					.find('input, select').removeAttr("disabled");
			$('#payments_date').datepicker('setDate', '+0');
			$(' #tbl_payments,#tbl_payments_summary').find('input').attr(
					"readonly", "readonly");
			$(
					' #payments_orge,#payments_refno,#payments_amount,#payments_to_account,#tbl_pay_item,#payments_round,#payments_item_total,#payments_comments')
					.removeAttr("readonly");
			$('#cancel_payments, #payments_sms').hide();
			$('#payments_save, #payments_submit').show();

		}
		if (status == 'Saved') {

			$("#payments_include,#pay_include").prop('checked', true)
					.removeAttr("readonly");
			$('#payments_item_code').attr("readonly", "readonly");
			$('.payments_cloned').remove();
			$('#payments_item_code').val('NEW');
			$(
					'#tbl_payments_item,#tbl_payments,#tbl_payments_summary,#tbl_pay_item,#payments_comments')
					.find('input, select').removeAttr("disabled");
			$('#payments_date').datepicker('setDate', '+0');
			$(' #tbl_payments,#tbl_payments_summary').find('input').attr(
					"readonly", "readonly");
			$(
					' #payments_orge,#payments_refno,#payments_amount,#payments_to_account,#tbl_pay_item,#payments_round,#payments_item_total,#payments_comments')
					.removeAttr("readonly");
			$('#payments_saveNsubmit').hide();
			$('#cancel_payments,#payments_submit,#payments_save,#payments_sms')
					.show();

		}

		if (status == 'Submitted') {
			// $('#billing_date').datepicker('setDate', '+0');
			$(
					'#tbl_payments_item, #tbl_payments,#tbl_payments_summary,#tbl_pay_item')
					.find('input,select').attr("disabled", "disabled");
			$('#cancel_payments,#back_payments,#payments_sms').show();
			$('#payments_id').removeAttr('disabled');
			$('#payments_submit,#payments_save').hide();
		}
		if (status == 'Cancelled') {
			// $('#trowbillingDet,#cancel_billing').show();
			$(
					'#tbl_payments_item, #tbl_pay_item,#tbl_payments,#tbl_payments_summary')
					.find('input,select').attr("disabled", "disabled");
			$('#payments_submit,#payments_save,#cancel_payments,#payments_sms')
					.hide();
			$('#back_payments').show();
		}

	} else if (entity == ENTITY_RETURNS) {
		var status = $('#returns_status').val();
		// alert(status);
		if (status == 'new') {
			$(
					'#tbl_returns_payments_item, #tbl_pur_returns_item, #returns_sale_item, #returns_pur_item, #returns_payment_item,#tbl_returns_summary,#tbl_returns,#tbl_sale_returns_item,#tbl_pur_inv_returns_item')
					.find('input, select').removeAttr("disabled");
			$('#returns_date').datepicker('setDate', '+0');
			$(
					'#returns_sale_stock_code, #returns_sale_item_des,#returns_pur_brand,#returns_pur_stock_code,#returns_pur_item_des,#returns_payments_id,#returns_payments_type')
					.find('input').attr("readonly", "readonly");
			$('#returns_submit,#back_returns').show();
			$('#cancel_returns').hide();
		}
		if (status == '') {
			// $('#billing_date').datepicker('setDate', '+0');
			$(
					'#tbl_returns_payments_item, #tbl_pur_returns_item,#tbl_pur_inv_returns_item, #tbl_returns_summary,#tbl_returns,#tbl_sale_returns_item,#tbl_pur_returns_item,#tbl_returns_payments_item,#tbl_sale_returns_item,#tbl_pur_inv_returns_item')
					.find('input,select').attr("disabled", "disabled");
			$('#cancel_returns,#back_payments').show();
			$('#returns_submit').hide();
		}
	} else if (entity == 'annual-returns') {
		var status = $('#annual_returns_status').val();
		if (status == 'start') {
			// $('#annual_returns_year').find('option').remove();
			$('#tbl_annual_returns').find('input,select')
					.removeAttr("disabled");
			$("#annual_returns_master").find("tr:gt(2)").hide();
			$('#annual_retuns_buttons').hide();
		}
		if (status == 'new') {
			$("#annual_returns_master").find("tr:gt(2)").show();
			$('#annual_retuns_buttons').show();
			$(
					'#tbl_annual_returns_payments_item, #tbl_pur_annual_returns_item,#tbl_pur_inv_annual_returns_item, #tbl_annual_returns_summary,#tbl_sale_annual_returns_item,#tbl_pur_annual_returns_item,#tbl_annual_returns_payments_item,#tbl_sale_annual_returns_item,#tbl_pur_inv_annual_returns_item')
					.find('input,select').attr("disabled", "disabled");
			$('#tbl_annual_returns,#tbl_annual_returns_summary').find(
					'input,select').removeAttr("disabled");
			$('#tbl_annual_returns_summary').find('input,select').attr(
					'readonly', 'readonly')
			$('#cancel_annual_returns,#back_payments').hide();
			$('#annual_returns_submit').show();
			$('#returns_date').datepicker('setDate', '+0');
		}
		if (status == 'saved') {
			$("#annual_returns_master").find("tr:gt(2)").show();
			$('#annual_retuns_buttons').show();

			// $('#billing_date').datepicker('setDate', '+0');
			$(
					'#tbl_annual_returns_payments_item, #tbl_pur_annual_returns_item,#tbl_pur_inv_annual_returns_item, #tbl_annual_returns_summary,#tbl_sale_annual_returns_item,#tbl_pur_annual_returns_item,#tbl_annual_returns_payments_item,#tbl_sale_annual_returns_item,#tbl_pur_inv_annual_returns_item')
					.find('input,select').attr("disabled", "disabled");
			$('#tbl_annual_returns').find('input,select')
					.removeAttr("disabled").attr('readonly', 'readonly');
			$('#cancel_annual_returns,#back_payments').show();
			$('#annual_returns_submit').hide();
		}
	}
}

// function to search an entity when user inputs the value in the search box
var search = function(entity) {
	$('.message').hide();
	// collecting the field values from the form
	var formEleList = $('form#' + entity + '-search-form').serializeArray();
	// assigning the filter criteria
	var filterParam = new Array();
	for (var i = 0; i < formEleList.length; i++) {
		filterParam[filterParam.length] = new param(formEleList[i].name,
				formEleList[i].value);
	}
	// calling population of the list through ajax
	populateList(entity, filterParam, 'instantSearch');
}

var showMessage = function(message, entity) {
	$('#' + entity + '-show-message').show().html(
			'<div class="messagebox">' + message + '</div>');
	$('#' + entity + '-show-message').fadeOut(14000, 'swing');

}
var clearMessage = function(entity) {
	$('#' + entity + '-show-message').hide();
}
var formPrint = function(entity) {
	var parameter = new Array();
	var idFeld = $('#billing_code').val();
	parameter[parameter.length] = new param('command', 'printInvoice');
	parameter[parameter.length] = new param('code', idFeld);
	window.open('/invoice?command=printInvoice&billing_no=' + idFeld);

}

var quotePrint = function(entity) {
	var parameter = new Array();
	var idFeld = $('#oppor_code').val();
	parameter[parameter.length] = new param('command', 'printQuote');
	parameter[parameter.length] = new param('code', idFeld);
	window.open('/invoice?command=printQuote&quote_no=' + idFeld);

}

var genET = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genET');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genET&year=' + year + "&quarter=" + quarter);

}
var genCST = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genCST');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genCST&year=' + year + "&quarter=" + quarter);
}

var genRT1 = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genRT1');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genRT1&year=' + year + "&quarter=" + quarter);

}
var genRT1c = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genRT1c');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window
			.open('/invoice?command=genRT1c&year=' + year + "&quarter="
					+ quarter);

}
var genCFormPur = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genCForm');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genCForm&year=' + year + "&quarter="
			+ quarter);

}
var genCFormPurRec = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'writeCFormRecon');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=writeCFormRecon&year=' + year + "&quarter="
			+ quarter);

}
var genETAnnual = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genET');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genETAnnual&year=' + year);

}
var genCSTAnnual = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genCST');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genCSTAnnual&year=' + year);
}

var genRT1Annual = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genRT1');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genRT1Annual&year=' + year);

}
var genRT1cAnnual = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genRT1c');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genRT1cAnnual&year=' + year);

}
var genCFormPurAnnual = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	var quarter = $('#returns_quarter').val();
	parameter[parameter.length] = new param('command', 'genCForm');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=genCFormAnnual&year=' + year);

}
var genCFormPurRecAnnual = function(entity) {
	var parameter = new Array();
	var year = $('#returns_year').val();
	parameter[parameter.length] = new param('command', 'writeCFormRecon');
	parameter[parameter.length] = new param('year', year);
	parameter[parameter.length] = new param('quarter', quarter);
	window.open('/invoice?command=writeCFormReconAnnual&year=' + year);

}

var formValidate = function(entity, action) {
	var key;
	var formEleList = $('form#' + entity + '-create-form').serializeArray();
	key = formEleList[0].value;
	switch (entity) {
	case ENTITY_ITEM:
		var valueProduct = $('#item-product-list').val();
		if (valueProduct == "" || key == "") {
			showMessage('please check the key and Product values in the form',
					entity);
			return;
		}
		break;
	case ENTITY_ORDER:
		var valueCustomer = $('#company').val();
		var valueItem = $('#company').val();
		calculateStockTotal();
		var a = parseInt($('#stock_total').val());
		var b = parseInt($('#orderValue').val());
		var balance = parseInt($('#balance').val());
		var value = parseInt($('#orderValue').val());
		var surcharge = parseInt($('#supSurCharge').val());

		if (valueCustomer == "" || valueItem == "") {
			showMessage('Brand name cannot be blank', entity);
			return;
		} else if ((a + surcharge) != b) {
			showMessage('Stock Price and Order Prices dont match', entity);
			return;
		} else if (!isNaN(balance) && !isNaN(value)) {
			if (value > balance) {
				showMessage('Not enough balance in account for this order',
						entity);
				// return;
			}
		}

		break;
	case ENTITY_CUSTOMER:
		var hasError = false;
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var emailaddressVal = $("#eMail").val();
		if (emailaddressVal == '' || !emailReg.test(emailaddressVal)
				|| key == "") {
			hasError = true;
		}
		if (hasError == true) {
			showMessage('please check the name and email values in the form',
					entity);
			return;
		}
		break;
	case 'oppor':
		reconcileCust($('#oppor_code').val(), 'oppor');
		$('#oppor_status').val('Generated');
		$('#oppor_status').change();
		return;
	case ENTITY_BILLING:
		reconcileCust($('#billing_code').val(), 'billing');
		$('#billing_status').val('Generated');
		$('#billing_status').change();
		break;
	case ENTITY_PAYMENTS:
		if ($('#payments-create-form').valid()) {
			break;
		} else {
			alert('form is not valid');
			return;
		}
		break;
	default:
		if (key == "asdfsdf") {
			showMessage('please check the values in the form', entity);
			return;
		}
		// break;
	}
	save(entity, action);
	$('#' + entity + '-show-message').hide();
}

var reconcileCust = function(id, entity) {
	var data = new Array();
	data[data.length] = new param('command', 'reconCust');
	data[data.length] = new param('code', id);

	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : data,
		success : function(data) {
			showHideCreate(entity, false);
		}
	});
}

// function to save an entity

var save = function(entity, action) {
	// creating the data object to be sent to backend
	// resetAll(entity);
	var data = new Array();
	// collecting the field values from the form
	var formEleList = $('form#' + entity + '-create-form').serializeArray();
	for (var i = 0; i < formEleList.length; i++) {
		data[data.length] = new param(formEleList[i].name, formEleList[i].value);
	}
	// setting action as PUT
	if ((typeof action === "undefined") || ((action == ''))) {
		action = 'PUT';

	}
	data[data.length] = new param('action', action);

	// making the ajax call
	$.ajax({
		url : "/" + entity,
		type : "POST",
		data : data,

		success : function(resp) {
			var tags = JSON.parse(resp);
			if (tags.data[0].responseType == 'ERROR') {
				denableOnStatus(entity);
				showMessage(tags.data[0].message, entity);
			} else if (tags.data[0].responseType == 'INFO') {
				// var data = resp.data;
				// $(statusField).val(eval('data[0].' + statusDataName));
				// denableOnStatus(entity);
				denableOnStatus(entity);
				showMessage(tags.data[0].message, entity);
			} else {
				// $(statusField).val(eval('data[0].' + statusDataName));
				denableOnStatus(entity);
				showHideCreate(entity, false);
				showMessage(tags.data[0].message, entity);
			}
			showHideCreate(entity, false);
			showMessage(tags.data[0].message, entity);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
			alert(errorThrown.data[0].message);
			if (errorThrown.responseType == 'ERROR') {
				showMessage(entity, errorThrown.data[0].message)
			}
		}

	});
	// $('#' + entity + '-reset').click();
}

// function to edit entity: Will find each form element and will try to find out
// eqv data element with same name in Json reponse. If found, text filed
// will be populated with this value. ALso, will check if there is a toggle div
// element and upload button for blobs. If found, with name extension of
// _Tlink and _Tbutton, div will be converted to link and upload button will
// have label for delete
var edit = function(entity, id) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'edit');
	parameter[parameter.length] = new param('code', id);
	$
			.ajax({
				url : "/" + entity,
				type : "GET",
				data : parameter,
				success : function(resp) {
					// var resp = $.parseJSON(resp);
					var data = resp.data[0];
					var formElements = $('form#' + entity
							+ '-create-form :input');
					for (var i = 0; i < formElements.length; i++) {
						if (formElements[i].type != "button") {
							var ele = $(formElements[i]);

							if (ele.attr('name') == "product") {
								$("select[id$=item-product-list] > option")
										.remove();
								if (eval('data.' + ele.attr('name')) != null) {
									ele.append('<option value="'
											+ eval('data.' + ele.attr('name'))
											+ '">'
											+ eval('data.' + ele.attr('name'))
											+ '</option>');
								}
							} else {
								if (data instanceof Object) {

									$("#" + entity + "_code").val(data.name);
									ele.val(eval('data.' + ele.attr('name')));
									var tid = $(formElements[i]).attr('id')
											+ "_Tlink";
									if (($('#' + tid).length != 0)
											&& (ele.val() != null)
											&& (ele.val() != '')) {
										var orgVal = $(
												'#'
														+ ($(formElements[i])
																.attr('id') + "_Tlink"))
												.attr('value');
										var htm = '<a target="new" href=serve?blob-key='
												+ ele.val()
												+ '>'
												+ orgVal
												+ '</a>';
										$(
												'#'
														+ $(formElements[i])
																.attr('id')
														+ '_Tbutton').attr(
												'value', 'Delete');
										$(
												'#'
														+ ($(formElements[i])
																.attr('id') + "_Tlink"))
												.html(htm);
									}
								}
							}
						}
					}
					showHideCreate(entity, true);
					// $("span.readonly input").attr('readonly', true);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});
}

/*
 * extract each element of a table one by one, find matching element in Json
 * reponse and populate as per name match. if name of the form elemetn is
 * "name", put value of tableID as JSON reponse id field If name of hte form
 * element is "***_code", populate this field with id of Jason reponse
 */
var dupWithId = (function(data, table, displayItem) {
	var i = 1;
	var vl = 0;
	var curId = '';
	$('#' + table).find('input').each(function() {
		$(this).attr({
			'id' : function(_, id) {
				curId = id;
				return id
			},
			'name' : function(_, name) {
				if (data != null) {
					vl = eval('data.' + name);
				}
				if (name == 'name') {
					$('#' + table + 'Id').val(vl);
				}
				if (name.indexOf("_code") != -1) {
					vl = data.name;
				}

				// alert('elemtn name --> '+name);
				return name
			},
			'value' : function(_, id) {
				// alert('value -->'+vl);
				$('#' + curId).val(vl);
				$(this).val(vl);
				return vl

			}
		});
	});

	$('#' + table).find('select').each(
			function() {
				var options = eval('data.' + ($(this).attr('name')));
				var arr = options.split(",");
				var seloption = "";
				if (arr[0] != '') {
					$(this).append(new Option(arr[0], arr[0]));
				}
				$.each(arr, function(i) {
					seloption += '<option value="' + arr[i] + '">' + arr[i]
							+ '</option>';
				});

				$(this).append(seloption);
				$(this).val(options.split(","));

			});

	$('#' + table)
			.find('a')
			.each(
					function() {
						// $('#gl').html('<a target="new"
						// href=serve?blob-key='+data[0].suvidha+'>Suvidha</a>');
						var curId = '';
						$(this)
								.attr(
										{
											'id' : function(_, id) {
												curId = id;
												if ((curId != null)
														&& (curId != '')
														&& (eval('data.'
																+ curId)) != null) {
													var htm = '<a target="new" href=serve?blob-key='
															+ eval('data.'
																	+ curId)
															+ '>Uploaded Form</a>'
													$(this).html(htm);
												}
												return id;
											}
										});
					});

	$('#item_roz').val(i);
	i++;
});

// when eleement ID are also unique as well as their names
var dupWithIdMUNQ = (function(data, table, displayItem) {
	var vl = 0;
	var i = $('#item_pur_roz').val();
	var curId = '';
	var curName = '';

	$('#' + table + ' tr').eq('1').clone().find('input,a').each(
			function() {
				$(this).attr({
					'id' : function(_, id) {
						curId = id;
						return id + i;
					},
					'name' : function(_, name) {
						if (data != null) {
							vl = eval('data.' + name);
						}
						curName = name + i;
						return name + i
					},
					'value' : function(_, id) {
						$(this).val(vl);
						return vl
					},
					'title' : function(_, id) {
						return vl
					}
				});
				$(this).addClass('clone');
				if ($(this).attr("id").indexOf('pur_des') >= 0) {
					addNeededAutoComplete($(this), "purchasedetails");
				}
				if (($(this).attr("id").indexOf('pur_rate') >= 0)
						|| ($(this).attr("id").indexOf('pur_unit') >= 0)) {
					addNeededChangeListener($(this));
				}
				if ($(this).attr("id") == 'pur_bill_date' + i) {
					$(this).removeClass('hasDatepicker');
					$(this).datepicker({
						dateFormat : 'yy-mm-dd'
					});
				}

			}).end().appendTo('#' + table).find('td').each(function() {
		$(this).attr({
			'class' : displayItem + '_cloned'
		})
	});
	if (i == "") {
		i = 0;
	}
	i++;
	$('#item_pur_roz').val(i);

});

/*
 * This is supposed to be most generic multiple item filling function. Data will
 * have one row and haev id allocated this will enable identification at servlet
 * layer which will help autosave content repeatedly. The rows would be
 * generated on-the-fly by cloning last row. data population woudl be based on
 * id match. name would be orgelementName+dataID. action listener and change
 * listeners are added accordingly data -> ajax reponse table -> which will
 * house the data elements
 * 
 */
var dupWithIdMG = (function(data, table) {
	var vl = 0;
	var curId = '';
	var curName = '';
	var dataId = data.name;
	alert(dataId);
	// $("input[name=" + table+'_id'+data.name + "]").val(data.name);
	$('#' + table + ' tr:last').show();
	$('#' + table + ' tr:last')
			.clone()
			.find('input,a,select,div')
			.each(
					function() {
						$(this)
								.attr(
										{
											'id' : function(_, id) {
												curId = id;
												if ($(this).is("a")
														&& (data != null)) {
													if ((curId != null)
															&& (curId != '')
															&& (eval('data.'
																	+ curId)) != null
															&& ((eval('data.'
																	+ curId)) != "")
															&& (eval(
																	'data.'
																			+ curId)
																	.indexOf(
																			'~image~') >= 0)) {
														var htm = '<a target="new" href=serve?blob-key='
																+ eval(
																		'data.'
																				+ curId)
																		.replace(
																				'~image~',
																				'')
																+ '>Download</a>';
														$(this).html(htm);
													}
												}
												return id
											},
											'name' : function(_, name) {
												if (($(this).is("div"))
														&& (data != null)) {
													// $(this).show();
													if (!(typeof eval('data.'
															+ '__select__'
															+ name) === "undefined")) {
														vl = eval('data.'
																+ '__select__'
																+ name)
																+ '';
														var htm = '<select ><option> Text</option><option selected> Image</option></select>'
													}

													// image handling
													else if (!(typeof eval('data.'
															+ '__image__'
															+ name) === "undefined")) {
														vl = eval('data.'
																+ '__image__'
																+ name)
																+ '';
														if (vl
																.indexOf('~image~') >= 0) {
															vlx = vl.replace(
																	'~image~',
																	'');
															var htm = '<img target="new" src=serve?blob-key='
																	+ vlx
																	+ '></img>'
														}
													}

													else if (!(typeof eval('data.'
															+ '__text__' + name) === "undefined")) {
														vl = eval('data.'
																+ '__text__'
																+ name)
																+ '';
														if (vl
																.indexOf('~text~') >= 0) {
															vl = vl.replace(
																	'~text~',
																	'');
															// this line will go
															// as value will
															// not store image
															// code away
														}
														var htm = '<input id="'
																+ name + '"'
																+ ' name="'
																+ name + '"'
																+ ' value="'
																+ vl
																+ '"></input>';
														// alert('html --> ' +
														// htm);

													} else {
														// no type coding
														vl = eval('data.'
																+ name);
														var htm = '<input id="'
																+ name + '"'
																+ ' name="'
																+ name + '"'
																+ ' value="'
																+ vl
																+ '"></input>';
													}
													$(this).html(htm);
												}
												curName = name + i;
												return name + dataId;
											},
											'value' : function(_, id) {
												// $(this).val(vl);
												// alert(vl);
												// return vl
											},
											'title' : function(_, id) {
												return vl
											}
										});
						addNeededChangeListener($(this));
						// addNeededAutoCompleteG($(this));

					}).end().appendTo('#' + table).find('td').each(function() {
				$(this).attr({
					'class' : table + '_cell_cloned'
				})
			});
	addChangeListener(i);
	// makeAutoComplete("type1", "pl", i);
	// makeAutoComplete("billing_item_des", "stock", i);
	i = parseInt('0' + $('#' + table + '_roz').val()) + 1;

	$('#' + table + '_roz').val(i);
	$('#' + table + ' tr:last').hide();
});

var i = 1;
var dupWithIdM = (function(data, table, displayItem) {
	var vl = 0;
	var curId = '';
	var curName = '';
	var roz1 = '#' + table + '_roz';
	i = $(roz1).val();
	$('#' + table + ' tr:last')
			.clone()
			.find('input,a,select,div')
			.each(
					function() {
						$(this)
								.attr(
										{
											'id' : function(_, id) {
												curId = id;
												if ($(this).is("a")
														&& (data != null)) {
													if ((curId != null)
															&& (curId != '')
															&& (eval('data.'
																	+ curId)) != null
															&& (eval('data.'
																	+ curId)) != ""
															&& ((eval('data.'
																	+ curId))
																	.indexOf('~image~') >= 0)) {

														var htm = '<img target="new" src=serve?blob-key='
																+ eval(
																		'data.'
																				+ curId)
																		.replace(
																				'~image~',
																				'')
																+ '>Download</a>'

														$(this).html(htm);
													}
												}
												return id
											},
											'name' : function(_, name) {
												// alert('name -->' + 'data.' +
												// '__text__' +
												// name);
												// alert('data mein hai?? -->' +
												// eval('data.' +
												// '__text__' + name));

												// $('#' + table
												// ).find('[name='+name+']').hide();
												if (($(this).is("div"))
														&& (data != null)) {
													// $(this).show();
													if (!(typeof eval('data.'
															+ '__select__'
															+ name) === "undefined")) {
														vl = eval('data.'
																+ '__select__'
																+ name)
																+ '';
														var arr = vl.split("_");
														var counter = 0;
														$
																.each(
																		arr,
																		function(
																				i) {
																			if (counter == 0) {
																				seloption = '<option selected value="'
																						+ arr[0]
																						+ '">'
																						+ arr[0]
																						+ '</option>';
																			}
																			if ((counter != 0)
																					&& (arr[i] != arr[0])) {
																				seloption += '<option value="'
																						+ arr[i]
																						+ '">'
																						+ arr[i]
																						+ '</option>';
																			}
																			counter++;
																		});
														var htm = '<select id="'
																+ name
																+ '"'
																+ ' name="'
																+ name
																+ i
																+ '">'
																+ seloption
																+ '</select>';
													}

													// image handling
													else if (!(typeof eval('data.'
															+ '__image__'
															+ name) === "undefined")) {
														vl = eval('data.'
																+ '__image__'
																+ name)
																+ '';
														if (vl
																.indexOf('~image~') >= 0) {
															vl = vl.replace(
																	'~image~',
																	'');
														}
														var htm = '<input type="hidden" id="'
																+ name
																+ '"'
																+ ' name="'
																+ name
																+ i
																+ '"'
																+ ' value="'
																+ vl
																+ '"></input>'
																+ '<img width="100" height="100"  target="new" src=serve?blob-key='
																+ vl
																+ '></img>'
																+ '<input type=file id="'
																+ name
																+ '"'
																+ ' name="'
																+ name
																+ i
																+ '"'
																+ ' value="'
																+ vl
																+ '"></input>'
													}

													else if (!(typeof eval('data.'
															+ '__text__' + name) === "undefined")) {
														vl = eval('data.'
																+ '__text__'
																+ name)
																+ '';
														if (vl
																.indexOf('~text~') >= 0) {
															vl = vl.replace(
																	'~text~',
																	'');
															// this line will go
															// as value will
															// not store image
															// code away
														}
														var htm = '<input class="gsc-input-autocomplete" id="'
																+ name + '"'
																+ ' name="'
																+ name + i
																+ '"'
																+ ' value="'
																+ vl
																+ '"></input>';
														// alert('html --> ' +
														// htm);

													} else if (!(typeof eval('data.'
															+ '__number__'
															+ name) === "undefined")) {
														vl = eval('data.'
																+ '__number__'
																+ name)
																+ '';
														var htm = '<input id="'
																+ name + '"'
																+ ' name="'
																+ name + i
																+ '"'
																+ ' value="'
																+ vl
																+ '"></input>';
														// alert('html --> ' +
														// htm);

													} else if (!(typeof eval('data.'
															+ '__checkbox__'
															+ name) === "undefined")) {
														vl = eval('data.'
																+ '__checkbox__'
																+ name)
																+ '';
														if (vl == 'on') {
															var htm = '<input type="checkbox" id="'
																	+ name
																	+ '"'
																	+ ' name="'
																	+ name
																	+ i
																	+ '" CHECKED "></input>';

														} else {
															var htm = '<input type="checkbox" id="'
																	+ name
																	+ '"'
																	+ ' name="'
																	+ name
																	+ i
																	+ '" ></input>';
														}
													} else {
														// no type coding
														vl = eval('data.'
																+ name);
														var htm = '<input id="'
																+ name + '"'
																+ ' name="'
																+ name + i
																+ '"'
																+ ' value="'
																+ vl
																+ '"></input>';
													}
													$(this).html(htm);
												}
												curName = name + i;
												return name + i;
											},
											'value' : function(_, id) {
												// $('input[name=' + curName +
												// ']').val(vl);
												// $(this).val(vl);
												// $("#payments_roz").val(i); //
												// make it more generic for all
												// entities
												// $('#' + curId).val(vl);
												// return vl

											},
											'title' : function(_, id) {
												return vl

											}
										});
						addNeededChangeListener($(this));
						// addNeededAutoComplete($(this), 'purchasedetails');

					}).end().appendTo('#' + table).find('td').each(function() {
				$(this).attr({
					'class' : displayItem + '_cloned'
				})
			});
	// addChangeListener(i);
	makeAutoComplete("type1", "pl", i);
	// makeAutoComplete("billing_item_des", "stock", i);
	i++;
	$(roz1).val(i);
	$('#item_roz').val(i);
	$('#item_pur_roz').val(i);

});

var addNeededChangeListener = function(element) {
	$(element)
			.change(
					function() {
						var eleId = $(element).attr('id');
						var eleName = $(element).attr('id')
								+ '_org'
								+ $(element).attr('name').replace(
										$(element).attr('id'), "");
						if ((eleId == "returns_sale_net_selling_price")
								|| (eleId == "returns_pur_vat_appl")
								|| (eleId == "returns_sale_output_vat")
								|| (eleId == "returns_sale_vat_appl")
								|| (eleId == "returns_pur_inv_vat_appl")
								|| (eleId == "returns_pur_inv_is_cnf")
								|| (eleId == "returns_pur_inv_net_cost_price")
								|| (eleId == "returns_pur_inv_input_vat")
								|| (eleId == "returns_pur_inv_et")
								|| (eleId == "returns_pur_inv_tot")
								|| (eleId == "returns_pur_is_cnf")
								|| (eleId == "returns_pur_net_cost_price")
								|| (eleId == "returns_pur_input_vat")
								|| (eleId == "returns_pur_et")
								|| (eleId == "returns_payments_amount")
								|| (eleId == "returns_sale_include")
								|| (eleId == "returns_pur_include")
								|| (eleId == "returns_payments_include")) {
							calculateTaxSum();
						}

						if ((eleId == "returns_sale_net_selling_price")
								|| (eleId == "returns_pur_vat_appl")
								|| (eleId == "returns_sale_output_vat")
								|| (eleId == "returns_pur_vat_appl")
								|| (eleId == "returns_sale_output_vat")
								|| (eleId == "returns_pur_vat_appl")
								|| (eleId == "returns_pur_input_vat")
								|| (eleId == "returns_pur_et")
								|| (eleId == "returns_payments_amount")

								|| (eleId == "returns_sale_sale_date")
								|| (eleId == "returns_sale_billNo")
								|| (eleId == "returns_pur_is_cnf")
								|| (eleId == "returns_pur_bill_no")
								|| (eleId == "returns_pur_recieve_date")
								|| (eleId == "returns_pur_net_cost_price")
								|| (eleId == "returns_sale_vat_appl")
								|| (eleId == "returns_payments_date")) {
							var orgVal = $('input[name="' + eleName + '"]')
									.val();
							var curVal = $(element).val();
							if (orgVal != curVal) {
								$(element).attr("Title",
										"Original Value: " + orgVal);
								$(element).tooltip({
									content : "Original Value: " + orgVal
								});
								$(element).tooltip("option", "show", {
									effect : "blind",
									duration : 0
								});
								$(element).tooltip({
									tooltipClass : "error"
								});
								// alert('change change');
								$(element).addClass("error");
							} else {
								$(element).removeClass("error");
							}

						}
						if ((eleId.indexOf("billing_item_vat_appl") >= 0)
								|| (eleId.indexOf("billing_item_total") >= 0)
								|| (eleId.indexOf("billing_item_des") >= 0)
								|| (eleId.indexOf("billing_item_stockcode") >= 0)
								|| (eleId.indexOf("billing_item_rate") >= 0)
								|| (eleId.indexOf("billing_item_quantity") >= 0)
								|| (eleId.indexOf("billing_item_vat_appl") >= 0)) {
							var id = $(element).attr('id');
							var nme = $(element).attr('name');
							var rowId = nme.substr(id.length, nme.length);
							calculateBillSum();
							autoSaveGroup('billing_item_brand' + rowId
									+ ',billing_item_des' + rowId
									+ ',billing_item_rate' + rowId
									+ ',billing_item_quantity' + rowId
									+ ',billing_item_total' + rowId
									+ ',billing_item_sp_net' + rowId
									+ ',billing_item_vat' + rowId
									+ ',billing_item_vat_appl' + rowId
									+ ',billing_item_stockcode' + rowId,
									'billingitem', 'name' + rowId);
							autoSaveGroup(
									'billing_Value,billing_vat,billing_value_net,vat_appl,billing_status,billing_date,billing_brand,billing_summ',
									'billing', 'billing_code');

							// autosave

						}
						;

						if ((eleId.indexOf("oppor_item_vat") >= 0)
								|| (eleId.indexOf("oppor_item_vat_appl") >= 0)
								|| (eleId.indexOf("oppor_item_net_price") >= 0)
								|| (eleId.indexOf("oppor_item_gross_price") >= 0)
								|| (eleId.indexOf("oppor_item_des") >= 0)
								|| (eleId.indexOf("oppor_item_rate") >= 0)
								|| (eleId.indexOf("oppor_item_brand") >= 0)
								|| (eleId.indexOf("oppor_item_unit") >= 0)) {
							var id = $(element).attr('id');
							var nme = $(element).attr('name');
							var rowId = nme.substr(id.length, nme.length);
							calculateOppSum();
							// $("#oppor_gross_value").change();

							autoSaveGroup('oppor_item_vat' + rowId
									+ ',oppor_item_vat_appl' + rowId
									+ ',oppor_item_net_price' + rowId
									+ ',oppor_item_gross_price' + rowId
									+ ',oppor_item_des' + rowId
									+ ',oppor_item_brand' + rowId
									+ ',oppor_item_rate' + rowId
									+ ',oppor_item_net_rate' + rowId
									+ ',oppor_item_unit' + rowId, 'opporitem',
									'name' + rowId);
							autoSaveGroup(
									'oppor_summ, oppor_brand, oppor_owner, oppor_gross_value,oppor_vat,oppor_net_value,oppor_tax,oppor_status,oppor_date',
									'oppor', 'oppor_code');

							// autosave almost whole of form

						}
						;

						if ((eleId.indexOf("products_attribute_type") >= 0)) {
							var id = $(element).attr('id');
							var nme = $(element).attr('name');
							var rowId = nme.substr(id.length, nme.length);
							var par = $(element).find('option:selected').text();
							if (($.trim(par) == "Text")
									|| ($.trim(par) == "Number")) {
								// alert($('#products_attribute_value' +
								// rowId).find('div').html());
								$(
										'div[name="products_attribute_value'
												+ rowId + '"]')
										.html(
												'<input type="text" id="products_attribute_value"'
														+ ' name="products_attribute_value'
														+ rowId
														+ '" value=""></input>');

								// $('#products_attribute_file_value' +
								// rowId).hide();

							} else {
								$(
										'div[name="products_attribute_value'
												+ rowId + '"]')
										.html(
												'<input type="file" id="products_attribute_value"'
														+ ' name="products_attribute_value'
														+ rowId
														+ '" value=""></input>');

							}
							// autosave almost whole of form

						}
						;
						if ((eleId.indexOf("pur_unit") >= 0)
								|| (eleId.indexOf("pur_rate") >= 0)) {
							calculatePurSum();
						}
						;
					});

};

var fireReq = function(type, entity) {
	var parameter = new Array();
	if (type == 'regenstockreport') {
		parameter[parameter.length] = new param('type', 'regenstockreport');
	}
	if (type == 'regensalesreport') {
		parameter[parameter.length] = new param('type', 'regensalesreport');
		parameter[parameter.length] = new param('sale_report_month', $(
				'#sale_report_month').val());
		parameter[parameter.length] = new param('sale_report_year', $(
				'#sale_report_year').val());

	}

	$.ajax({
		url : "/generatereport",
		type : "GET",
		data : parameter,
		success : function(resp) {
			var tags = JSON.parse(resp);
			showMessage(tags.data[0].message, entity);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
}

var editM = function(entity, id) {
	if (entity == 'products') {
		// resetAll(entity);
		fillItemM(entity, id, 'item', 'tbl_products_item');
		denableOnStatus(entity);
	} else if (entity == ENTITY_BILLING) {
		$('.tbl_billing_item_cell_cloned').remove();
		fillItem(entity, id, 'billing', 'tbl_billing');
		fillItem(entity, id, 'billing', 'tbl_billing_cust');
		fillItemMG('billingitem', id, 'billing_item', 'tbl_billing_item');
		// denableOnStatus(entity);
	} else if (entity == 'customer') {
		$('.tbl_customer_pur_item_cell_cloned').remove();
		$('.tbl_customer_oppor_item_cell_cloned').remove();
		$('.tbl_customer_comlog_cell_cloned').remove();

		fillItem(entity, id, 'customer', 'tbl_customer_cust');
		// fillItemMG(entity, id, 'purchase', 'tbl_customer_pur_item');
		// fillItemMG(entity, id, 'opportunity', 'tbl_customer_oppor_item');
		fillItemMG(entity, id, 'comlog', 'tbl_customer_comlog');
		denableOnStatus(entity);
	} else if (entity == 'oppor') {
		$('.tbl_oppor_item_cell_cloned').remove();
		$('.oppor_item_cloned').remove();
		fillItem(entity, id, 'oppor', 'tbl_oppor');
		fillItem(entity, id, 'oppor', 'tbl_oppor_cust');
		fillItemMG('opporitem', id, 'oppor_item', 'tbl_oppor_item');
		// fillItemM(entity, id, 'oppor_item', 'tbl_oppor_item');
		$('#oppor_roz').val("1");
		denableOnStatus(entity);
	} else if (entity == 'work') {
		fillItem(entity, id, 'work', 'tbl_work_det');
		denableOnStatus(entity);
	} else if (entity == ENTITY_PAYMENTS) {
		// resetAll(entity);
		$('.payments_cloned').remove();
		// populateSelectBox('payments_to_account', '/brand?command=list');
		$('#tbl_payments_item_roz,#tbl_pay_item').val('1')
		fillItem(entity, id, 'payments', 'tbl_payments');
		fillItem(entity, id, 'payments', 'tbl_payments_summary');
		fillItemM(entity, id, 'payments_item', 'tbl_payments_item');
		fillItemM(entity, id, 'pay_item', 'tbl_pay_item');
		denableOnStatus(entity);
	} else if (entity == ENTITY_RETURNS) {
		// resetAll(entity);
		$('.returns_cloned').remove();
		// populateSelectBox('payments_to_account', '/brand?command=list');
		fillItem(entity, id, 'returns', 'tbl_returns');
		fillItem(entity, id, 'returns', 'tbl_returns_summary');
		fillItemM1(entity, id, '', 'returns_pur_item', 'tbl_pur_returns_item');
		fillItemM1(entity, id, '', 'returns_pur_inv_item',
				'tbl_pur_inv_returns_item');
		fillItemM1(entity, id, '', 'returns_sale_item', 'tbl_sale_returns_item');
		fillItemM1(entity, id, '', 'returns_payment_item',
				'tbl_returns_payments_item');
		$('#returns_status').val('');
		denableOnStatus(entity);
	} else if (entity == 'annual-returns') {
		fillItemM1(entity, id, 'new', 'returns_sale_item',
				'tbl_sale_annual_returns_item');
		fillItemM1(entity, id, 'new', 'returns_pur_item',
				'tbl_pur_annual_returns_item');
		fillItemM1(entity, id, 'new', 'returns_pur_inv_item',
				'tbl_pur_inv_annual_returns_item');
		fillItemM1('annual-returns', id, 'new', 'returns_payment_item',
				'tbl_annual_returns_payments_item'); // data
		// fillItemM1('annual-returns', $(this).val(), 'new', 'returns_summary',
		// 'tbl_annual_returns_summary'); // data
		fillItem(entity, id, 'returns_summary', 'tbl_annual_returns_summary');
		fillItem(entity, id, 'returns_summary', 'tbl_annual_returns');
		$('#annual_returns_status').val('saved');
		denableOnStatus(entity);
	}

	//

}
/*
 * this will fetch multiple data item from db for a given id and will populate
 * table rows agaisnt each datarow
 */
// entity--> will call the servelet
// id --> eg. this is orderid for order items list
// displayItem --> in order table, this is "stock" or "item". . command
// differentiator in servlet..eg edit_items
// a class _cloned is formed and appended to each cloned row to give handle
// displayTable --> id of table that will hold the values
var fillItemMG = function(entity, id, displayItem, displayTable) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'edit_' + displayItem);
	parameter[parameter.length] = new param('code', id);
	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			$('.' + displayItem + '_cloned').remove();
			$('#trow:gt(0)').empty();
			var data = resp.data;
			i = 1; // resets counter of rows to zero. should come from item_roz
			// ideally
			for (var j = 0; j < resp.data.length; j++) {
				var data = resp.data[j];
				// alert('dataelement'+resp.data[j]);
				dupWithIdMG(resp.data[j], displayTable, displayItem);
				// dupWithIdM(resp.data[j], displayTable, displayItem + "_org");
			}
			showHideCreate(entity, true);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
}
/*
 * this will fetch multiple data item from db for a given id and will populate
 * table rows agaisnt each datarow
 */
// entity--> will call the servelet
// id --> eg. this is orderid for order items list
// displayItem --> in order table, this is "stock" or "item". . command
// differentiator in servlet..eg edit_items
// a class _cloned is formed and appended to each cloned row to give handle
// displayTable --> id of table that will hold the values
var fillItemM = function(entity, id, displayItem, displayTable) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'edit_' + displayItem);
	parameter[parameter.length] = new param('code', id);
	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			// $('.' + displayItem + '_cloned').remove();
			// $('.' + displayTable + '_cloned').remove();
			// $('#trow:gt(0)').empty();
			var data = resp.data;
			// alert(entity);
			i = 1; // resets counter of rows to zero. should come from item_roz
			// ideally
			for (var j = 0; j < resp.data.length; j++) {
				var data = resp.data[j];
				// alert('dataelement'+resp.data[j]);
				dupWithIdM(resp.data[j], displayTable, displayItem);
				// dupWithIdM(resp.data[j], displayTable, displayItem + "_org");
			}
			showHideCreate(entity, true);
			denableOnStatus(entity);

		}
	});
}
var fillItemMUNQ = function(entity, id, displayItem, displayTable) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'edit_' + displayItem);
	parameter[parameter.length] = new param('code', id);
	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			$('.' + displayItem + '_cloned').remove();
			$('#trow:gt(0)').empty();
			var data = resp.data;
			// alert(entity);
			i = 1; // resets counter of rows to zero. should come from item_roz
			// first row has to be manuall y populated
			$('#item_pur_roz').val("1");
			addNeededChangeListener('#pur_rate');
			addNeededChangeListener('#pur_unit');
			$("#pur_bill_date").datepicker({
				dateFormat : 'yy-mm-dd'
			});
			addNeededAutoComplete('#pur_des', 'purchasedetails');

			// ideally
			for (var j = 0; j < resp.data.length; j++) {
				var data = resp.data[j];
				dupWithIdMUNQ(resp.data[j], displayTable, displayItem);
				// dupWithIdM(resp.data[j], displayTable, displayItem + "_org");
			}
			showHideCreate(entity, true);
		}
	});
}
// fillItemM1('payments', 'find', par, 'payments_item','tbl_payments_item');
var fillItemM1 = function(entity, id, par, displayItem, displayTable) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'edit_' + displayItem);
	parameter[parameter.length] = new param('code', id);
	parameter[parameter.length] = new param('par', par);
	$('.payments_item_cloned').remove();
	$('#payments_roz').val('0');

	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			$('.' + displayItem + '_cloned').remove();
			$('#trow:gt(0)').empty();
			var data = resp.data;
			// alert(entity);
			i = $("#" + displayTable + "_roz").val();// resets counter of
			// rows to zero. should
			// come from item_roz
			// ideally
			populateSelectBoxLocal('payments_to_account', resp,
					'payments_account');
			for (var j = 0; j < resp.data.length; j++) {

				var data = resp.data[j];
				// alert('dataelement'+resp.data[j]);
				dupWithIdM(resp.data[j], displayTable, displayItem);
				i = i + 1;
			}
			$("#payments_roz").val(i);
			$("#" + displayTable + "_roz").val(i);

			showHideCreate(entity, true);
			if (par == "new") {
				calculateTaxSum();
			}
		},
		error : function(data, textStatus, errorThrown) {
			alert(textStatus);
		}
	});
}

var fillItem = function(entity, id, displayItem, displayTable) {
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'edit_' + displayItem);
	parameter[parameter.length] = new param('code', id);
	// alert(entity);
	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			var data = resp.data;
			// alert('data for '+displayTable);
			for (var j = 0; j < resp.data.length; j++) {
				var data = resp.data[j];
				// alert('dataelement'+resp.data[j]+ displayTable+ displayItem);
				dupWithId(resp.data[j], displayTable, displayItem);
			}
			denableOnStatus(entity);
			showHideCreate(entity, true);
		}
	});
}

// function called when user clicks on the cancel button
var cancel = function(entity) {
	$('.message').hide();
	// hiding the create container in the tab
	showHideCreate(entity, false);
}

var deleteEntityG = function(entity, id) {
	var parameter = new Array();
	parameter[parameter.length] = new param('id', $('#' + id).val());
	parameter[parameter.length] = new param('action', 'delete'); // one day
	// making the ajax call
	$.ajax({
		url : "/" + entity,
		type : "POST",
		data : parameter,
		dataType : "html",
		success : function(resp) {
			showHideCreate(entity, false);
			if (resp != '') {
				showMessage(resp, entity);
			}

		},
		error : function(resp) {
			showMessage(resp, entity);
		}
	});
}
// function to delete an entity
var deleteEntity = function(entity, id, parentid) {
	var parameter = new Array();
	parameter[parameter.length] = new param('id', id);
	parameter[parameter.length] = new param('parentid', parentid);
	parameter[parameter.length] = new param('action', 'DELETE'); // one day
	// remove
	// this
	parameter[parameter.length] = new param('command', 'DELETE');
	// making the ajax call
	$.ajax({
		url : "/" + entity,
		type : "POST",
		data : parameter,
		dataType : "html",
		success : function(resp) {
			showHideCreate(entity, false);
			if (resp != '') {
				showMessage(resp, entity);
			}

		},
		error : function(resp) {
			showMessage(resp, entity);
		}
	});
}

var clearAll = function(entity) {
	$('.message,.error').hide();
}
var resetAll = function(entity) {
	$('.message,.error').hide();
	$('#' + entity + '-create-form').find('input[type=text]').removeAttr(
			"disabled");
	$('#submit').show();
	$('#backOrder').show();
	// $('input [class~="_cloned"]').remove(); //this should take care of below
	// lines
	$('.stock_cloned').remove();
	$('#tblPurInvoice').find("tr:gt(1)").remove();
	$('.payments_cloned').remove();
	$(
			'.item_cloned , .billing_cloned, .billing_item_cloned,.payments_item_cloned')
			.remove();
	$('#' + entity + '-create-form').find('input[type=text]').val("");
	$('#status').val('');
	$('#item_roz,#payments_roz,#item_pur_roz').val('0');
	$('#returns_status').val('');
}
var cancelord = function(entity) {

	if (entity == ENTITY_ORDER) {
		var idFeld = '#tblOrderId';
		var statusField = '#orderStatus'
		var statusDataName = 'orderStatus'
	} else if (entity == ENTITY_BILLING) {
		var idFeld = '#billing_code';
		var statusField = '#billing_status'
		var statusDataName = 'billing_status';
	} else if (entity == ENTITY_PAYMENTS) {
		var idFeld = '#payments_id';
		var statusField = '#status'
		var statusDataName = 'status';
	}
	var orderId = $(idFeld).val();
	showMessage('Cancelling ' + entity, entity);
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'cancel');
	parameter[parameter.length] = new param(entity, $(idFeld).val());
	$.ajax({
		url : "/" + entity,
		type : "GET",
		data : parameter,
		success : function(resp) {
			if (resp.data[0].responseType == 'ERROR') {
				// showMessage(entity,"asdf")
				showMessage(resp.data[0].message, entity);

			} else {

				var data = resp.data;
				$(statusField).val(eval('data[0].' + statusDataName));
				denableOnStatus(entity);
				showMessage('Data saved succesfully !!!', entity);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
			if (errorThrown.responseType == 'ERROR') {
				// showMessage(entity, errorThrown.data[0].message)
			}
		}
	});
}

var cancelOrder = function() {
	var orderId = $('#tblOrderId').val();
	showMessage('Saving...', 'order');
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'cancel');
	parameter[parameter.length] = new param('order', $('#tblOrderId').val());
	$.ajax({
		url : "/" + 'order',
		type : "GET",
		data : parameter,
		success : function(resp) {
			var data = resp.data;
			$('#orderStatus').val(data[0].orderStatus);
			denableOnStatus('order');
			showMessage('Data saved succesfully !!!', 'order');
		}
	});

}
var delete_returns = function() {
	var orderId = $('#tblOrderId').val();
	showMessage('Deleting...', 'returns');
	var parameter = new Array();
	parameter[parameter.length] = new param('command', 'delete');
	parameter[parameter.length] = new param('code', $('#returns_year').val()
			+ '-' + $('#returns_quarter').val());
	$.ajax({
		url : "/" + 'returns',
		type : "GET",
		data : parameter,
		success : function(resp) {
			var data = resp.data;
			showMessage(data[0].status, 'returns');
			cancel('returns');
		}
	});

}

// function to get the data by setting url, filter, success function and error
// function

// function to populate the select box which takes input as id of the selectbox
// element and url to get the data
var populateSelectBoxLocal = function(id, resp, element) {
	// getting the select box element
	var selectBox = $('#' + id);
	$('#' + id).find('option').remove()

	// setting the content inside as empty
	selectBox.innerHTML = '';
	// getting the data from the response object
	var data = resp.data;
	// appending the first option as select to the select box
	selectBox.append('<option value="">Select</option>');
	// adding all other values
	var valooz = '';
	var valoo = '';
	for (var i = 0; i < data.length; i++) {
		valoo = eval('data[i].' + element);
		if (valooz.indexOf(valoo) == -1) {
			selectBox.append('<option value="' + eval('data[i].' + element)
					+ '">' + eval('data[i].' + element) + '</option>');
			valooz = valooz + valoo
		}
	}
}

// function to populate the select box which takes input as id of the selectbox
// element and url to get the data
var populateSelectBox = function(id, url) {
	// specifying the success function. When the ajax response is successful
	// then the following function will be called
	var successFn = function(resp) {
		// getting the select box element
		var selectBox = $('#' + id);
		// setting the content inside as empty
		$('#' + id).find('option').remove();
		selectBox.innerHTML = '';
		// getting the data from the response object
		var data = resp.data;
		// appending the first option as select to the select box
		selectBox.append('<option value="">Select</option>');
		selectBox.append('<option value="New">New</option>');
		// adding all other values
		for (var i = 0; i < data.length; i++) {
			selectBox.append('<option value="' + data[i].name + '">'
					+ data[i].name + '</option>');
		}
	}
	// calling the getData function with the success function
	getData(url, null, successFn, null);
}

/**
 * Map to store value in format pagenum | cursor value
 */
var paginationMap = {};

// function to populate the list of an entity
var populateList = function(entity, filter, command, currentCursor, clickedLink) {
	// specifying the success function. When the ajax response is successful
	// then the following function will be called
	var successFn = function(resp) {
		var data = '';
		var nextCursor = "";
		var lastPage = "N";
		if (resp) {
			// getting the data from the response object
			// var resp = $.parseJSON(resp);
			data = resp.data;

		}
		// creating the html content
		var htm = '';
		var htmf = '<tr>';
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				if ((data[i].name == 'footer')) {
					nextCursor = data[i].nextCursor;
					lastPage = data[i].lastPage;

				} else {
					// creating a row
					htm += '<tr>';
					switch (entity) {
					case 'products':
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].product_category + '</td>';
						break;
					case 'stock-sum-brand':
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].value + '</td><td>' + data[i].count
								+ '</td></a>';
						break;

					case ENTITY_STOCK:
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].brand + '</td><td>'
								+ data[i].stock_type + '</td><td>'
								+ data[i].stock_subtype + '</td><td>'
								+ data[i].stock_subsubtype + '</td><td>'
								+ data[i].stock_description + '</td><td>'
								+ data[i].stock_net_cost_price + '</td><td>'
								+ data[i].recieve_date + '</td><td>'
								+ data[i].storage_location + '</td>';
						break;

					case ENTITY_ACCOUNT:
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].brand + '</td><td>' + data[i].date
								+ '</td><td>' + data[i].comments + '</td><td>'
								+ data[i].orderID + '</td><td>'
								+ data[i].amount + '</td><td>'
								+ data[i].balance + '</td>' + '</td><td>'
								+ data[i].status + '</td>';
						break;

					case ENTITY_PL:

						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].brand + '</td><td>' + data[i].type
								+ '</td><td>' + data[i].subtype + '</td><td>'
								+ data[i].subsubtype + '</td><td>'
								+ data[i].price + '</td><td>'
								+ data[i].comments + '</td>';
						break;

					case ENTITY_BRAND:
						htm += '<td>' + data[i].name + '</td>';

						break;
					case ENTITY_ITEM:
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].price + '</td><td>' + data[i].product
								+ '</td>';
						break;
					case ENTITY_ORDER:
						if (data[i].orderStatus == 'Cancelled') {
							htm += '<td>' + '<del>' + data[i].name
									+ '</del></td><td>' + '<del>'
									+ data[i].company + '</del></td><td>'
									+ '<del>' + data[i].orderValue
									+ '</del></td><td>' + '<del>'
									+ data[i].dateOfOrder + '</del></td><td>'
									+ '<del>' + data[i].actualDespatchDate
									+ '</del></td><td>' + '<del>'
									+ data[i].arrivalDate + '</del></td>';
						} else {
							htm += '<td>' + data[i].name + '</td><td>'
									+ data[i].company + '</td><td>'
									+ data[i].orderValue + '</td><td>'
									+ data[i].dateOfOrder + '</td><td>'
									+ data[i].actualDespatchDate + '</td><td>'
									+ data[i].arrivalDate + '</td>';
						}
						break;
					case ENTITY_BILLING:
						if (data[i].billing_status == 'Cancelled') {
							htm += '<td>' + '<del>' + data[i].name
									+ '</del></td><td>' + '<del>'
									+ data[i].billing_date + '</del></td><td>'
									+ '<del>' + data[i].billing_cust_name
									+ '</del></td><td>' + '<del>'
									+ data[i].billing_summ + '</del></td><td>'
									+ '<del>' + data[i].billing_Value
									+ '</del></td><td>' + '<del>'
									+ data[i].billing_status + '</del></td>';
						} else {
							htm += '<td>' + data[i].name + '</td><td>'
									+ data[i].billing_date + '</td><td>'
									+ data[i].billing_cust_name + '</td><td>'
									+ data[i].billing_summ + '</td><td>'
									+ data[i].billing_Value + '</td><td>'
									+ data[i].billing_status + '</td>';
						}
						break;
					case ENTITY_EXPENSE:
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].date + '</td><td>'
								+ data[i].expense_item + '</td><td>'
								+ data[i].expense_amount + '</td><td>'
								+ data[i].payment_done + '</td><td>'
								+ data[i].by + '</td>';
						break;
					case ENTITY_PAYMENTS:
						if (data[i].status == 'Saved') {
							htm += '<td class="actnow">' + data[i].pay_date
									+ '</td><td class="actnow">'
									+ data[i].pay_bank
									+ '</td><td class="actnow">'
									+ data[i].pay_amount
									+ '</td><td class="actnow">'
									+ data[i].pay_party
									+ '</td><td class="actnow">'
									+ data[i].payments_id
									+ '</td><td class="actnow">'
									+ data[i].summary
									+ '</td><td class="actnow">'
									+ data[i].status + '</td>';
						} else if (data[i].status == 'Cancelled') {

							htm += '<td class="graybg"><del>'
									+ data[i].pay_date
									+ '</del></td><td class="graybg"><del>'
									+ data[i].pay_bank
									+ '</del></td><td class="graybg"><del>'
									+ data[i].pay_amount
									+ '</del></td><td class="graybg"><del>'
									+ data[i].pay_party
									+ '</del></td><td class="graybg"><del>'
									+ data[i].payments_id
									+ '</del></td><td class="graybg"><del>'
									+ data[i].summary
									+ '</del></td><td class="graybg"><del>'
									+ data[i].status + '</del></td>';
						} else {

							htm += '<td class="graybg">' + data[i].pay_date
									+ '</td><td class="graybg">'
									+ data[i].pay_bank
									+ '</td><td class="graybg">'
									+ data[i].pay_amount
									+ '</td><td class="graybg">'
									+ data[i].pay_party
									+ '</td><td class="graybg">'
									+ data[i].payments_id
									+ '</td><td class="graybg">'
									+ data[i].summary
									+ '</td><td class="graybg">'
									+ data[i].status + '</td>';

						}
						break;
					case ENTITY_RETURNS:
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].returns_date + '</td><td>'
								+ data[i].tot_sale + '</td><td>'
								+ data[i].tot_pur_state + '</td><td>'
								+ data[i].tot_pur_non_state + '</td><td>'
								+ data[i].pay_vat + '/'
								+ data[i].output_input_diff_inv + '</td><td>'
								+ data[i].pay_et + '/'
								+ data[i].tot_et_state_inv + '</td><td>'
								+ data[i].pur_sold + '/' + data[i].pur_not_sold
								+ '</td>';
						break;
					case 'annual-returns':
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].returns_date + '</td><td>'
								+ data[i].tot_sale + '</td><td>'
								+ data[i].tot_pur_state_inv + '</td><td>'
								+ data[i].tot_pur_non_state_inv + '</td><td>'
								+ data[i].pay_vat + '/'
								+ data[i].output_input_diff_inv + '</td><td>'
								+ data[i].pay_et + '/'
								+ data[i].tot_et_state_inv + '</td><td>'
								+ data[i].pur_sold + '/' + data[i].pur_not_sold
								+ '</td>';

						break;
					case 'oppor':
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].oppor_brand + '</td><td>'
								+ ("" + data[i].oppor_summ).substring(0, 60)
								+ '</td><td>' + data[i].oppor_cust_name
								+ '</td><td>' + data[i].oppor_cust_phone
								+ '</td><td>' + data[i].oppor_net_value
								+ '</td><td>' + data[i].oppor_status + '</td>';
						break;

					case 'customer':
						htm += '<td>'
								+ data[i].customer_cust_name
								+ '</td><td>'
								+ data[i].customer_cust_add
								+ '</td><td>'
								+ data[i].customer_cust_phone
								+ '</td><td>'
								+ data[i].customer_cust_email
								+ '</td><td>'
								+ data[i].name
								+ '</td><td>'
								+ data[i].owner
								+ '</td><td>'
								+ ("" + data[i].lastConversation).substring(0,
										60) + '</td><td>' + data[i].next_date
								+ '</td>';

						break;

					case 'work':
						htm += '<td>' + data[i].name + '</td><td>'
								+ data[i].work_desc + '</td><td>'
								+ data[i].work_status + '</td><td>'
								+ data[i].work_allocated + '</td><td>'
								+ data[i].work_start_date + '</td><td>'
								+ data[i].work_deadline + '</td><td>'
								+ data[i].work_comments + '</td>';
						break;

					case 'Settings':
						htm += '<td>' + data[i].name + '</td>';
						break;

					default:
						htm += "";
					}
					htm = htm.replace('undefined', '');

					if ((entity == "stock-sum-brand"))
						htm += '<td><a href="#" class="edit-entity" onclick=\'showDisplayArea("stock?code=brand&cat='
								+ data[i].name + '")\'  >Edit</a></td></tr>';
					else if ((entity == "stock-sum-type"))
						htm += '<td><a href="#" class="edit-entity" onclick=\'showDisplayArea("stock?code=type&cat='
								+ data[i].name + '") \'  >Edit</a></td></tr>';

					else if ((entity == "order") || (entity == "billing")
							|| (entity == "payments") || (entity == "returns")
							|| (entity == "annual-returns")
							|| (entity == "customer") || (entity == "oppor")
							|| (entity == "work"))
						htm += '<td><a href="#" class="delete-entity" onclick=\'deleteEntity("'
								+ entity
								+ '","'
								+ data[i].name
								+ '",null)\'></a> <a href="#" class="edit-entity" onclick=\'editM("'
								+ entity
								+ '","'
								+ data[i].name
								+ '")\'>Edit</a></td></tr>';
					else if (entity != "")
						htm += '<td><a href="#" class="delete-entity" onclick=\'deleteEntity("'
								+ entity
								+ '","'
								+ data[i].name
								+ '",null)\'>Delete</a> <a href="#" class="edit-entity" onclick=\'edit("'
								+ entity
								+ '","'
								+ data[i].name
								+ '")\'>Edit</a></td></tr>';
					else
						htm += '<td><a href="#" class="delete-entity" onclick=\'deleteEntity("'
								+ entity
								+ '","'
								+ data[i].name
								+ '","'
								+ data[i].customerName + '")\'></a></td></tr>';

					// htm = htm.replace('undefined', '');
				}
				htm = htm.replace('undefined', '');
			} // for loop iterating through all results
			var pageNo = 1;
			if (clickedLink == 'Next') {
				pageNo = parseInt($('#' + entity + '-currentPage').val());
				pageNo++;
				$('#' + entity + '-currentPage').val(pageNo);
			}
			if (clickedLink == 'Prev') {
				pageNo = parseInt($('#' + entity + '-currentPage').val());
				pageNo--;
				$('#' + entity + '-currentPage').val(pageNo);
			}
			prevCursor = paginationMap[pageNo - 1];
			paginationMap[pageNo + 1] = nextCursor;
			if (parseInt(pageNo) > 1) {

				htmf = htmf
						+ '<td class = "nextprev"><a href="#" class = "nextprev" onclick=\'populateList("'
						+ entity + '","' + filter + '","' + command + '","'
						+ prevCursor + '","' + 'Prev'
						+ '")\'> &lt Prev  </a></td>';
			}
			if (lastPage == 'N') {

				htmf = htmf
						+ '<td class="nextprev"><a href="#"  class = "nextprev" onclick=\'populateList("'
						+ entity + '","' + filter + '","' + command + '","'
						+ nextCursor + '","' + 'Next'
						+ '")\'>  Next ></a></td>';
			}

		} else {
			// condition to show message when data is not available
			var thElesLength = $('#' + entity + '-list-ctr table thead th').length;
			htm += '<tr><td colspan="' + thElesLength
					+ '">No items found</td></tr>';
		}
		$('#' + entity + '-list-tbody').html(htm);
		$('#' + entity + '-list-footer-tbody').html(htmf + '</tr>');

		var resort = [ [ 0, 0 ], [ 2, 0 ] ];
		$("#" + entity + "Table").trigger("update", [ [ 0, 0 ], [ 2, 0 ] ]);
		$("#stockInstantSearchStatus").val('searched');
		$("#" + entity + "Table").removeAttr('disabled');
	}
	getData("/" + entity + "?currentCursor=" + currentCursor + "&command="
			+ command, filter, successFn, null);
}

var populateDB = function(entity, filter, command, id) {
	// specifying the success function. When the ajax response is successful
	// then the following function will be called
	var successFn = function(resp) {

		var data = '';
		if (resp) {
			// getting the data from the response object
			data = resp.data;
		}
		// creating the html content
		var htm = '';
		if (data.length > 0) {
			htm += '<table width="100%">';
			for (var i = 0; i < data.length; i++) {
				// creating a row
				htm += '<tr>';
				switch (id) {
				case 'home_pending_sale':
					var fullStr = data[i].brand + ' | ' + data[i].stock_type
							+ ' | ' + data[i].stock_subtype + ' | '
							+ data[i].stock_subsubtype + ' | '
							+ data[i].stock_description + ' | ';
					var str = fullStr.replace('null', '').substring(0, 35);
					var prc = data[i].selling_price + '  '
							+ data[i].gross_selling_price
					prc = prc.replace('undefined', '')
					htm += '<td>' + str + '</td><td>' + prc + '</td><td>'
							+ data[i].sold_by + '</td></tr>';
					break;

				case 'db_order_placed_stock':
					var fullStr = data[i].stock_type + ' | '
							+ data[i].stock_subtype + ' | '
							+ data[i].stock_subsubtype + ' | '
							+ data[i].stock_description + ' | ';
					var str = fullStr.replace('null', '').substring(0, 35);
					htm += '<td>' + data[i].brand + '</td><td>' + str
							+ '</td></tr>';
					break;
				case 'db_active_comm':

					var fullStr = data[i].lastConversation;
					var str = fullStr.replace('null', '').substring(0, 65)
							+ "..";
					htm += '<td title="' + data[i].customer_cust_add + ' , '
							+ data[i].customer_cust_phone + '">'
							+ data[i].customer_cust_name + '</td><td title="'
							+ fullStr + '">' + str + '</td><td>'
							+ data[i].next_date + '</td></tr>';
					break;

				case 'db_sold_stock':

					var fullStr = data[i].brand + ' | ' + data[i].stock_type
							+ ' | ' + data[i].stock_subtype + ' | '
							+ data[i].stock_subsubtype + ' | '
							+ data[i].stock_description + ' | ';
					var str = fullStr.replace('null', '').substring(0, 35);
					htm += '<td>' + str + '</td><td>'
							+ data[i].gross_selling_price + '</td><td>'
							+ data[i].sale_date + '</td></tr>';
					break;

				case 'db_in_progress_work':
					var fullStr = data[i].work_desc;
					var str = fullStr.replace('null', '').substring(0, 35);
					htm += '<td>' + str + '</td><td>' + data[i].work_allocated
							+ '</td></tr>';
					break;

				case ENTITY_BRAND:
					htm += '<td>' + data[i].name + '</td></tr>';

					break;
				case ENTITY_ITEM:
					htm += '<td>' + data[i].name + '</td><td>' + data[i].price
							+ '</td><td>' + data[i].product + '</td></tr>';
					break;
				case 'home_pending_order':
					htm += '<td>' + data[i].company + '</td><td>'
							+ data[i].orderValue + '</td><td>'
							+ data[i].dateOfOrder + '</TD></tr>';
					break;
				case ENTITY_BILLING:
					htm += '<td>' + data[i].name + '</td><td>'
							+ data[i].billing_date + '</td><td>'
							+ data[i].billing_cust_name + '</td><td>'
							+ data[i].billing_Value + '</td><td>'
							+ data[i].billing_status + '</td></tr>';
					break;
				case 'home_pending_expense':
					htm += '<td>' + data[i].expense_item + '</td><td>'
							+ data[i].expense_amount + '</td><td>' + data[i].by
							+ '</td></tr>';
					break;
				case ENTITY_PAYMENTS:
					htm += '<td>' + data[i].name + '</td><td>'
							+ data[i].payments_date + '</td><td>'
							+ data[i].payments_type + '</td><td>'
							+ data[i].payments_amount + '</td><td>'
							+ data[i].payments_to_account + '</td></tr>';
					break;
				default:
					htm += "";
				}
			}
		} else {
			// condition to show message when data is not available
			var thElesLength = $('#' + entity + '-list-ctr table thead th').length;
			htm += '<tr><td colspan="' + thElesLength
					+ '">No items found</td></tr>';
		}
		htm += "</TABLE>";
		$('#' + id).html(htm);
		// var resort = [ [ 0, 0 ], [ 2, 0 ] ];
		// $("#" + entity + "Table").trigger("update", [ [ 0, 0 ], [ 2, 0 ] ]);
		// $("#stockInstantSearchStatus").val('searched');
		// $("#" + entity + "Table").removeAttr('disabled');
	}
	getData("/" + entity + "?command=" + command, filter, successFn, null);
}
