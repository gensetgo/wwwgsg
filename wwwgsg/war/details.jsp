<%@ page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@ page import="com.google.appengine.api.datastore.Entity"%>
<%@ page import="com.google.appengine.api.datastore.KeyFactory"%>
<%@ page import="com.gsg.service.Products"%>

<%
	BlobstoreService blobstoreService = BlobstoreServiceFactory
			.getBlobstoreService();
	String productid = request.getParameter("id");
	Entity category = Products.getProductCategory(productid);
	Entity product = Products.getProductProperties(productid);

	String maxPower = "" + product.getProperty("__text__maxPower");
	String maxPowerCat = "" + category.getProperty("__text__maxPower");

	String ratedPower = "" + product.getProperty("__text__rating");
	String ratedPowerCat = "" + category.getProperty("__text__rating");

	String acVoltage = "" + product.getProperty("__text__acVoltage");
	String acVoltageCat = ""
			+ category.getProperty("__text__acVoltage");

	String alternatorType = ""
			+ product.getProperty("__text__alternatorType");
	String alternatorTypeCat = ""
			+ category.getProperty("__text__alternatorType");

	String engineType = "" + product.getProperty("__text__engineType");
	String engineTypeCat = ""
			+ category.getProperty("__text__engineType");

	String startingSystem = ""
			+ product.getProperty("__text__startingSystem");
	String startingSystemCat = ""
			+ category.getProperty("__text__startingSystem");

	String fuel = "" + product.getProperty("__text__fuel");
	String fuelCat = "" + category.getProperty("__text__fuel");

	String applications = ""
			+ product.getProperty("__text__application");
	String applicationsCat = ""
			+ category.getProperty("__text__application");

	String highlight1 = "" + product.getProperty("__text__highlight1");
	String highlight1Cat = ""
			+ category.getProperty("__text__highlight1");

	String highlight2 = "" + product.getProperty("__text__highlight2");
	String highlight2Cat = ""
			+ category.getProperty("__text__highlight2");

	String highlight3 = "" + product.getProperty("__text__highlight3");
	String highlight3Cat = ""
			+ category.getProperty("__text__highlight3");

	String analysis = "" + product.getProperty("__text__analysis");
%>


<!DOCTYPE html>
<html data-wf-site="52e67a271d6760632b0009d7">
<head>
<meta charset="utf-8">
<title>Features | Brands | Prices | Generator | Bhagalpur |
	Bihar | kva | 3 phase</title>
<meta name="description"
	content="Factors to consider when buying a genset. prices, features, running cost, fuel efficiency, finance availability are major factors">
<meta name="keywords"
	content="Generator price features running cost fuel efficiency maintenance finance ">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="google-site-verification"
	content="DDCWNm_msPgeMil4R3PAdmS_pBL417Y_acV9cvhYwjc">
<link rel="stylesheet" type="text/css" href="css/webflow.css">
<link rel="stylesheet" type="text/css"
	href="css/vikramshila-agency.webflow.css">
<link href='http://fonts.googleapis.com/css?family=Shadows+Into+Light'
	rel='stylesheet' type='text/css'>
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
<script language="javascript" src='script/ajax.utils.js'></script>

<script>
	if (/mobile/i.test(navigator.userAgent))
		document.documentElement.className += ' w-mobile';
</script>
<link rel="shortcut icon" type="image/x-icon"
	href="https://y7v4p6k4.ssl.hwcdn.net/52e67a271d6760632b0009d7/52eec3e0672b98eb65000698_vsa_fav.png">
<!--[if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.min.js"></script><![endif]-->
<link rel="apple-touch-icon" href="images/vsa_fav.jpg">
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
</head>
<body>
	<%@include file="header.jsp"%>

	<div class="detailsection">
		<div class="w-row row2">
			<div class="w-col w-col-12">
				<div class="sectioncyl" id="alcyl">

					<div id="listing-items">
						<div class="listing-w-row ">
							<div class="w-col w-col-4">
								<br /> <img height="350" width="350"
									src="<%=product.getProperty("__image__details")%>"
									alt="52ee9da9db9a854a4e0004b9_call.png" class="details-image">

							</div>
							<div class="w-col w-col-4 details-p1box">
								<h6>
									<a
										href="listing.jsp?category=<%=product.getProperty("product_category")%>">
										<%=product.getProperty("product_category")%></a> > <a
										href="details.jsp?id=<%=productid%>"><%=product.getProperty("__text__brand")%>
										<%=product.getProperty("__text__model")%></a>
								</h6>
								<div class="details-item-title"><%=product.getProperty("__text__brand")%>
									<%=product.getProperty("__text__model")%></div>
								<br />
								<div class="separator"></div>

								<div class="details-item-summary"><%=product.getProperty("__text__details_summary")%></div>
								<div class="separator"></div>
								<br />
								<div class="details-item-price">
									Rs
									<%=("" + product.getProperty("__number__price")).replace(
					"null", "")%>
								</div>
								<a href="order.jsp?id=<%=productid%>">
									<div class="button">ORDER >></div>
								</a> <br /> <br /> <br />
								<%
									for (int i = 1; i < 10; i++) {
										String commercialTerm = ""
												+ product.getProperty("__text__commercialTerm" + i);
										if (!commercialTerm.equalsIgnoreCase("null")) {
								%>
								<div class="w-list-unstyled"><%=commercialTerm%></div>
								<%
									}
									}
								%>

							</div>
							<div class="w-col w-col-4 details-p1box-features">

								<%
									for (int i = 1; i < 10; i++) {
										String feature = ""
												+ product.getProperty("__text__details_feature" + i);
										if (!(feature.equalsIgnoreCase("null"))
												&& (!feature.equalsIgnoreCase(""))) {
								%>
								<div class="item-details-features">
									<img src="/images/screw.jpg" width="20px" height="20px" />
									<%=feature%>
								</div>
								<%
									}
									}
								%>
							</div>
						</div>
					</div>
					<div id="listing-items">
						<div class="listing-w-row ">
							<div class="w-col w-col-55">
								<div class="summ">
									<div class="header-band-gray-small">Product
										Specifications</div>
									<table class="specs-table">
										<%
											if (!maxPower.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=maxPowerCat%></td>
											<td class="specs-value"><%=maxPower%> VA</td>
										</tr>
										<%
											}
										%>

										<%
											if (!ratedPower.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=ratedPowerCat%></td>
											<td class="specs-value"><%=ratedPower%> VA</td>
										</tr>
										<%
											}
										%>

										<%
											if (!acVoltage.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=acVoltageCat%></td>
											<td class="specs-value"><%=acVoltage%> Volt</td>
										</tr>
										<%
											}
										%>

										<%
											if (!alternatorType.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=alternatorTypeCat%></td>
											<td class="specs-value"><%=alternatorType%></td>
										</tr>
										<%
											}
										%>

										<%
											if (!engineType.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=engineTypeCat%></td>
											<td class="specs-value"><%=engineType%></td>
										</tr>
										<%
											}
										%>

										<%
											if (!startingSystem.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=startingSystemCat%></td>
											<td class="specs-value"><%=startingSystem%></td>
										</tr>
										<%
											}
										%>

										<%
											if (!fuel.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=fuelCat%></td>
											<td class="specs-value"><%=fuel%></td>
										</tr>
										<%
											}
										%>

										<%
											if (!applications.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=applicationsCat%></td>
											<td class="specs-value"><%=applications%></td>
										</tr>
										<%
											}
										%>

										<%
											if (!highlight1.equalsIgnoreCase("null")) {
										%>
										<tr>
											<td class="specs-key"><%=highlight1Cat%></td>
											<td class="specs-value"><%=highlight1%></td>
										</tr>
										<%
											}
										%>

									</table>
									<br /> <br />


								</div>
							</div>
							<div class="w-col w-col-15"></div>
							<div class="w-col w-col-55">
								<div class="summ">
									<div class="header-band-gray-small">GensetGo's Analysis</div>
									<br />
									<%
										if (!analysis.equalsIgnoreCase("null")) {
									%>
									<%=analysis%>
									<%
										}
									%>

								</div>
							</div>

						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
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
	<script type="text/javascript"
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="js/webflow.js"></script>

	<script type="text/javascript">
		$(window).load(function() {
			init();
		});
	</script>
</body>
</html>