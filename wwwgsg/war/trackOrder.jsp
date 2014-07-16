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
	String msg = "";
	if (request.getAttribute("msg") != null) {
		msg = "" + request.getAttribute("msg");
	}
%>
<!DOCTYPE html>
<html data-wf-site="52e67a271d6760632b0009d7">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>GensetGo - Track your order</title>
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
<script language="javascript" src='script/jquery.validate.min.js'></script>
<script language="javascript" src='script/jquery.validate.js'></script>
<script language="javascript" src='script/additional-methods.js'></script>
<script language="javascript" src='script/additional-methods.min.js'></script>
<script language="javascript" src='script/ajax.util.js'></script>
<script language="javascript" src='script/jquery.tablesorter.js'></script>
<script language="javascript" src='script/jquery.tablesorter.widgets.js'></script>
<script language="javascript" type="text/javascript"
	src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.10.0/jquery.validate.min.js"></script>
</head>
<body>
	<%@include file="header.jsp"%>
	<form name="track-form" id="track-form" method="post" action="order">
		<div class="detailsection">
			<div class="w-row row2">
				<div class="w-col w-col-12">
					<div class="sectioncyl" id="alcyl">


						<div id="listing-items">
							<div class="listing-w-row ">
								<div align="center" class="w-col w-col-12">
									<br /> <br />
									<h3>T r a c k &nbsp; O r d e r</h3>
									<label class="error"> <%=msg%>
									</label>
									<table class="track-table">
										<tr>
											<td colspan="2">&nbsp;</td>
										</tr>

										<tr>
											<td>Order Number</td>
											<td><input type="text" id="orderNumber"
												name="orderNumber" /></td>
										</tr>
										<tr>
											<th colspan="2">OR </th>
										</tr>
										<tr>
											<td>Email Address *</td>
											<td><input type="text" id="orderEmail" name="orderEmail" /></td>
										</tr>
										<tr>
											<td>Order Date *</td>
											<td><input type="text" id="orderDate" name="orderDate" /></td>
										</tr>
										<tr>
										<td colspan="2"><i>* This search will display 1
												result only. Do not use if multiple orders are placed in one
												day</i></td>
										</tr>

										<tr align="center">
											<td colspan="2"><input type="submit"
												id="orderTrackSubmit" name="orderTrackSubmit" /> <input
												type="hidden" id="action" name="action" value="trackOrder" />
												<a  href="/"><input type="button" id="cancel" name="cancel"
												value="Cancel"/></a></td>
										</tr>
										<tr>
											<td colspan="2">&nbsp;</td>
										</tr>


									</table>
								</div>


							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</form>
	<br>
	<div>
		<div class="w-row">
			<div class="w-col w-col-6 w-clearfix">
				<div class="footer-text">Copyright © 2014 GensetGo. All rights
					reserved.</div>
			</div>
			<div class="w-col w-col-6 w-clearfix">
				<div class="footer-text footer-text1">GensetGo News | Site Map
					| Contact Us</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/webflow.js"></script>
	<script type="text/javascript">
		$(window).load(function() {
			init();
		});
	</script>
</body>
</html>