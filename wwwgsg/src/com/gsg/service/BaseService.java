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
import java.util.ConcurrentModificationException;
import java.util.Map;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.gsg.helper.MetaData;
import com.gsg.helper.Util;

/**
 * This class defines the methods for basic operations of create, update &
 * retrieve for order entity
 * 
 * @author
 * 
 */
public class BaseService {

	public static Entity autoSave(String kind, String id, String name, String value) throws IOException {
		int retries = 5;
		Entity entity = Util.findEntity(KeyFactory.createKey(kind, id));
		if (entity == null) {
			entity = new Entity(kind, id);
		}
		entity.setProperty(name.trim(), value);
		while (true) {
			try {
				System.out.println("Attempt  no. " + retries);
				Util.persistEntity(entity);
				break;
			} catch (ConcurrentModificationException e) {
				System.out.println("ConcurrentModificationException: Retrying ...");
				retries--;
				if (retries == 0) {
					throw e;
				}
			}
		}
		return entity;
	}

	public static int create(String beneficiary, String refNum, String amount, String dte, String comments, String status) throws IOException {
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = Util.getDatastoreServiceInstance().beginTransaction(options);
		int paymentId;
		try {
			paymentId = MetaData.seqIncr("Payments");
			Entity lineItem = new Entity("Payments", paymentId);
			lineItem.setProperty("beneficiary", beneficiary);
			lineItem.setProperty("refNum", refNum);
			lineItem.setProperty("amount", amount);
			lineItem.setProperty("date", dte);
			lineItem.setProperty("comments", comments);
			lineItem.setProperty("status", status);
			Util.getDatastoreServiceInstance().put(lineItem);
			txn.commit();
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			}
		}
		return paymentId;
	}

	public static String createOrder(String dte, String status) throws IOException {
		Transaction txn = Util.getDatastoreServiceInstance().beginTransaction();
		try {
			String key = Integer.toString(MetaData.seqIncr("Order"));
			Entity order = new Entity("Order", key);
			order.setProperty("dte", dte);
			order.setProperty("status", status);
			Util.getDatastoreServiceInstance().put(order);
			txn.commit();
			return key;
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			}
		}
	}

	/**
	 * Get all the orders
	 * 
	 * @return : list of all orders
	 */
	public static Iterable<Entity> getAllItems(String entity) {
		// make generic later
		Iterable<Entity> entities = Util.listEntitiesLimited(entity, "", "", "billing_date", 20);
		return entities;
	}

	public static Entity getItem(String entity, String keyName) {
		Key kee = KeyFactory.createKey(entity, keyName);
		return Util.findEntity(kee);
	}

	public static Iterable<Entity> getItems(String entity, String filterCol, String filterVal) {
		return Util.listEntitiesNoLimit(entity, filterCol, filterVal);
	}

	/**
	 * Get the list of orders for a specific customer
	 * 
	 * @param customerName
	 * @return the list of orders as iterable
	 */
	public static Iterable<Entity> getAllOrdersForCustomer(String customerName) {
		Key customerKey = KeyFactory.createKey("Customer", customerName);
		return Util.listChildren("Order", customerKey);
	}

	public static Entity getitem(String entity, String name) {
		Key key = KeyFactory.createKey(entity, name);
		return Util.findEntity(key);
	}

	public static Entity getitembyId(String entity, long id) {
		Key key = KeyFactory.createKey(entity, id);
		return Util.findEntity(key);
	}

	public static Entity getDummyitem(String entity) {
		return new Entity(entity);
	}

	public static Entity autoSaveGroup(String kind, Map<String, String> parameterMap, String name) {
		Key key = KeyFactory.createKey(kind, name);
		Entity entity = Util.findEntity(key);
		for (Map.Entry<String, String> entry : parameterMap.entrySet()) {
			// Map.Entry<String, String> eachEntry = (Map.Entry) entry;
			if (!(entry.getKey() + "").equalsIgnoreCase("command") && !(entry.getKey() + "").equalsIgnoreCase("id")) {
				entity.setProperty(entry.getKey() + "", entry.getValue().toString());
			}
		}
		Util.persistEntity(entity);
		return entity;
	}

}
