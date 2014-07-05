<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%
	BlobstoreService blobstoreService = BlobstoreServiceFactory
			.getBlobstoreService();
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Retail Management Suite - RMS</title>
<link href="css/ph_core.css" rel="stylesheet" type="text/css" />
<link href="css/tablesorter.css" rel="stylesheet" type="text/css" />
<link href="css/codesite.pack.04102009.css" rel="stylesheet"
	type="text/css" />
<link rel="stylesheet" href="css/jquery-ui-1.10.2.custom.css"
	type="text/css">
	<script language="javascript" src='script/jquery-1.9.1.js'></script>
	<script language="javascript" src='script/jquery-ui-1.10.2.custom.js'></script>
	<script language="javascript" src='script/jquery.validate.min.js'></script>
	<script language="javascript" src='script/jquery.validate.js'></script>
	<script language="javascript" src='script/additional-methods.js'></script>
	<script language="javascript" src='script/additional-methods.min.js'></script>

	<script language="javascript" src='script/ajax.util.js'></script>
	<script language="javascript" src='script/jquery.tablesorter.js'></script>
	<script language="javascript"
		src='script/jquery.tablesorter.widgets.js'></script>
	<script language="javascript" type="text/javascript"
		src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.10.0/jquery.validate.min.js"></script>
</head>
<body>

	<!-- content -->
	<div id="gc-pagecontent">
		<div id="gc-topnav">
			<div id="gc-header">
				<div id="gc-logo-img"></div>
			</div>
		</div>
		<!-- tabs -->
		<div id="tabs" class="gtb">
			<a id="products" href="#products" class="tab">Product</a>
			<div class="gtbc"></div>
		</div>
	</div>
	<!-- *******************************************Products ******************************************* -->
	<div class="g-unit" id="products-tab">
		<div class="menuDiv" id="products-menu-ctr">
			<div class="menuCategory">Products</div>
			<div class="menuItem" id="menuItem">
				<a href="#products" id="products">Manage Products</a>
			</div>
			<div class="menuItem" id="menuItem">
				<a href="#menu" id="menu">Manage Menu</a>
			</div>

		</div>

		<div class="displayArea" id="products-display">
			<div id="products-show-message" style="display: none" class="error"></div>
			<div class="gsc-search-box" id="products-search-ctr">
				<!-- section title -->
				<h2>Products</h2>
				<form name="products-search-form" id="products-search-form">
					<input type="text" name="q" id="q" class="gsc-input" /> <input
						type="button" value="Add" onclick="add('products')"
						class="gsc-search-button" />
				</form>
			</div>
			<div class="results" style="border: 0;" id="products-list-ctr">
				<table width="100%" cellspacing="0" cellpadding="2" border="0"
					style="border-collapse: collapse;" id="productsTable"
					class="tablesorter">
					<thead>
						<tr>
							<th scope="col" width="8%">Product</th>
							<th scope="col" width="8%">Category</th>
							<th scope="col" width="8%">Action</th>

						</tr>
					</thead>
					<tbody id="products-list-tbody"></tbody>
				</table>
				<table width="10%" cellspacing="0" cellpadding="2"
					style="float: right" id="productsTableFooter" class="noborder">
					<tbody id="products-list-footer-tbody"></tbody>
				</table>
				<input type="hidden" id="products-currentPage"
					name="products-currentPage" value="1"></input>
			</div>
			<div class="create-ctr" id="products-create-ctr">
				<h2>Product Details</h2>
				<form name="products-create-form" id="products-create-form"
					enctype="multipart/form-data" method="post"
					action="<%=blobstoreService.createUploadUrl("/products")%>
					">
					<table width="100%" class="noborder" id="products_master"
						name="products_master">
						<tr>
							<td colspan=3 class="noborder">
								<table cellspacing="0" cellpadding="0" width='100%'
									id="tbl_products">
									<tbody>
										<thead>
											<tr>
												<th scope="col" colspan='8'>Details</th>
											</tr>
										</thead>
										<tr id="trowproductsDet">
											<td>Category</td>
											<td><span class="readonly"><select
													name="products_category" id="products_category">
														<option>GE 300D</option>

												</select></span> <span class="readonly"><input type="text"
													autocomplete="off" class="gsc-input-autocomplete"
													maxlength="2048" name="products_category_new"
													id="products_category_new" /></td>
											<td>Item</td>
											<td><span class="readonly"><select
													name="products_item" id="products_item">
												</select></span> <span class="readonly"><span class="textarea"><input
														type="text" id="products_item_new"
														name="products_item_new" /> </span></td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td class="noborder">
								<h4>Product Attributes</h4>
							</td>
						</tr>

						<tr>
							<td class="noborder">
								<table cellspacing="0" cellpadding="0" id="tbl_products_item"
									width="100%" id="tbl_products_item" class="noborder">
									<tbody>
										<thead>
											<tr>
												<th scope="col" colspan=5>C A T E G O R Y</th>
												<th scope="col" >P R O D U C T</th>
											</tr>
											<tr id="thead">
												<th scope="col" width="1%">Delete</th>
												<th scope="col" width="1%">Menu?</th>
												<th scope="col" width="3%">Type</th>
												<th scope="col" width="5%">Attribute ID</th>
												<th scope="col" width="5%">Attribute Name</th>
												<th scope="col">Value</th>
											</tr>
										</thead>
										<tr id="item_trow">
											<td><span class="readonly"><input type="checkbox"
													style="width: 100%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="menu_delete" id="menu_delete" /></span></td>
											<td><div name="menu_itm"
													id="menu_itm"></div></td>
											<td><div name="products_attribute_type"
													id="products_attribute_type"></div></td>
											<td><div style="width: 90%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="products_attribute_id" id="products_attribute_id">
												</div></td>
											<td><div style="width: 90%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="products_attribute_name" id="products_attribute_name">
												</div></td>
											<td><div name="products_attribute_value"
													id="products_attribute_value"
													class="gsc-input-autocomplete"  maxlength="2048"></div> <!-- <a id = "__image__products_attribute_value" name="__imag__products_attribute_value">helllo</a>
											<input type="text"
													style="width: 100%;" autocomplete="off" class="gsc-input"
													maxlength="2048" name="__text__products_attribute_value"
													id="__text__products_attribute_value" />
													<input type="file"
													style="width: 100%;" autocomplete="off" class="gsc-input"
													maxlength="2048" name="__file__products_attribute_file_value"
													id="__file__products_attribute_file_value" />
													</span>
													 --></td>
										</tr>
									</tbody>
								</table> <input type="button" id="item_products_add" class="save"
								title="Save" value="Add Category Attribute" />
							</td>
						</tr>
					</table>
					<table width='100%' class="noborder">
						<tbody>
							<tr>
								<td class="noborder"><input type="hidden"
									id="category_status" name="category_status" /><input
									type="submit" id="products_save" class="add" title="Save"
									value="Savee" name="products_save" /><input type="button"
									id="products_submit" class="add" title="Submit" value="Submit"
									onclick="formValidate('products','submit')" /><input
									type="button" id="products_sms" class="add" title="Send SMS"
									value="Send SMS" onclick="formValidate('products','sendMsg')" /><input
									type="button" id="cancel_products" class="add"
									title="cancel_products" value="Cancel products"
									onclick="cancelord('products')" /><input type="button"
									id="back_products" class="cancel" title="Back" value="Back"
									onclick="cancel('products')" /> <input type="hidden"
									id="tbl_products_item_roz" name="tbl_products_item_roz"
									value="0" style="visibility:" /> <input type="text"
									id="tbl_pay_item_roz" name="tbl_pay_item_roz" value="1"
									style="visibility: hidden" /><input type="text"
									id="stock_total" name="products_total"
									style="visibility: hidden" /> <input type="text"
									id="products_item_total" name="item_total"
									style="visibility: hidden" /></td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		</div>


		<div class="displayArea" id="menu-display">
			<div id="menu-show-message" style="display: none" class="error"></div>
			<div class="gsc-search-box" id="menu-search-ctr">
				<!-- section title -->
				<h2>menu</h2>
				<form name="menu-search-form" id="menu-search-form">
					<input type="text" name="q" id="q" class="gsc-input" /> <input
						type="button" value="Add" onclick="add('menu')"
						class="gsc-search-button" />
				</form>
			</div>
			<div class="results" style="border: 0;" id="menu-list-ctr">
				<table width="100%" cellspacing="0" cellpadding="2" border="0"
					style="border-collapse: collapse;" id="menuTable"
					class="tablesorter">
					<thead>
						<tr>
							<th scope="col" width="8%">Product</th>
							<th scope="col" width="8%">Category</th>
							<th scope="col" width="8%">Action</th>

						</tr>
					</thead>
					<tbody id="menu-list-tbody"></tbody>
				</table>
				<table width="10%" cellspacing="0" cellpadding="2"
					style="float: right" id="menuTableFooter" class="noborder">
					<tbody id="menu-list-footer-tbody"></tbody>
				</table>
				<input type="hidden" id="menu-currentPage"
					name="menu-currentPage" value="1"></input>
			</div>
			<div class="create-ctr" id="menu-create-ctr">
				<h2>Product Details</h2>
				<form name="menu-create-form" id="menu-create-form"
					enctype="multipart/form-data" method="post"
					action="<%=blobstoreService.createUploadUrl("/menu")%>
					">
					<table width="100%" class="noborder" id="menu_master"
						name="menu_master">
						<tr>
							<td colspan=3 class="noborder">
								<table cellspacing="0" cellpadding="0" width='100%'
									id="tbl_menu">
									<tbody>
										<thead>
											<tr>
												<th scope="col" colspan='8'>Details</th>
											</tr>
										</thead>
										<tr id="trowmenuDet">
											<td>Category</td>
											<td><span class="readonly"><select
													name="menu_category" id="menu_category">
														<option>GE 300D</option>

												</select></span> <span class="readonly"><input type="text"
													autocomplete="off" class="gsc-input-autocomplete"
													maxlength="2048" name="menu_category_new"
													id="menu_category_new" /></td>
											<td>Item</td>
											<td><span class="readonly"><select
													name="menu_item" id="menu_item">
												</select></span> <span class="readonly"><span class="textarea"><input
														type="text" id="menu_item_new"
														name="menu_item_new" /> </span></td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td class="noborder">
								<h4>Product Attributes</h4>
							</td>
						</tr>

						<tr>
							<td class="noborder">
								<table cellspacing="0" cellpadding="0" id="tbl_menu_item"
									width="100%" id="tbl_menu_item" class="noborder">
									<tbody>
										<thead>
											<tr>
												<th scope="col" colspan=4>C A T E G O R Y</th>
												<th scope="col" >P R O D U C T</th>
											</tr>
											<tr id="thead">
												<th scope="col" width="2%">Delete</th>
												<th scope="col" width="2%">Menu?</th>
												<th scope="col" width="8%">Type</th>
												<th scope="col" width="8%">Attribute ID</th>
												<th scope="col" width="8%">Attribute Name</th>
												<th scope="col" width="8%">Value</th>
											</tr>
										</thead>
										<tr id="item_trow">
											<td><span class="readonly"><input type="checkbox"
													style="width: 100%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="menu_delete" id="menu_delete" /></span></td>
											<td><span class="readonly"><input type="checkbox"
													style="width: 100%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="menu_itm" id="menu_itm" /></span></td>

											<td><div name="menu_attribute_type"
													id="menu_attribute_type"></div></td>
											<td><div style="width: 90%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="menu_attribute_id" id="menu_attribute_id">
												</div></td>
											<td><div style="width: 90%;" autocomplete="off"
													class="gsc-input-autocomplete" maxlength="2048"
													name="menu_attribute_name" id="menu_attribute_name">
												</div></td>
											<td><div name="menu_attribute_value"
													id="menu_attribute_value"
													class="gsc-input-autocomplete"></div> <!-- <a id = "__image__menu_attribute_value" name="__imag__menu_attribute_value">helllo</a>
											<input type="text"
													style="width: 100%;" autocomplete="off" class="gsc-input"
													maxlength="2048" name="__text__menu_attribute_value"
													id="__text__menu_attribute_value" />
													<input type="file"
													style="width: 100%;" autocomplete="off" class="gsc-input"
													maxlength="2048" name="__file__menu_attribute_file_value"
													id="__file__menu_attribute_file_value" />
													</span>
													 --></td>
										</tr>
									</tbody>
								</table> <input type="button" id="item_menu_add" class="save"
								title="Save" value="Add Category Attribute" />
							</td>
						</tr>
					</table>
					<table width='100%' class="noborder">
						<tbody>
							<tr>
								<td class="noborder"><input type="hidden"
									id="category_status" name="category_status" /><input
									type="submit" id="menu_save" class="add" title="Save"
									value="Savee" name="menu_save" /><input type="button"
									id="menu_submit" class="add" title="Submit" value="Submit"
									onclick="formValidate('menu','submit')" /><input
									type="button" id="menu_sms" class="add" title="Send SMS"
									value="Send SMS" onclick="formValidate('menu','sendMsg')" /><input
									type="button" id="cancel_menu" class="add"
									title="cancel_menu" value="Cancel menu"
									onclick="cancelord('menu')" /><input type="button"
									id="back_menu" class="cancel" title="Back" value="Back"
									onclick="cancel('menu')" /> <input type="hidden"
									id="tbl_menu_item_roz" name="tbl_menu_item_roz"
									value="0" style="visibility:" /> <input type="text"
									id="tbl_pay_item_roz" name="tbl_pay_item_roz" value="1"
									style="visibility: hidden" /><input type="text"
									id="stock_total" name="menu_total"
									style="visibility: hidden" /> <input type="text"
									id="menu_item_total" name="item_total"
									style="visibility: hidden" /></td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		</div>



	</div>

	<script type="text/javascript">
		$(window).load(function() {
			init();
		});
	</script>
</body>
</html>
