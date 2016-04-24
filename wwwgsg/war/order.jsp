<%@ page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@ page import="com.google.appengine.api.datastore.Entity"%>
<%@ page import="com.google.appengine.api.datastore.KeyFactory"%>
<%@ page import="com.gsg.service.Products"%>
<%@ page import="java.math.*"%>
<%@ page import="java.text.*"%>
<%@ page import="java.util.*"%>
<%
	BlobstoreService blobstoreService = BlobstoreServiceFactory
			.getBlobstoreService();
	String productid = request.getParameter("id");
	Entity category = Products.getProductCategory(productid);
	Entity product = Products.getProductProperties(productid);
	//	double price = (Integer) product.getProperty("__number__price");
	NumberFormat n = NumberFormat.getCurrencyInstance(Locale.PRC);
	BigDecimal price = new BigDecimal(""
			+ product.getProperty("__number__price"));
	BigDecimal netPrice = price.divide(new BigDecimal("1.135"), 2,
			BigDecimal.ROUND_HALF_UP);
	BigDecimal vat = netPrice.multiply(new BigDecimal(".135"));

	String priceF = "" + price;
	String netPriceF = "" + netPrice;
	String vatF = n.format(vat);
%>
<!DOCTYPE html>
<html data-wf-site="52e67a271d6760632b0009d7">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Retail Management Suite - RMS</title>
<link rel="stylesheet" type="text/css" href="css/webflow.css">
<link rel="stylesheet" type="text/css"
	href="css/vikramshila-agency.webflow.css">
<link href='http://fonts.googleapis.com/css?family=Shadows+Into+Light'
	rel='stylesheet' type='text/css'>
<link rel="shortcut icon" type="image/x-icon"
	href="https://y7v4p6k4.ssl.hwcdn.net/52e67a271d6760632b0009d7/52eec3e0672b98eb65000698_vsa_fav.png">
<!--[if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.min.js"></script><![endif]-->
<link rel="apple-touch-icon" href="images/vsa_fav.jpg">
<script
	src="https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"></script>
<script>
	WebFont.load({
		google : {
			families : [ "Montserrat:400,700", "Lato:100,300,400,700,900",
					"Bitter:400,700", "Open Sans:300,400,600,700,800",
					"Rock Salt:regular", "Fauna One:regular" ]
		}
	});
</script>
<script>
	if (/mobile/i.test(navigator.userAgent))
		document.documentElement.className += ' w-mobile';
</script>
<link rel="shortcut icon" type="image/x-icon"
	href="https://y7v4p6k4.ssl.hwcdn.net/52e67a271d6760632b0009d7/52eec3e0672b98eb65000698_vsa_fav.png">
<!--[if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.min.js"></script><![endif]-->
<link rel="apple-touch-icon" href="images/vsa_fav.jpg">
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49901239-1', 'auto');
  ga('send', 'pageview');

</script>
<script language="javascript" src='script/jquery-1.9.1.js'></script>
<script language="javascript" src='script/jquery-ui-1.10.2.custom.js'></script>
<script language="javascript" src='script/ajax.utils.js'></script>
<script language="javascript" src='script/jquery.validate.min.js'></script>
<script language="javascript" src='script/additional-methods.min.js'></script>

</head>
<body>
	<%@include file="header.jsp"%>
	<form name="order-form" id="order-form" method="post"
		enctype="multipart/form-data"
		action="<%=blobstoreService.createUploadUrl("/order")%>"
		novalidate="novalidate">
		<div class="w-row row2">
			<div class="w-col w-col-12">
				<div class="sectioncyl" id="alcyl">
					<div id="listing-items">
						<div class="listing-w-row ">
							<div class="w-col w-col-4">
								<br /> <br /> <br /> <br />
								<h4>Item Summary</h4>
								<table class="order-item-summary">
									<tr style="text-decoration: underline;">
										<th>S no</th>
										<th>Item</th>
										<th>Price</th>
										<th>Quantity</th>
										<th>Total</th>
									</tr>
									<tr>
										<td>1</td>
										<td><%=product.getProperty("__text__brand")%> <%=product.getProperty("__text__model")%>
											<input type="hidden" id="item_des" name="item_des"
											value="<%=product.getProperty("__text__brand")%> <%=product.getProperty("__text__model")%>" />
											<input type="hidden" id="item_id" name="item_id"
											value="<%=productid%>" /></td>
										<td><label id="label_item_price" name="label_item_price"><%=netPrice%></label><input
											type="hidden" id="item_price" name="item_price"
											value="<%=netPriceF%>" /></td>
										<td><select type="text" id="item_quantity"
											name="item_quantity" class="order-item-summary">
												<%
													for (int i = 1; i < 21; i++) {
												%>
												<option value="<%=i%>"><%=i%></option>
												<%
													}
												%>
										</select></td>
										<td><label id="label_item_line_tot"
											name="label_item_line_tot"><%=netPriceF%></label><input
											type="hidden" id="item_line_tot" name="item_line_tot"
											value="<%=netPriceF%>" /><input type="hidden" id="itemRoz"
											name="itemRoz" value="1" /></td>
									</tr>
									<tr>
										<td colspan="5">&nbsp;
									</tr>

									<tr>
										<td colspan="5">
											<div class="separator"></div>
										</td>
									</tr>
									<tr>
										<td colspan="4" class="order-item-total">Sub Total</td>
										<td><label id="label_item_sub_tot"
											name="label_item_sub_tot"><%=netPrice%></label><input
											type="hidden" id="item_sub_tot" name="item_sub_tot"
											value="<%=netPriceF%>" /></td>
									</tr>
									<tr>
										<td colspan="4" class="order-item-total">VAT</td>
										<td><label id="label_item_vat" name="label_item_vat"><%=vatF%></label><input
											type="hidden" id="item_vat" name="item_vat" value="<%=vatF%>" /></td>
									</tr>
									<tr>
										<td colspan="4" class="order-item-total">Grand Total</td>
										<td><label id="label_item_grand_tot"
											name="label_item_grand_tot"><%=priceF%></label><input
											type="hidden" id="item_grand_tot" name="item_grand_tot"
											value="<%=priceF%>" /></td>
									</tr>
									<tr>
										<td colspan="5">
											<div class="separator"></div>
										</td>
									</tr>

								</table>
							</div>
							<div class="w-col w-col-8 order-form">
								<h3>Order Details</h3>
								<div>
									<div class="w-col w-col-12"></div>
									<div class="w-row">
										<h5>Your Details</h5>
										<div>
											<div class="w-col w-col-3">Email*</div>
											<div>
												<input type="text" name="email" id="email"
													class="w-col w-col-5" />
											</div>
											<div class="w-col w-col-4">
												<label for="email" class="error"></label>
											</div>
										</div>
									</div>
									<div class="w-row">
										<div class="w-col w-col-3">Re-enter Email*</div>
										<div>
											<input type="password" name="email_match" id="email_match"
												class="w-col w-col-5" />
										</div>
										<div class="w-col w-col-4">
											<label for="email_match" class="error"></label>
										</div>
									</div>
									<div class="w-row">
										<div class="w-col w-col-3">Phone Number*</div>
										<div>
											<input type="text" name="phone" id="phone"
												class="w-col w-col-5" />
										</div>
										<div class="w-col w-col-4">
											<label for="phone" class="error"></label>
										</div>
									</div>
								</div>
								<div class="separator"></div>
								<div class="w-row">
									<div class="w-col w-col-12">
										<div class="w-col w-col-6">
											<h5>Shipping Address</h5>
											<div class="w-row">
												<div class="w-col w-col-3">Name*</div>
												<input type="text" name="cust_name" id="cust_name"
													class="w-col w-col-5 order-form" />
												<div class="w-col w-col-4">
													<label for="cust_name" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">Pin Code*</div>
												<input type="text" name="pincode" id="pincode"
													class="w-col w-col-5 order-form" />
												<div class="w-col w-col-4">
													<label for="pincode" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">Address*</div>
												<textarea rows="4" column="50" name="address" id="address"
													class="w-col w-col-5 order-form"></textarea>
												<div class="w-col w-col-4">
													<label for="address" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">Landmark</div>
												<input type="text" name="landmark" id="landmark"
													class="w-col w-col-5" />
												<div class="w-col w-col-4">
													<label for="landmark" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">City*</div>
												<input type="text" name="city" id="city"
													class="w-col w-col-5" />
												<div class="w-col w-col-4">
													<label for="city" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">State*</div>
												<Select name="state" id="state" class="w-col w-col-5"><option>Bihar</option>
													<option>Jharkhand</option></Select>
												<div class="w-col w-col-4">
													<label for="state" class="error"></label>
												</div>
											</div>
										</div>
										<div class="w-col w-col-1">
											<br /> <br /> <br /> <br /> <br /> COPY <input
												type="checkbox" name="copyadd" id="copyadd" checked />
										</div>
										<div class="w-col w-col-5">
											<h5>Billing Address</h5>
											<div class="w-row">
												<div class="w-col w-col-3">Name*</div>
												<input type="text" name="cust_name_bill" id="cust_name_bill"
													class="w-col w-col-5" />
												<div class="w-col w-col-4">
													<label for="cust_name_bill" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">Pin Code*</div>
												<input type="text" name="pincode_bill" id="pincode_bill"
													class="w-col w-col-5" />
												<div class="w-col w-col-4">
													<label for="pincode_bill" class="error"></label>
												</div>
											</div>
											<div class="w-row">
												<div class="w-col w-col-3">Address*</div>
												<textarea rows="4" column="50" name="address_bill"
													id="address_bill" class="w-col w-col-5"></textarea>
												<div class="w-col w-col-4">
													<label for="address_bill" generated="true" class="error"></label>
												</div>

											</div>
											<div class="w-row">
												<div class="w-col w-col-3">Landmark</div>
												<input type="text" name="landmark_bill" id="landmark_bill"
													class="w-col w-col-5" />
												<div class="w-col w-col-4">
													<label for="landmark_bill" generated="true" class="error"></label>
												</div>

											</div>
											<div class="w-row">
												<div class="w-col w-col-3">City*</div>
												<input type="text" name="city_bill" id="city_bill"
													class="w-col w-col-5" />
												<div class="w-col w-col-4">
													<label for="city_bill" generated="true" class="error"></label>
												</div>

											</div>
											<div class="w-row">
												<div class="w-col w-col-3">State</div>
												<Select name="state_bill" id="state_bill"
													class="w-col w-col-5">
													<option value="Andaman and Nicobar Islands">Andaman
														and Nicobar Islands</option>
													<option value="Andhra Pradesh">Andhra Pradesh</option>
													<option value="Arunachal Pradesh">Arunachal
														Pradesh</option>
													<option value="Assam">Assam</option>
													<option value="Bihar">Bihar</option>
													<option value="Chandigarh">Chandigarh</option>
													<option value="Chhattisgarh">Chhattisgarh</option>
													<option value="Dadra and Nagar Haveli">Dadra and
														Nagar Haveli</option>
													<option value="Daman and Diu">Daman and Diu</option>
													<option value="Delhi">Delhi</option>
													<option value="Goa">Goa</option>
													<option value="Gujarat">Gujarat</option>
													<option value="Haryana">Haryana</option>
													<option value="Himachal Pradesh">Himachal Pradesh</option>
													<option value="Jammu and Kashmir">Jammu and
														Kashmir</option>
													<option value="Jharkhand">Jharkhand</option>
													<option value="Karnataka">Karnataka</option>
													<option value="Kerala">Kerala</option>
													<option value="Lakshadweep">Lakshadweep</option>
													<option value="Madhya Pradesh">Madhya Pradesh</option>
													<option value="Maharashtra">Maharashtra</option>
													<option value="Manipur">Manipur</option>
													<option value="Meghalaya">Meghalaya</option>
													<option value="Mizoram">Mizoram</option>
													<option value="Nagaland">Nagaland</option>
													<option value="Orissa">Orissa</option>
													<option value="Pondicherry">Pondicherry</option>
													<option value="Punjab">Punjab</option>
													<option value="Rajasthan">Rajasthan</option>
													<option value="Sikkim">Sikkim</option>
													<option value="Tamil Nadu">Tamil Nadu</option>
													<option value="Tripura">Tripura</option>
													<option value="Uttaranchal">Uttaranchal</option>
													<option value="Uttar Pradesh">Uttar Pradesh</option>
													<option value="West Bengal">West Bengal</option>

												</Select>
												<div class="w-col w-col-4">
													<label for="state_bill" generated="true" class="error"></label>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="separator"></div>
								<h5>Payments Details</h5>
								<div class="w-row">
									<div class="w-col w-col-2">Payment Method</div>
									<Select name="pay_method" id="pay_method"
										class="w-col w-col-2 order-form">
										<option value="Draft On Delivery">Draft On Delivery</option>
										<option value="NEFT">NEFT</option>
								 <option value="Account Deposit">Account Deposit</option>
										<option value="Credit Card">Credit Card</option>
 										
									</Select>
									<div class="w-col w-col-8">
										<label for="pay_method"></label>
									</div>
								</div>
								<div class="w-row">
									<div class="w-col w-col-2">
										<label id="label_utr">UTR Number</label>
									</div>
									<div>
										<input type="text" name="utr" id="utr" class="w-col w-col-2" />
									</div>
									<div class="w-col w-col-8">
										<span name="pay_method_msgu" id="pay_method_msgu"></span>
									</div>
								</div>
								<div class="w-row">
									<div class="w-col w-col-2">
										<label id="label_scan">Scanned Copy</label>
									</div>
									<div>
										<input type="file" name="scan" id="scan" class="w-col w-col-2" />
									</div>
									<div class="w-col w-col-8">
										<span name="pay_method_msg" id="pay_method_msg"></span>
									</div>
								</div>
								<div class="separator"></div>
								<br />
								<div class="w-row">
									<div class="w-col w-col-6">
										<input class="button-small" type="submit" value="OK" />
									</div>
									<div class="w-col w-col-6">
										<a href="/details.jsp?id=<%=productid %>">
											<div class="button-small">Back</div>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<br /> <br />
		<div class="w-row">
			<div class="w-col w-col-6 w-clearfix">
				<div class="footer-text">Copyright © 2014 GensetGo. All rights
					reserved.</div>
			</div>
			<div class="w-col w-col-6 w-clearfix">
				<div class="footer-text footer-text">GensetGo News | Site Map
					| Contact Us</div>
			</div>
		</div>
	</form>

	<script type="text/javascript" src="js/webflow.js"></script>
	<script type="text/javascript">
		$(window).load(function() {
			init();
		});
	</script>
</body>
</html>