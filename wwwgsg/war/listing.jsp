<%@ page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@ page import="com.google.appengine.api.datastore.Entity"%>
<%@ page import="com.google.appengine.api.datastore.KeyFactory"%>
<%@ page import="com.gsg.service.Products"%>
<%@ page import="java.util.Enumeration"%>
<%@ page import="com.google.common.collect.SetMultimap"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="com.google.common.collect.HashMultimap"%>
<%@ page import="java.util.StringTokenizer"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.TreeMap"%>

<%
	BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	Iterable<Entity> entities = null;
	String category = request.getParameter("category");
	Enumeration<String> en = request.getParameterNames();
	SetMultimap<String, ArrayList> searchFilter = HashMultimap.create();
	ArrayList a = new ArrayList();
	String[] sortPars = null;

	while (en.hasMoreElements()) {
		String par = (String) en.nextElement();
		if (par.toLowerCase().contains("__filter__")) {
		String[] pars = request.getParameterValues(par);
		for (int i = 0; i < pars.length; i++) {
			a.add(pars[i]);
		}
		searchFilter.put(par.replace("__filter__", "__text__"), a);
		}
		if (par.toLowerCase().contains("__sort__")) {
		sortPars = request.getParameterValues(par);
		}
	}
	ArrayList cat = new ArrayList();
	cat.add(category);
	searchFilter.put("product_category", cat);
	entities = Products.getFilteredItems(searchFilter,sortPars);
	Entity menu=Products.getMenuItems(category);
	Map<String, Object> treeMap =null;
	Map <String , Object> properties =null;
	if(menu!=null){
	 properties = menu.getProperties(); 
	 treeMap = new TreeMap<String, Object>(properties);
	}
	String dressedOption="";
	String menuLabel="";
%>

<!DOCTYPE html>
<html>
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
<script language="javascript" src='script/ajax.util.js'></script>

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
	<div class="masalasection">
		<div class="w-row row2">
			<div id="listing-menu" class="w-col w-col-2 menu listing-menu-items ">
				<%
					if(menu!=null){
																										for(String key : treeMap.keySet()) {
				%>
				<%
					StringTokenizer options = new StringTokenizer((""+treeMap.get(key)),",");
																										menuLabel= (""+options.nextElement()).trim() ;
				%>
				<div class="menuHeader"><%=menuLabel%></div>
				<%
					while (options.hasMoreElements()) {
																											dressedOption = (""+options.nextElement()).trim() ;
																											if(!dressedOption.equalsIgnoreCase("")){
				%>
				<li class="menuItemLine">
					<%
						if(searchFilter.get("__text__"+key).toString().contains(dressedOption)) {
					%> <input class="menuSelectBox" type="checkbox"
					value="<%=dressedOption%>" name="__filter__<%=key%>"
					onclick="showlist(<%=category%>)" checked />
					<div class="menuSelectBoxLabel">
						<%=dressedOption%></div>
				</li>

				<%
					}else{
				%>
				<input class="menuSelectBox" type="checkbox"
					value="<%=dressedOption%>" name="__filter__<%=key%>"
					onclick="showlist('<%=category%>')" />
				<div class="menuSelectBoxLabel"><%=dressedOption%></div>
				</li>
				<%
					}
				%>
				<%
					}}}}
				%>
			</div>

			<div class="w-col w-col-10 material">
				<div class="breadcrumb">
					<a href="/">Home</a> > <a href="listing.jsp?category=<%=category%>">
						<%=category%></a>
				</div>

				<div class="sectioncyl" id="alcyl">
					<div class="listing-header"><%=category%></div>
					<input type="hidden" name="category" id="category" value="<%=category%>" />
					<div class="listing-sort">
						Sort by: <select id="__sort__listing" name="__sort__listing">
							<option value="-__number__price">Price - High to Low</option>
							<option value="+__number__price">Price - Low to High</option>
							<option value="-__number__rating">Rating - High to Low</option>
							<option value="+__number__rating">Rating - Low to High</option>
						</select>
					</div>

					<div id="listing-items">

						<%
							int curcol=1;
											int currow=1;
											for (Entity product : entities) {
												if (curcol > 4) {
												curcol = 1;
												currow++;
						%>
						<div class="listing-w-row ">
							<%
								} //else {
																																																																	curcol++;
							%>
							<div class="listing-w-row ">
								<div class="w-col w-col-3 listing-p1box">
									<div class="summ">
										<a class="greylink"
											href="details.jsp?id=<%=product.getKey().getName()%>"><img height="150" width="150"
											src="<%=product.getProperty("__image__listing_thumbnail") %>"
											alt="52ee9da9db9a854a4e0004b9_call.png"> <br />
											<div class="listing-item-title"><%=product.getProperty("__text__brand")%>
												<%=product.getProperty("__text__model")%>
											</div> </a>
										<div class="listing-item-price">
											Rs
											<%=(""+product.getProperty("__number__price")).replace("null","")%></div>
										<%
											String rating=""+product.getProperty("__number__rating");
																										if((!rating.equalsIgnoreCase(""))&&(!rating.equalsIgnoreCase(""))){
										%>
										<div class="listing-item-details-point">
											<%=rating%>
											VA
										</div>
										<%
											}
																											String fuel=""+product.getProperty("__text__fuel");
																											if(!fuel.equalsIgnoreCase("null")){
										%>
										<div class="listing-item-details-point">
											<%=fuel%>
											operated
										</div>
										<%
											}
																											String start=""+product.getProperty("__text__startingSystem");
																										if(!start.equalsIgnoreCase("null")){
										%>
										<div class="listing-item-details-point">
											<%=start%></div>
										<%
											}
																										String listingFeature=""+product.getProperty("__text__listingFeature");
																										if(!listingFeature.equalsIgnoreCase("null")){
										%>
										<div class="listing-item-details-point">
											<%=listingFeature%></div>
										<%
											}
										%>
									</div>

								</div>
							</div>
							<%
								//}
																																																													     }
							%>

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
				<div class="footer-text">Copyright © 2014 GensetGo. All
					rights reserved.</div>
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