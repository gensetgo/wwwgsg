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

package com.gsg.helper;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.appengine.api.datastore.Entity;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;

/**
 * This is the utility class for all servlets. It provides method for inserting,
 * deleting, searching the entity from data store. Also contains method for
 * displaying the entity in JSON format.
 * 
 */
public class Search {

	private static final Logger logger = Logger.getLogger(Util.class.getCanonicalName());
	private static SetMultimap<String, String> searchTable = null;
	private static SetMultimap<String, String> avlStockSearchTable = null;
	private static SetMultimap<String, String> purchaseBillDetTable = null;
	private static SetMultimap<String, String> customerTable = null;

	/**
	 * Add the entity to cache and also to the datastore
	 * 
	 * @param entity
	 *            : entity to be persisted
	 */

	public static void add(String type, String value) {
		logger.log(Level.INFO, "Adding to search pool");
		try {
			if (searchTable == null) {
				searchTable = HashMultimap.create();
				searchTable.put("brand", "canon");
			}
			if (!searchTable.containsValue(value)) {
				searchTable.put(type, value);
			}

		} catch (Exception e) {
			logger.log(Level.SEVERE, "Exception: " + e.getMessage());
		}
	}

	/**
	 * Delete the entity from persistent store represented by the key Also
	 * delete it from cache
	 * 
	 * @param key
	 *            : key to delete the entity from the persistent store
	 */
	public static void getFullText1(String partialText) {
		logger.log(Level.INFO, "Deleting entity");
		try {

		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	public static void loadAvlStockData() {
		avlStockSearchTable = HashMultimap.create();
		avlStockSearchTable.clear();
		Iterable<Entity> entities = Util.listEntitiesNoLimit("Stock", "status", "In Stock");
		String vatAppl = "";
		for (Entity entity : entities) {
			vatAppl = entity.getProperty("vat_appl") + "";
			if ((vatAppl.equalsIgnoreCase("null")) || (vatAppl.equalsIgnoreCase(""))) {
				vatAppl = "5.0";
			}

			avlStockSearchTable.put((entity.getKey().getName()), entity.getProperty("brand") + "|" + entity.getProperty("stock_type") + "|" + entity.getProperty("stock_subtype") + "|" + entity.getProperty("stock_subsubtype") + "|" + entity.getProperty("stock_description") + "|" + entity.getKey().getName() + "|" + entity.getProperty(" total_cost_price") + "|" + vatAppl);
		}
	}

	public static void loadCustData() {
		customerTable = HashMultimap.create();
		customerTable.clear();
		Iterable<Entity> entities = Util.listEntitiesNoLimit("Customer", "", "");

		for (Entity entity : entities) {
			customerTable.put((String) entity.getKey().getName(), entity.getKey().getName() + " | " + entity.getProperty("customer_cust_name") + "|" + entity.getProperty("customer_cust_add") + "|" + entity.getProperty("customer_cust_phone") + "|" + entity.getProperty("customer_cust_email"));
		}
	}

	public static void loadPurBillDesData() {
		purchaseBillDetTable = HashMultimap.create();
		purchaseBillDetTable.clear();
		Iterable<Entity> entities = Util.listEntitiesNoLimit("PL", "", "");

		for (Entity entity : entities) {
			purchaseBillDetTable.put((String) entity.getKey().getName(), entity.getProperty("pur_bill_des") + "|" + entity.getProperty("cnf") + "|" + entity.getProperty("et") + "|" + entity.getProperty("vat"));
		}
	}

	public static void loadPLData() {
		searchTable = HashMultimap.create();
		searchTable.clear();
		Iterable<Entity> entities = Util.listEntitiesNoLimit("PL", "", "");

		for (Entity entity : entities) {
			searchTable.put((String) entity.getKey().getName(), entity.getProperty("brand") + "|" + entity.getProperty("type") + "|" + entity.getProperty("subtype") + "|" + entity.getProperty("subsubtype") + "|" + entity.getProperty("comments") + "|" + entity.getProperty("price") + "|" + entity.getProperty("cnf") + "|" + entity.getProperty("et") + "|" + entity.getProperty("vat"));
		}
	}

	public static SetMultimap<String, String> getFullText(String partialText) {
		SetMultimap<String, String> result = HashMultimap.create();

		try {
			if ((searchTable == null) || (searchTable.size() == 0)) {
				// searchTable = HashMultimap.create();
				// searchTable.put("type", "generator");
				// searchTable.put("type", "pumping set");
				loadPLData();
			}
			Iterator it = searchTable.entries().iterator();
			while (it.hasNext()) {
				Map.Entry pairs = (Map.Entry) it.next();
				// System.out.println(pairs.getKey() + " = " +
				// pairs.getValue());
				if (pairs.getValue().toString().toUpperCase().contains(partialText.toUpperCase())) {
					result.put(pairs.getKey().toString(), pairs.getValue().toString());
				}
				// it.remove(); // avoids a ConcurrentModificationException
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return result;

	}

	public static SetMultimap<String, String> getCustData(String partialText) {
		SetMultimap<String, String> result = HashMultimap.create();

		try {
			if ((customerTable == null) || (customerTable.size() == 0)) {
				loadCustData();
			}
			Iterator it = customerTable.entries().iterator();
			while (it.hasNext()) {
				Map.Entry pairs = (Map.Entry) it.next();
				if (pairs.getValue().toString().toUpperCase().contains(partialText.toUpperCase())) {
					result.put(pairs.getKey().toString(), pairs.getValue().toString());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;

	}

	public static SetMultimap<String, String> getPurBillDes(String partialText) {
		SetMultimap<String, String> result = HashMultimap.create();

		try {
			if ((purchaseBillDetTable == null) || (purchaseBillDetTable.size() == 0)) {
				// searchTable = HashMultimap.create();
				// searchTable.put("type", "generator");
				// searchTable.put("type", "pumping set");
				loadPurBillDesData();
			}
			Iterator it = purchaseBillDetTable.entries().iterator();
			while (it.hasNext()) {
				Map.Entry pairs = (Map.Entry) it.next();
				// System.out.println(pairs.getKey() + " = " +
				// pairs.getValue());
				if (pairs.getValue().toString().toUpperCase().contains(partialText.toUpperCase())) {
					result.put(pairs.getKey().toString(), pairs.getValue().toString());
				}
				// it.remove(); // avoids a ConcurrentModificationException
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return result;

	}

	public static SetMultimap<String, String> getAvlStockFullText(String partialText) {
		SetMultimap<String, String> result = HashMultimap.create();

		try {
			if ((avlStockSearchTable == null) || (avlStockSearchTable.size() == 0)) {
				// searchTable = HashMultimap.create();
				// searchTable.put("type", "generator");
				// searchTable.put("type", "pumping set");
				loadAvlStockData();
			}
			Iterator it = avlStockSearchTable.entries().iterator();
			while (it.hasNext()) {
				Map.Entry pairs = (Map.Entry) it.next();
				// System.out.println(pairs.getKey() + " = " +
				// pairs.getValue());
				if (pairs.getValue().toString().toUpperCase().contains(partialText.toUpperCase())) {
					result.put(pairs.getKey().toString(), pairs.getValue().toString());
				}
				// it.remove(); // avoids a ConcurrentModificationException
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return result;

	}

	public static ArrayList getSearchedStockCode(String search) {
		String res = "[";
		ArrayList resultS = new ArrayList();
		try {
			if ((avlStockSearchTable == null) || (avlStockSearchTable.size() == 0)) {
				loadAvlStockData();
			}
			Iterator it = avlStockSearchTable.entries().iterator();
			while (it.hasNext()) {
				Map.Entry pairs = (Map.Entry) it.next();
				// System.out.println(pairs.getKey() + " = " +pairs.getValue());
				if (pairs.getValue().toString().toUpperCase().contains(search.toUpperCase())) {
					resultS.add(pairs.getKey().toString());
				}
				// it.remove(); // avoids a ConcurrentModificationException
			}
			res = res + "]";
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return resultS;
	}

	public static SetMultimap<String, String> mobileSearch(String type, String code) {
		SetMultimap<String, String> result = HashMultimap.create();
		try {
			if (type.equals("cust")) {
				result = getCustData(code);
			} else if (type.equals("stock")) {
				result = getAvlStockFullText(code);
			} else if (type.equals("pl")) {
				result = getFullText(code);
			} else {
				result.put("ERR", "Invalid type: " + type + ". Please choose between - stock,cust or pl");
			}
			if (result.isEmpty()) {
				result.put("ERR", "No result found ");
			}

		} catch (Exception e) {
			result.put("ERR", "System Error: " + e.getMessage());
			logger.log(Level.SEVERE, "Error", e);
		}
		return result;
	}

}