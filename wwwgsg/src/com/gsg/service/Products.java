/**
 * Copyright 2011 Google
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.gsg.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.common.collect.Multimap;
import com.google.common.collect.SetMultimap;
import com.gsg.helper.MetaData;
import com.gsg.helper.Util;

/**
 * This class defines the methods for basic operations of create, update &
 * retrieve for order entity
 * 
 * @author
 * 
 */
public class Products extends BaseService {

	/**
	 * Create an entity if it does not exist, else update the existing entity.
	 * The order has header and line item. Both needs to be added in a single
	 * transaction.
	 * 
	 * @param beneficiary
	 * @param refNum
	 * @param amount
	 * @param dte
	 * @param comments
	 * @param status
	 * 
	 * @param customerName
	 *            : customer placing the order
	 * @param itemName
	 *            : name of item
	 * @param quantity
	 *            : number of units ordered for
	 * @param price
	 *            : total price of the order
	 * @param shipTo
	 *            : address where it needs to be shipped
	 * @return
	 * @throws IOException
	 */
	public static String createPayments(String payments_type,
			String payments_date, String payments_amount, String payments_due,
			String payments_item_tot, String payments_to_account,
			String payments_mode, String payments_refno, String payments_roz,
			String assocId, String status) throws IOException {
		String paymentId = "";
		try {
			paymentId = MetaData.seqIncrStr("Payments");
			Entity payments = new Entity("Payments", paymentId);
			payments.setProperty("payments_id", paymentId);
			payments.setProperty("payments_type", payments_type);
			payments.setProperty("payments_date", payments_date);
			payments.setProperty("payments_amount", payments_amount);
			payments.setProperty("payments_due", payments_due);
			payments.setProperty("payments_item_tot", payments_item_tot);
			payments.setProperty("payments_to_account", payments_to_account);
			payments.setProperty("payments_mode", payments_mode);
			payments.setProperty("payments_refno", payments_refno);
			payments.setProperty("payments_roz", payments_roz);
			payments.setProperty("payments_reported_st", "N");
			payments.setProperty("status", status);
			payments.setProperty("summary", assocId);
			Util.persistEntity(payments);

		} finally {
		}
		return paymentId;
	}

	public static String createUpdatePayments(String paymentId,
			String[] payments_type, String payments_date,
			String payments_amount, String payments_due,
			String payments_item_tot, String payments_to_account,
			String payments_mode, String payments_refno, String payments_roz,
			String payments_round, String assocId, String status)
			throws IOException {
		try {
			String type = "";
			if (payments_type != null) {
				for (int i = 0; i < payments_type.length; i++) {
					type = type + "," + payments_type[i];
				}
			}
			if ((paymentId == null) || (paymentId.equalsIgnoreCase(""))) {
				paymentId = MetaData.seqIncrStr("Payments");
			}
			Entity payments = new Entity("Payments", paymentId);
			payments.setProperty("payments_id", paymentId);
			payments.setProperty("payments_type", type);
			payments.setProperty("payments_date", payments_date);
			payments.setProperty("payments_amount", payments_amount);
			payments.setProperty("payments_due", payments_due);
			payments.setProperty("payments_item_tot", payments_item_tot);
			payments.setProperty("payments_to_account", payments_to_account);
			payments.setProperty("payments_mode", payments_mode);
			payments.setProperty("payments_refno", payments_refno);
			payments.setProperty("payments_roz", payments_roz);
			payments.setProperty("payments_reported_st", "N");
			payments.setProperty("payments_round", payments_round);
			payments.setProperty("status", status);
			payments.setProperty("summary", assocId);
			Util.persistEntity(payments);
		} finally {
		}
		return paymentId;
	}

	public static String createPayments(String[] payments_type,
			String payments_date, String payments_amount, String payments_due,
			String payments_item_tot, String payments_to_account,
			String payments_mode, String payments_refno, String payments_roz,
			String payments_round, String assocId, String status)
			throws IOException {
		return createUpdatePayments(null, payments_type, payments_date,
				payments_amount, payments_due, payments_item_tot,
				payments_to_account, payments_mode, payments_refno,
				payments_roz, payments_round, assocId, status);
	}

	/**
	 * Get the list of orders for a specific customer
	 * 
	 * @param customerName
	 * @return the list of orders as iterable
	 */
	public static Iterable<Entity> getAllItemsForPayment(String paymentId) {
		return Util.listEntitiesNoLimit("Payments_Items", "payments_id",
				paymentId);
	}

	public static Entity getPaymentForPay(String payId) {
		return getItem("Payments", (String) getitem("Pay_Items", payId)
				.getProperty("payments_id"));
	}

	// OK
	public static Iterable<Entity> getAllCategories() {
		return Util.listEntitiesNoLimit("Product_Category", "", "");
	}

	// OK
	public static Iterable<Entity> getAllItemsforCategory(String category) {
		return Util.listEntitiesNoLimit("Product_Item", "product_category",
				category);
	}

	public static Iterable<Entity> getFilteredItems(
			SetMultimap<String, String[]> searchANDFilter, String sortPar,
			String currentCursor, int pageSize) {
		return Util.filterResult("Product_Item", searchANDFilter, sortPar,
				currentCursor, 10);

	}

	public static Iterable<Entity> getFilteredItems(
			SetMultimap<String, ArrayList> searchANDFilter, String[] sortPars) {
		Iterable<Entity> products= Util.filterResult("Product_Item", searchANDFilter, sortPars);
		//populateDetailsURL( products);
		return products;
	}

	public static void populateThumbnailURL(Iterable<Entity> products) {
		ImagesService imagesService = ImagesServiceFactory.getImagesService();
		Entity product = null;
		Iterator prodIter=products.iterator();
		while (prodIter.hasNext()) {
			product = (Entity) prodIter.next();
			product.setProperty("__image__listing_thumbnail",
					imagesService.getServingUrl( new BlobKey(""+product.getProperty("__image__side_view")),150,false));
			Util.persistEntity(product);
		}

	}
	public static void populateDetailsURL(Iterable<Entity> products) {
		ImagesService imagesService = ImagesServiceFactory.getImagesService();
		Entity product = null;
		Iterator prodIter=products.iterator();
		while (prodIter.hasNext()) {
			product = (Entity) prodIter.next();
			product.setProperty("__image__details",
					imagesService.getServingUrl( new BlobKey(""+product.getProperty("__image__side_view")),350,false));
			Util.persistEntity(product);
		}

	}
	public static Entity getBlankItem(String item) {

		Entity attr = null;

		Entity product = Util.findEntity(KeyFactory.createKey("Product_Item",
				item));
		Entity category = Util.findEntity(KeyFactory.createKey(
				"Product_Category",
				"" + product.getProperty("product_category")));

		Iterator it = category.getProperties().entrySet().iterator();

		Map.Entry pairs = (Map.Entry) it.next();
		attr = new Entity("Attributes");

		attr.setProperty("products_attribute_id", "");
		attr.setProperty("products_attribute_name", "");
		attr.setProperty("products_attribute_value", "");
		attr.setProperty("__checkbox__menu_itm", "off");

		attr.setProperty("__select__" + "products_attribute_type",
				"Text_Text_Number_Image");

		return attr;
	}

	public static Iterable<Entity> getAllPropertiesOfItem(String item) {

		ArrayList items = new ArrayList();
		Entity attr = null;

		Entity product = Util.findEntity(KeyFactory.createKey("Product_Item",
				item));
		Entity category = Util.findEntity(KeyFactory.createKey(
				"Product_Category",
				"" + product.getProperty("product_category")));
		Entity menu = Util.findEntity(KeyFactory.createKey("Menu",
				"" + product.getProperty("product_category")));
		String isMenu = "";
		Iterator it = category.getProperties().entrySet().iterator();
		String valoo = "";
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			attr = new Entity("Attributes");

			attr.setProperty(
					"products_attribute_id",
					("" + pairs.getKey()).replace("__image__", "")
							.replace("__text__", "").replace("__number__", "")
							.replace("~text~", ""));
			attr.setProperty("products_attribute_name", pairs.getValue());
			if (menu != null) {
				isMenu = (String) menu.getProperty(("" + pairs.getKey())
						.replace("__image__", "").replace("__text__", "")
						.replace("~image~", "").replace("__number__", ""));
			}
			valoo = "" + product.getProperty((String) pairs.getKey());
			if (("" + (pairs.getKey())).contains("__image__")) {
				attr.setProperty("__image__" + "products_attribute_value",
						product.getProperty((String) pairs.getKey()));
				attr.setProperty("__select__" + "products_attribute_type",
						"Image");

			} else if (("" + (pairs.getKey())).contains("__number__")) {
				if (valoo.equalsIgnoreCase("null")) {
					valoo = "0";
				}
				attr.setProperty("__number__" + "products_attribute_value",
						valoo);
				attr.setProperty("__select__" + "products_attribute_type",
						"Number");
			} else {
				if (valoo.equalsIgnoreCase("null")) {
					valoo = "";
				}
				attr.setProperty("__text__" + "products_attribute_value", valoo);
				attr.setProperty("__select__" + "products_attribute_type",
						"Text");

			}
			if (isMenu != null) {
				attr.setProperty("__checkbox__menu_itm", "on");
			} else {
				attr.setProperty("__checkbox__menu_itm", "off");
			}
			items.add(attr);
		}
		return items;
	}

	/*
	 * iterate through items of menu for a category. for the category, scan
	 * through each product for the attribute take the values and store it
	 * against the menu item menu --> label--> id --> value
	 */

	public static void populateMenuValues(String category) {
		Entity menu = Util.findEntity(KeyFactory.createKey("Menu", category));
		Entity cat = Util.findEntity(KeyFactory.createKey("Product_Category",
				category));
		Map<String, Object> catProperties = cat.getProperties();
		Map<String, Object> menuProperties = menu.getProperties();
		String valooz = " ";
		String catLabel = "";
		String productId = "";
		String valoo = "";
		for (String menuProperty : menuProperties.keySet()) {
			// get key for the label ----X
			/*
			 * for (String catProperty : catProperties.keySet()) { catLabel =
			 * ""+ cat.getProperty(catProperty);
			 * if(catLabel.equalsIgnoreCase(menuProperty)){
			 * productId=catProperty; } }
			 */
			catLabel = "" + cat.getProperty("__text__" + menuProperty);
			Iterable<Entity> productItems = Util.listEntities("Product_Item");
			valooz = "";
			for (Entity productItem : productItems) {
				valoo = ("" + productItem
						.getProperty("__text__" + menuProperty)).replace(
						"null", "");
				if (!valooz.contains(valoo)) {
					valooz = valooz + "," + valoo;
				}
			}
			valooz = catLabel + "," + valooz;
			menu.setProperty(menuProperty, valooz);
		}
		Util.persistEntity(menu);
	}

	public static Entity getMenuItems(String category) {
		return Util.findEntity(KeyFactory.createKey("Menu", category));
	}

	public static Iterable<Entity> getAllItemsForPaymentItem(
			SetMultimap<String, String> searchFilter) {
		return Util.listEntities("Payments_Items", searchFilter);
	}

	/*** NOT NEEDED PROBABLY ***/

	public static Entity getProductProperties(String productid) {
		return Util.findEntity(KeyFactory.createKey("Product_Item", productid));

	}

	public static Entity getProductCategory(String productid) {
		Entity product = getProductProperties(productid);
		return Util.findEntity(KeyFactory.createKey("Product_Category", ""
				+ (product.getProperty("product_category"))));
	}

	/* this might need to be changed some time */
	/*
	 * if include flag is not checks see if line item existed before. If yes,
	 * delete teh entry..else do nothiing if flag is checked, update for
	 * existing, insert for new
	 */
	public static void createUpdateDeleteLineItem(String payments_include,
			String payments_item_id, String payments_id,
			String payments_company, String payments_item_category,
			String payments_item_code, String payments_item_des,
			String payments_item_total, String payments_item_due) {
		try {
			Entity paymentsItem = null;
			if ((payments_include == null)) { // unchecked
				if ((payments_item_id != null)
						&& !(payments_item_id.equalsIgnoreCase(""))
						&& (Util.findEntity(KeyFactory.createKey(
								"Payments_Items", payments_item_id)) != null)) { // an
					Util.deleteEntity(KeyFactory.createKey("Payments_Items",
							payments_item_id));
				}
			} else { // create or edit depending on new or old
				if ((payments_item_total != null)
						&& !(payments_item_total.equalsIgnoreCase(""))) {
					if ((payments_item_id.equalsIgnoreCase(""))
							|| (Util.findEntity(KeyFactory.createKey(
									"Payments_Items", payments_item_id)) == null)) {
						payments_item_id = MetaData
								.seqIncrStr("Payments_Items");
						paymentsItem = new Entity("Payments_Items",
								payments_item_id);

					} else {
						paymentsItem = Util.findEntity(KeyFactory.createKey(
								"Payments_Items", payments_item_id));
					}
					paymentsItem.setProperty("payments_account",
							payments_company);
					paymentsItem.setProperty("payments_item_id",
							payments_item_id);
					paymentsItem.setProperty("payments_id", payments_id);
					paymentsItem.setProperty("payments_item_category",
							payments_item_category);
					paymentsItem.setProperty("payments_item_code",
							payments_item_code);
					paymentsItem.setProperty("payments_item_des",
							payments_item_des);
					paymentsItem.setProperty("payments_item_total",
							payments_item_total);
					paymentsItem.setProperty("payments_item_due",
							payments_item_due);
					paymentsItem.setProperty("payments_item_status", "Saved");
					Util.persistEntity(paymentsItem);
				}
			}

		} finally {
		}
	}

	public static void createUpdateDeletePayLineItem(String pay_include,
			String pay_item_id, String payments_id, String account_code,
			String pay_party, String pay_date, String pay_amount,
			String pay_ref, String pay_bank, String pay_comments) {
		try {
			Entity payItem = null;
			if ((pay_include == null)) { // unchecked
				if ((pay_item_id != null)
						&& !(pay_item_id.equalsIgnoreCase(""))
						&& (Util.findEntity(KeyFactory.createKey("pay_Items",
								pay_item_id)) != null)) { // an
					Util.deleteEntity(KeyFactory.createKey("Pay_Items",
							pay_item_id));
				}
			} else { // create or edit depending on new or old
				if ((pay_amount != null) && !(pay_amount.equalsIgnoreCase(""))
						&& !(pay_amount.equalsIgnoreCase("0"))) {
					if ((pay_item_id.equalsIgnoreCase(""))
							|| (Util.findEntity(KeyFactory.createKey(
									"Pay_Items", pay_item_id)) == null)) {
						pay_item_id = MetaData.seqIncrStr("Pay_Items");
						payItem = new Entity("Pay_Items", pay_item_id);
					} else {
						payItem = Util.findEntity(KeyFactory.createKey(
								"Pay_Items", pay_item_id));
					}
					payItem.setProperty("payments_id", payments_id);
					payItem.setProperty("pay_item_id", pay_item_id);
					payItem.setProperty("account_code", account_code);
					payItem.setProperty("pay_party", pay_party);
					payItem.setProperty("pay_date", pay_date);
					payItem.setProperty("pay_amount", pay_amount);
					payItem.setProperty("pay_ref", pay_ref);
					payItem.setProperty("pay_bank", pay_bank);
					payItem.setProperty("pay_comments", pay_comments);
					payItem.setProperty("pay_status", "Active");
					payItem.setProperty("payments_reported_st", "N");
					Util.persistEntity(payItem);
				}
			}
		} finally {
		}
	}

	public static Entity createEmptyPayLineItem() {
		try {
			String payItemId = MetaData.seqIncrStr("Pay_Items");
			return new Entity("Pay_Items", payItemId);

		} finally {
		}

	}

	public static Iterable<Entity> getProducts(String currentCursor,
			int pageSize) {
		QueryResultList<Entity> entities = (QueryResultList<Entity>) Util
				.listEntitiesLimited("Product_Item", null, null, "",
						currentCursor, pageSize);
		return entities;
	}

	public static Iterable<Entity> getAllItems() {
		// make generic later
		Iterable<Entity> entities = Util.listEntitiesNoLimit("Payments_Items",
				"", "");
		return entities;
	}

	public static Iterable<Entity> getUnreportedPayments() {
		Query query = new Query("Pay_Items"); // .addFilter("payments_reported_st",
												// FilterOperator.EQUAL, "N")
		query.addFilter("pay_status", FilterOperator.EQUAL, "Active")
				.addFilter("payments_reported_st", FilterOperator.EQUAL, "N");
		query.addSort("pay_date");
		PreparedQuery pq = DatastoreServiceFactory.getDatastoreService()
				.prepare(query);
		return pq.asIterable();
	}

	public static Iterable<Entity> getUnreportedETPayments() {
		Query query = new Query("Payments");
		query.addFilter("payments_reported_st", FilterOperator.EQUAL, "N")
				.addFilter("payments_item_category", FilterOperator.EQUAL, "ET");
		PreparedQuery pq = DatastoreServiceFactory.getDatastoreService()
				.prepare(query);
		return pq.asIterable();
	}

	public static Iterable<Entity> getUnreportedVATPayments() {
		Query query = new Query("Payments");
		query.addFilter("payments_reported_st", FilterOperator.EQUAL, "N")
				.addFilter("payments_item_category", FilterOperator.EQUAL,
						"VAT");
		PreparedQuery pq = DatastoreServiceFactory.getDatastoreService()
				.prepare(query);
		return pq.asIterable();
	}

	public static void markPaymentReportedST(String returns_payments_id) {
		Key key = KeyFactory.createKey("Pay_Items", returns_payments_id);
		Entity payments = Util.findEntity(key);
		if (payments != null) {
			payments.setProperty("payments_reported_st", "Y");
			Util.persistEntity(payments);
		}
	}

	public static void markPaymentNotReportedST(String returns_payments_id) {
		Key key = KeyFactory.createKey("Pay_Items", returns_payments_id);
		Entity payments = Util.findEntity(key);
		if (payments != null) {
			payments.setProperty("payments_reported_st", "N");
			Util.persistEntity(payments);
		}
	}
}
