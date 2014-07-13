<%@ page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@ page import="com.google.appengine.api.datastore.Entity"%>
<%@ page import="com.google.appengine.api.datastore.KeyFactory"%>
<%@ page import="com.gsg.service.Products"%>
<%@ page import="java.math.*"%>
<%@ page import="java.text.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.gsg.helper.Util"%>

<%
	BlobstoreService blobstoreService = BlobstoreServiceFactory
			.getBlobstoreService();
	//	String orderId = request.getParameter("id");
	//	Entity order = Util.findEntity(KeyFactory.createKey("Order",
	//			Long.parseLong(orderId)));
	Entity order = (Entity) request.getAttribute("order");
	String orderId = order.getKey().getId() + "";

	Iterator iterator = Util.listChildren("Item",
			KeyFactory.createKey("Order", Long.parseLong(orderId)))
			.iterator();
	String ms = "" + request.getAttribute("msg");
%>
<!DOCTYPE html>
<html data-wf-site="52e67a271d6760632b0009d7">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Retail Management Suite - RMS</title>
<link rel="stylesheet" type="text/css" href="/css/webflow.css">
<link rel="stylesheet" type="text/css"
	href="/css/vikramshila-agency.webflow.css">
<link href='http://fonts.googleapis.com/css?family=Shadows+Into+Light'
	rel='stylesheet' type='text/css'>
<link rel="shortcut icon" type="image/x-icon"
	href="https://y7v4p6k4.ssl.hwcdn.net/52e67a271d6760632b0009d7/52eec3e0672b98eb65000698_vsa_fav.png">
<!--[if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.min.js"></script><![endif]-->
<link rel="apple-touch-icon" href="/images/vsa_fav.jpg">
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
<link rel="apple-touch-icon" href="/images/vsa_fav.jpg">
<script>
	(function(i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1 * new Date();
		a = s.createElement(o), m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', '//www.google-analytics.com/analytics.js',
			'ga');
	ga('create', 'UA-49901239-1', 'gensetgo.com');
	ga('send', 'pageview');
</script>
<script language="javascript" src='/script/jquery-1.9.1.js'></script>
<script language="javascript" src='/script/jquery-ui-1.10.2.custom.js'></script>
<script language="javascript" src='/script/jquery.validate.min.js'></script>
<script language="javascript" src='/script/jquery.validate.js'></script>
<script language="javascript" src='/script/additional-methods.js'></script>
<script language="javascript" src='/script/additional-methods.min.js'></script>
<script language="javascript" src='/script/ajax.utils.js'></script>
<script language="javascript" src='/script/jquery.tablesorter.js'></script>
<script language="javascript" src='/script/jquery.tablesorter.widgets.js'></script>
<script language="javascript" type="text/javascript"
	src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.10.0/jquery.validate.min.js"></script>
</head>
<body>
	<%@include file="header.jsp"%>

	<div class="w-row row2">
		<div align="center" class="w-col w-col-12 details-p1box">
			<br /> <br />

			<table class="track-table" align="center">
				<tr>
					<td colspan="3">
						<h3>
							Order Reference Number -
							<%=orderId%></h3>
					</td>
				</tr>

				<tr>
					<td>
						<table>
							<tr>
								<th colspan="2">Personal Details</th>
							</tr>
							<tr>
								<td>Name</td>
								<td><%=order.getProperty("cust_name")%></td>
							</tr>

							<tr>
								<td>Email</td>
								<td><%=order.getProperty("email")%></td>
							</tr>
							<tr>
								<td>Phone Number</td>
								<td><%=order.getProperty("phone")%></td>
							</tr>
						</table>

					</td>
					<td></td>
					<td>

						<table class="specs-table">
							<tr>
								<td>Date of Order</td>
								<td><%=order.getProperty("orderDate")%></td>
							</tr>
							<tr>
								<td>Payment Method</td>
								<td><%=order.getProperty("pay_method")%>
							</tr>
							<tr>
								<td>Status</td>
								<td><%=order.getProperty("status")%>
							</tr>

						</table>




					</td>
				</tr>
				<tr>
					<td colspan="3">&nbsp;</td>
				</tr>

				<tr>
					<td>

						<table>
							<th colspan="2">Billing Address</th>
							<tr>
								<td>Name</td>
								<td><%=order.getProperty("cust_name_bill")%></td>
							</tr>
							<tr>
								<td>Pin Code</td>
								<td><%=order.getProperty("pincode_bill")%></td>
							</tr>
							<tr>
								<td>Address</td>
								<td><%=order.getProperty("address_bill")%></td>
							</tr>
							<tr>
								<td>Landmark</td>
								<td><%=order.getProperty("landmark_bill")%></td>
							</tr>
							<tr>
								<td>City</td>
								<td><%=order.getProperty("city_bill")%></td>
							</tr>
							<tr>
								<td>State</td>
								<td><%=order.getProperty("state_bill")%></td>
							</tr>
						</table>
					</td>
					<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<td>
						<table>
							<th colspan="2">Shipping Address</th>
							<tr>
								<td>Name*</td>
								<td><%=order.getProperty("cust_name")%></td>
							</tr>
							<tr>
								<td>Pin Code*</td>
								<td><%=order.getProperty("pincode")%></td>
							</tr>
							<tr>
								<td>Address*</td>
								<td><%=order.getProperty("address")%></td>
							</tr>
							<tr>
								<td>Landmark</td>
								<td><%=order.getProperty("landmark")%></td>
							</tr>
							<tr>
								<td>City*</td>
								<td><%=order.getProperty("city")%></td>
							</tr>
							<tr>
								<td>State*</td>
								<td><%=order.getProperty("state")%></td>
							</tr>
						</table>

					</td>
				</tr>
				<tr>
					<td colspan="3">&nbsp;</td>
				</tr>

				<tr>
					<td colspan="3">
						<h4>Item Summary</h4>
						<table class="specs-table">
							<tr style="text-decoration: underline;">
								<th>S no</th>
								<th>Item</th>
								<th>Price</th>
								<th>Quantity</th>
								<th>Total</th>
							</tr>
							<%
								while (iterator.hasNext()) {
									Entity lineItem = (Entity) iterator.next();
							%>
							<tr>
								<td>1</td>
								<td><%=lineItem.getProperty("item_des")%></td>
								<td><%=lineItem.getProperty("item_price")%></td>
								<td><%=lineItem.getProperty("item_quantity")%></td>
								<td><%=lineItem.getProperty("item_line_tot")%></td>
							</tr>

							<%
								}
							%>

							<tr>
								<td colspan="5">&nbsp;</td>
							</tr>
							<tr>
								<td colspan="4" align="center">Sub Total</td>
								<td><%=order.getProperty("item_sub_tot")%></td>
							</tr>
							<tr>
								<td colspan="4" align="center">VAT</td>
								<td><%=order.getProperty("item_vat")%></td>
							</tr>
							<tr>
								<td colspan="4" align="center">Grand Total</td>
								<td><%=order.getProperty("item_grand_tot")%></td>
							<tr>
							<tr>
								<td colspan="5">&nbsp;</td>
							<tr>
						</table>
					</td>
				</tr>
				<tr align="center">
					<td colspan="3"><a href="/">
							<div class="button-small">Back</div>
					</a>
						</div></td>
				</tr>

			</table>
			<br /> <br />

			<div class="w-row row2  ">
				<div class="w-col w-col-6 w-clearfix">
					<div class="footer-text">Copyright © 2014 GensetGo. All
						rights reserved.</div>
				</div>
				<div class="w-col w-col-6 w-clearfix">
					<div class="footer-text footer-text">GensetGo News | Site Map
						| Contact Us</div>
				</div>
			</div>
		</div>
	</div>
	<br>



	<script type="text/javascript" src="/js/webflow.js"></script>
	<script type="text/javascript">
		$(window).load(function() {
			init();
		});
	</script>
</body>
</html>