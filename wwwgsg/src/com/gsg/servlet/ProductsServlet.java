/**
 * Copyright 2011, Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.gsg.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
import com.gsg.exception.GSGException;
import com.gsg.helper.Search;
import com.gsg.helper.Util;
import com.gsg.service.Products;
import com.gsg.service.RuleEngine;

/**
 * This servlet responds to the request corresponding to items. The class
 * creates and manages the ItemEntity
 * 
 * @author
 */
@SuppressWarnings("serial")
public class ProductsServlet extends BaseServlet {

	private static final Logger logger = Logger.getLogger(ProductsServlet.class
			.getCanonicalName());
	private BlobstoreService blobstoreService = BlobstoreServiceFactory
			.getBlobstoreService();

	/**
	 * Searches for the entity based on the search criteria and returns result
	 * in JSON format
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			super.doGet(req, resp);
			String code = "";
			String command = req.getParameter("command");
			// searchFor = "SET";
			PrintWriter out = resp.getWriter();
			StringBuilder sb = new StringBuilder();
			Iterable<Entity> entities = null;
			String currentCursor = req.getParameter("currentCursor");

			if (command.equalsIgnoreCase("edit_item")) {
				code = req.getParameter("code");
				entities = Products.getAllPropertiesOfItem(code);
				out.println(Util.writeJSON(entities));
			} else if (command.equalsIgnoreCase("edit_onenewrow")) {
				code = req.getParameter("code");
				Entity entity = Products.getBlankItem(code);
				out.println(Util.writeJSON(entity));
			} else if (command.equalsIgnoreCase("edit_new")) {
				code = req.getParameter("code");
				if (code.equalsIgnoreCase("category")) {
					entities = Products.getAllCategories();
					out.println(Util.writeJSON(entities));
				} else if (code.equalsIgnoreCase("product_items")) {
					String category = req.getParameter("category");
					entities = Products.getAllItemsforCategory(category);
					out.println(Util.writeJSON(entities));
				} else {
					entities = Products.getAllCategories();
					out.println(Util.writeJSON(entities));
				}
			} else if (command.equalsIgnoreCase("productlist")) {
				String category = req.getParameter("category");
				Enumeration<String> en = req.getParameterNames();

				SetMultimap<String, ArrayList> searchFilter = HashMultimap
						.create();
				String[] sortPars = null;
				ArrayList a = new ArrayList();
				while (en.hasMoreElements()) {
					String par = (String) en.nextElement();
					if (par.toLowerCase().contains("__filter__")) {
						String[] pars = req.getParameterValues(par);

						for (int i = 0; i < pars.length; i++) {
							a.add(pars[i]);
						}
						searchFilter.put(par.replace("__filter__", "__text__"),
								a);
					}
					if (par.toLowerCase().contains("__sort__")) {
						sortPars = req.getParameterValues(par);

					}
				}
				ArrayList cat = new ArrayList();
				cat.add(category);
				searchFilter.put("product_category", cat);
				entities = Products.getFilteredItems(searchFilter, sortPars);
				out.println(Util.writeJSON(entities));
			} else if (command.equalsIgnoreCase("menulist")) {
				String category = req.getParameter("category");
				Entity menu = Util.findEntity(KeyFactory.createKey("Menu",
						category));
				out.println(Util.writeJSON(menu));
			} else if (command.equalsIgnoreCase("suggest ")) {
				String searchBy = req.getParameter("pl-searchby");
				String searchFor = req.getParameter("q");
				searchFor = req.getParameter("term");
				SetMultimap<String, String> filter = Search
						.getFullText(searchFor);
				sb.append("[");
				Iterator it = filter.values().iterator();
				while (it.hasNext()) {
					sb.append("\"" + it.next().toString() + "\",");
				}
				sb.deleteCharAt(sb.lastIndexOf(","));
				sb.append("]");
				// entities = PL.getPL(filter);
				out.println(sb.toString());
				// System.out.println(sb.toString());
			} else if (command.equalsIgnoreCase("list")) {
				entities = Products.getProducts(currentCursor, 22);
				out.println(Util.writeJSONPaginated(entities, 15));
				// out.println(Util.writeJSON(entities));
			}
		} catch (Exception e) {
			resp.getWriter().println(Util.writeJSONError(e.getMessage()));
			e.printStackTrace();
			// resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
			logger.log(Level.SEVERE,e.getMessage(),e);
			// Util.writeJSONError(e.getMessage()));
		}
	}

	protected void doTxn(String products_id) throws ServletException,
			IOException {

		Entity payment = Products.getitem("Products", products_id);
		String products_date = (String) payment.getProperty("products_date");

		Iterable<Entity> productsItems = Products
				.getAllItemsForPayment(products_id);
		Iterable<Entity> productsItemsDups = null;
		SetMultimap<String, String> dupResult = HashMultimap.create();
		// perform validation ..

		String products_item_des = "";
		String products_item_due = "";
		String products_account = "";
		String products_item_code = "";
		String products_item_category = "";
		String products_item_total = "";
		String assocId = "";
		String payment_item_id = "";
		for (Entity productsItem : productsItems) {
			products_item_code = (String) productsItem
					.getProperty("products_item_code");
			products_item_category = (String) productsItem
					.getProperty("products_item_category");

			SetMultimap<String, String> searchFilter = HashMultimap.create();
			searchFilter.put("item_code", products_item_code);
			searchFilter.put("item_category", products_item_category);
			productsItemsDups = Products
					.getAllItemsForPaymentItem(searchFilter);
			for (Entity productsItemsDup : productsItemsDups) {
				int dupProducts_id = Integer.parseInt((String) productsItemsDup
						.getProperty("products_id"));
				if (dupProducts_id > Integer.parseInt(products_id)) {
					dupResult.put(products_item_category + products_item_code,
							"" + dupProducts_id);
				}
			}
		}

		for (Entity productsItem : productsItems) {
			products_item_code = (String) productsItem
					.getProperty("products_item_code");
			products_item_category = (String) productsItem
					.getProperty("products_item_category");
			products_item_total = (String) productsItem
					.getProperty("products_item_total");
			products_item_des = (String) productsItem
					.getProperty("products_item_des");
			products_item_due = (String) productsItem
					.getProperty("products_item_due");
			products_account = (String) productsItem
					.getProperty("products_account");

			if (products_item_category.equalsIgnoreCase("order")) {
				assocId = assocId + ", " + "Order: " + products_item_code;
				// Order.paymentDone(products_item_code, products_item_total);
			} else if (products_item_category.equalsIgnoreCase("expense")) {
				assocId = assocId + ", " + "Exp: " + products_item_code;
				if (products_item_code.equalsIgnoreCase("new")) {
					// products_item_code =
					// Expense.createNpayExpense(products_date,
					// products_item_des, products_item_due,
					// products_item_total, products_account);
					productsItem.setProperty("products_item_code",
							products_item_code);
					// Util.persistEntity(productsItem);
				} else {
					// Expense.paymentDone(products_item_code,
					// products_item_total);
				}
			} else if (products_item_category.equalsIgnoreCase("sale")) {
				assocId = assocId + ", " + "Sale: " + products_item_code;
				// Stock.paymentRecieved(products_item_code,
				// products_item_total);
			} else if (products_item_category.equalsIgnoreCase("et")) {
				assocId = assocId + ", " + "ET: " + products_item_code;
				// PurchaseDetails.eTPaid(products_item_code,
				// products_item_total);
			} else if (products_item_category.equalsIgnoreCase("vat")) {
				assocId = assocId + ", " + "VAT: " + products_item_code;
				// Stock.vATPaid(products_item_code, products_item_total);
			} else if (products_item_category.equalsIgnoreCase("incentive")) {
				assocId = assocId + ", " + "Incen: " + products_item_code;
				// Stock.incentivePaid(products_item_code, products_item_total);
			} else if (products_item_category.equalsIgnoreCase("advance")) {
				assocId = assocId + ", " + "Advance: " + products_item_code;
				if (products_item_code.equalsIgnoreCase("new")) {
					// products_item_code = Advance.createAdvance(products_id,
					// products_account, products_date, products_item_total,
					// "");
					productsItem.setProperty("products_item_code",
							products_item_code);
					// Util.persistEntity(productsItem);
				} else {
					// Advance.consume(products_item_code, products_item_total);
				}
			}
			productsItem.setProperty("products_item_status", "Submitted");
			Util.persistEntity(productsItem);
		}

		payment.setProperty("status", "Submitted");
		payment.setProperty("summary", assocId.replaceFirst("", ""));
		Util.persistEntity(payment);
	}

	protected void doSendMsg(String productsid, HttpServletRequest req,
			HttpServletResponse resp) throws ServletException, IOException,
			GSGException {
		String products_id = "";
		if ((productsid == null) || (productsid.equalsIgnoreCase(""))) {
			products_id = req.getParameter("products_id");
		} else {
			products_id = productsid;
		}
		Entity payment = Products.getitem("Products", products_id);
		String products_date = (String) payment.getProperty("products_date");
		String products_item_tot = ""
				+ payment.getProperty("products_item_tot");
		String msg = "";
		String response = "";
		PrintWriter out = resp.getWriter();
		try {
			if (Double.parseDouble(products_item_tot) < 0) {
				msg = msg + "An amount of "
						+ (Double.parseDouble(products_item_tot) * (-1))
						+ "has been credited  with  details : **";
			} else {
				msg = msg + "Recieved an amount of "
						+ (Double.parseDouble(products_item_tot) * (+1))
						+ "with  deposit details : ****";
			}
			String pay_party = "";

			Iterable<Entity> productsItems = Products
					.getAllItemsForPayment(products_id);
			Iterable<Entity> productsItemsDups = null;
			SetMultimap<String, String> dupResult = HashMultimap.create();
			// perform validation ..

			msg = msg + " ****  for the following items  ****";
			String products_item_code = "";
			String products_item_category = "";
			String products_item_total = "";
			String products_item_des = "";

			for (Entity productsItem : productsItems) {
				products_item_code = (String) productsItem
						.getProperty("products_item_code");
				products_item_category = (String) productsItem
						.getProperty("products_item_category");
				products_item_total = (String) productsItem
						.getProperty("products_item_total");
				products_item_des = (String) productsItem
						.getProperty("products_item_des");
				msg = msg + " { " + products_item_category + products_item_code
						+ "  :  " + products_item_des + " AMOUNT "
						+ products_item_total + " } ";
			}
			// response = processRequest(pay_party, msg);
			// out.println(Util.writeJSONInfo(response));
		} catch (Exception e) {
			// out.println(Util.writeJSONError(response) + " : " +
			// e.getMessage());
			throw new GSGException("SMS not sent " + e.getMessage());
		}

		// sendResponse(resp, response);
	}

	private static void sendResponse(HttpServletResponse httpResponse,
			String response) {
		PrintWriter out = null;
		try {
			// httpResponse.setContentType("text/html");
			out = httpResponse.getWriter();
			out.println(Util.writeJSONInfo(response));
		} catch (IOException e) {
			e.printStackTrace();
			out.println(Util.writeJSONError(e.getMessage()));
		}
	}

	protected String doSave(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException, GSGException {
		int productsRows = Integer.parseInt(req
				.getParameter("tbl_products_item_roz"));
		int tbl_pay_item_roz = Integer.parseInt("0"
				+ req.getParameter("tbl_pay_item_roz"));
		String[] products_type = req.getParameterValues("products_type");
		String products_category = req.getParameter("products_category");
		String products_item = req.getParameter("products_item");
		String products_amount = req.getParameter("products_amount");
		String paymentId = req.getParameter("products_id");
		String appnd = "";
		String products_item_new = "";
		String products_attribute_id = "";
		String products_attribute_name = "";
		String products_attribute_value = "";
		String products_include = "";
		String final_products_category = "";
		String products_category_new = "";
		String products_delete = "";
		PrintWriter out = resp.getWriter();
		Entity Product_Item = null;
		Entity Product_Category = null;
		String products_attribute_type = "";
		String products_attribute_file_value = "";
		String products_attribute_final_value = "";
		String products_attribute_final_id = "";
		String products_attribute_final_name = "";
		String menu_itm = "";
		String menuredo = "N";

		try {
			Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);

			if ((paymentId == null) || (paymentId.equalsIgnoreCase(""))
					|| (paymentId.equalsIgnoreCase("new"))) {
				// paymentId = Products.createUpdateProducts(paymentId,
				// products_type, products_date, products_amount,
				// req.getParameter("products_due"),
				// req.getParameter("products_item_tot"), products_to_account,
				// req.getParameter("products_mode"),
				// req.getParameter("products_refno"),
				// req.getParameter("products_roz"),
				// req.getParameter("products_round"), "", "Saved");
			}
			if ((products_item != null)
					&& (products_item.equalsIgnoreCase("new"))) {
				products_item_new = req.getParameter("products_item_new");
				Product_Item = new Entity("Product_Item", products_item_new);
				// Util.persistEntity(Product_Item);
			} else {
				Product_Item = Util.findEntity(KeyFactory.createKey(
						"Product_Item", products_item));
			}
			final_products_category = products_category;
			if (products_category.equalsIgnoreCase("new")) {
				products_category_new = req
						.getParameter("products_category_new");
				final_products_category = products_category_new;
				Product_Category = new Entity("Product_Category",
						products_category_new);
				// Util.persistEntity(category);
			} else {
				Product_Category = Util.findEntity(KeyFactory.createKey(
						"Product_Category", products_category));
			}
			// menu cleanup and redo
			Entity menuItem = Util.findEntity(KeyFactory.createKey("Menu",
					final_products_category));
			if (menuItem != null) {
				Util.deleteFromCache(KeyFactory.createKey("Menu",
						final_products_category));
			}
			menuItem = new Entity("Menu", final_products_category);

			for (int i = -1; i <= productsRows; i++) {
				if (i == -1) {
					appnd = "";
				} else {
					appnd = i + "";
				}
				products_delete = req.getParameter("menu_delete" + appnd);
				products_attribute_id = req
						.getParameter("products_attribute_id" + appnd);
				products_attribute_type = req
						.getParameter("products_attribute_type" + appnd);

				menu_itm = req.getParameter("menu_itm" + appnd);
				if (menu_itm != null) {
					menuredo = "Y";
					menuItem.setProperty(products_attribute_id,
							products_attribute_id);
				}

				if (("" + products_attribute_type).equalsIgnoreCase("text")) {
					products_attribute_final_value = req
							.getParameter("products_attribute_value" + appnd);
					products_attribute_final_id = "__text__"
							+ req.getParameter("products_attribute_id" + appnd);
					products_attribute_name = req
							.getParameter("products_attribute_name" + appnd);
				} else if (("" + products_attribute_type)
						.equalsIgnoreCase("number")) {
					products_attribute_final_value = req
							.getParameter("products_attribute_value" + appnd);
					products_attribute_final_id = "__number__"
							+ req.getParameter("products_attribute_id" + appnd);
					products_attribute_name = req
							.getParameter("products_attribute_name" + appnd);
				} else if (("" + products_attribute_type)
						.equalsIgnoreCase("image")) {
					products_attribute_name = req
							.getParameter("products_attribute_name" + appnd);
					products_attribute_final_id = "__image__"
							+ req.getParameter("products_attribute_id" + appnd);
					Long blobSize = (long) 0;
					if (blobs.get("products_attribute_value" + appnd) != null) {

						BlobInfoFactory blobInfoFactory = new BlobInfoFactory();
						BlobInfo blobInfo = blobInfoFactory
								.loadBlobInfo(new BlobKey(blobs.get(
										"products_attribute_value" + appnd)
										.getKeyString()));
						blobSize = blobInfo.getSize();
					}

					if (blobSize != 0) {
						products_attribute_final_value = blobs.get(
								"products_attribute_value" + appnd)
								.getKeyString();
					} else {
						products_attribute_final_value = req
								.getParameter("products_attribute_value"
										+ appnd);
					}

				}

				// products_attribute_name =
				// req.getParameter("products_attribute_name" + appnd);
				// products_attribute_value =
				// req.getParameter("products_attribute_value" + appnd);
				// //remove
				// products_attribute_file_value =
				// req.getParameter("products_attribute_file_value" + appnd);
				// //remove

				if ((products_attribute_id != null)
						&& (products_attribute_name != null)
						&& (!products_attribute_name.equalsIgnoreCase(""))
						&& (!products_attribute_id.equalsIgnoreCase(""))) {
					if (products_delete == null) {
						if (products_attribute_type.equalsIgnoreCase("number")) {
							System.out.println(products_attribute_final_value+"< ------------  "+products_attribute_final_id);
							Product_Item.setProperty(
									products_attribute_final_id,
									Double.parseDouble(""
											+ products_attribute_final_value));
						} else {
							Product_Item.setProperty(
									products_attribute_final_id, ""
											+ products_attribute_final_value);
						}

						Product_Category.setProperty(
								products_attribute_final_id,
								products_attribute_name);

					} else {
						Product_Item
								.removeProperty(products_attribute_final_id);
						Product_Category
								.removeProperty(products_attribute_final_id);
					}
				}
			}
			if (menuredo.equalsIgnoreCase("y")) {
				Util.persistEntity(menuItem);
			}

			if (products_item.equalsIgnoreCase("new")) {
				// products_item_new = req.getParameter("products_item_new");
				// Product_Item = new Entity("Product_Item", products_item_new);
				Product_Item.setProperty("product_category",
						final_products_category);
			}
			Util.persistEntity(Product_Item);

			if (products_category.equalsIgnoreCase("new")) {
				// products_category_new =
				// req.getParameter("products_category_new");
				// Product_Category = new Entity("Product_Category",
				// products_category_new);
			}
			Util.persistEntity(Product_Category);
			Products.populateMenuValues(final_products_category);
			RuleEngine.executeRulesforCategory(final_products_category);

			// out.println(Util.writeJSONInfo("Details saved successfully"));
		} catch (Exception e) {
			e.printStackTrace();
			logger.log(Level.SEVERE, e.getMessage(), e);
			// out.println(Util.writeJSONError("System Error" +
			// e.getMessage()));
			// throw new GSGException("System Error" + e.getMessage());
		}
		return paymentId;

	}

	protected void deleteForm(String products_id) throws ServletException,
			IOException {
		Entity payment = Products.getitem("Products", products_id);
		Iterable<Entity> productsItems = Products
				.getAllItemsForPayment(products_id);

		payment.setProperty("status", "Cancelled");
		payment.setProperty("comments", "Cancelled payment");
		Util.persistEntity(payment);
	}

	protected void delete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException, GSGException {
		String products_id = req.getParameter("products");
		Entity payment = Products.getitem("Products", products_id);
		String status = (String) payment.getProperty("status");
		if (status.equalsIgnoreCase("Saved")) {
			deleteForm(products_id);
		} else if (status.equalsIgnoreCase("Submitted")) {
			deleteformAndReverseTxn(products_id);
		}
	}

	/**
	 * Delete the entity from the datastore. Throws an exception if there are
	 * any orders associated with the item and ignores the delete action for it.
	 */
	protected void deleteformAndReverseTxn(String products_id)
			throws ServletException, IOException, GSGException {
		Entity payment = Products.getitem("Products", products_id);
		String products_to_account = (String) payment
				.getProperty("products_to_account");
		String products_amount = (String) payment
				.getProperty("products_amount");
		String item_code = "";
		String item_category = "";
		String products_item_total = "";
		String errorString = "";
		String assocId = "";
		Iterable<Entity> productsItems = Products
				.getAllItemsForPayment(products_id);
		Iterable<Entity> productsItemsDups = null;
		boolean errorFound = false;
		SetMultimap<String, String> dupResult = HashMultimap.create();
		// perform validation ..
		// for this settlement, get all the items - including advance item
		// for each item,search if such item exists in any other settlement, if
		// yes, is settlment id grater than this..if yes store it in arraylist
		// if arraylist is not emplty return message that all future settlements
		// (exp 1232, order 22) with given id needs to be cancelled first
		for (Entity productsItem : productsItems) {
			item_code = (String) productsItem.getProperty("products_item_code");
			item_category = (String) productsItem
					.getProperty("products_item_category");
			SetMultimap<String, String> searchFilter = HashMultimap.create();
			searchFilter.put("products_item_code", item_code);
			searchFilter.put("products_item_category", item_category);
			searchFilter.put("products_item_status", "Submitted");
			productsItemsDups = Products
					.getAllItemsForPaymentItem(searchFilter);
			for (Entity productsItemsDup : productsItemsDups) {
				int dupProducts_id = Integer.parseInt((String) productsItemsDup
						.getProperty("products_id"));
				if (dupProducts_id > Integer.parseInt(products_id)) {
					errorString = errorString + item_category + item_code
							+ " also appears in Payment " + dupProducts_id
							+ ". Please  cancel " + dupProducts_id + " first";
					errorFound = true;
				}
			}
		}
		if (errorFound) {
			throw new GSGException(errorString);
		}

		for (Entity productsItem : productsItems) {
			item_code = (String) productsItem.getProperty("products_item_code");
			item_category = (String) productsItem
					.getProperty("products_item_category");
			products_item_total = (String) productsItem
					.getProperty("products_item_total");

			if (item_category.equalsIgnoreCase("order")) {
				assocId = assocId + ", " + "Order: " + item_code;
				// Order.paymentUnDone(item_code, products_amount);
			} else if (item_category.equalsIgnoreCase("expense")) {
				assocId = assocId + ", " + "Exp: " + item_code;
				// Expense.paymentUnDone(item_code, products_item_total);
			} else if (item_category.equalsIgnoreCase("sale")) {
				assocId = assocId + ", " + "Sale: " + item_code;
				// Stock.markPaymentNotRecieved(item_code);
			} else if (item_category.equalsIgnoreCase("et")) {
				assocId = assocId + ", " + "ET: " + item_code;
				// PurchaseDetails.markETUnPaid(item_code);
			} else if (item_category.equalsIgnoreCase("vat")) {
				assocId = assocId + ", " + "VAT: " + item_code;
				// Stock.markVATUnPaid(item_code);
			} else if (item_category.equalsIgnoreCase("incentive")) {
				assocId = assocId + ", " + "Incen: " + item_code;
				// Stock.markIncentiveUnPaid(item_code);
			} else if (item_category.equalsIgnoreCase("advance")) {
				assocId = assocId + ", " + "Incen: " + item_code;
				// Advance.paymentUnDone(item_code, products_item_total);
			}
			productsItem.setProperty("status", "Cancelled");
			Util.persistEntity(productsItem);
		}
		// Account.reverseSetlmnt("STL" + products_id);
		// if advance has been consumed the settlement cannot be cancelled until
		// all the child are cancelled.

		payment.setProperty("status", "Cancelled");
		payment.setProperty("comments", "Cancelled payment for items: "
				+ assocId.replaceFirst("", ""));
		Util.persistEntity(payment);
	}

	protected void regen(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Iterable<Entity> products = Products.getAllItems();
		String dte = "";
		for (Entity payment : products) {
			if (("" + payment.getProperty("products_id_bk"))
					.equalsIgnoreCase("149")) {
				try {
					payment.setProperty("products_id", "149");
				} catch (Exception e) {
					e.printStackTrace();
				}
				Util.persistEntity(payment);
			}
		}
	}

	/**
	 * Redirects to delete or insert entity based on the action in the HTTP
	 * request.
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// super.doPost(req, resp);
		String message = "";
		String action = "nothjing";
		try {
			String products_save = req.getParameter("products_save");
			String products_id = "";
			if (products_save != null) {
				doSave(req, resp);
				// delete(req, resp);
				message = "Transaction  cancelled succcessfully";
				// return;
			} else if (action.equalsIgnoreCase("save")) {
				doSave(req, resp);
				message = message
						+ "  >> Transaction saved succcessfully. ID is "
						+ doSave(req, resp);
				// return;
			} else if (action.equalsIgnoreCase("submit")) {
				products_id = doSave(req, resp);
				message = message
						+ " >> Transaction saved succcessfully.  ID is "
						+ products_id;
				if ((products_id == null) || (products_id.equalsIgnoreCase(""))) {
					products_id = req.getParameter("products_id");
				}
				doTxn(products_id);
				message = message + " >> Transaction ID: " + products_id
						+ " posted succcessfully";
				doSendMsg(products_id, req, resp);
				message = message + " >> Confirmation SMS sent";
				// return;
			} else if (action.equalsIgnoreCase("sendMsg")) {
				doSendMsg("", req, resp);
				message = message + " >> Confirmation SMS sent";
				// return;
			} else if (action.equalsIgnoreCase("regendata")) {
				regen(req, resp);
				// return;
			}
			logger.info(message);
			//resp.getWriter().println(Util.writeJSONSuccess(message));
		} catch (GSGException e) {
			logger.log(Level.SEVERE, e.getMessage(), e);
			resp.getWriter().println(
					Util.writeJSONError(message + " >> " + e.getMessage()));

			// resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
			// Util.writeJSONError(e.getMessage()));
		}
		resp.sendRedirect("/productattribute.jsp");
	}

}