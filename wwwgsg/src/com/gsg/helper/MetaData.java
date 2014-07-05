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

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Transaction;

/**
 * This class defines the methods for basic operations of create, update &
 * retrieve for customer entity
 * 
 * @author
 * 
 */
public class MetaData {

	/**
	 * Checks if the entity is existing and if it is not, it creates the entity
	 * else it updates the entity
	 * 
	 * @param nickName
	 *            : username for the customer
	 */
	public static Entity createMetaData(String entity) {
		Entity metaData = new Entity("MetaData", entity);
		metaData.setProperty("maxRowCount", 0000);
		Util.persistEntity(metaData);
		return metaData;
	}

	/**
	 * List all the customers available
	 * 
	 * @return an iterable list with all the customers
	 */

	public static int getMaxRow(String entity) {
		Entity metaData = getMetaData(entity);
		return Integer.parseInt((String) metaData.getProperty("maxRowCount"));
		// Number l = (Number) metaData.getProperty("maxRowCount");
		// return l.intValue();
	}

	public static int getMaxRowAt(String entity) {
		Key key = KeyFactory.createKey("MetaData", entity);
		Entity ent = Util.findEntity(key);
		if (ent == null) {
			ent = new Entity("MetaData", entity);
			ent.setProperty("maxRowCount", 0000);
			Util.persistEntity(ent);
		}
		return Integer.parseInt((String) ent.getProperty("maxRowCount"));
	}

	/**
	 * Searches for a customer and returns the entity as an iterable The search
	 * is performed by creating a query and searching for the attribute
	 * 
	 * @param customerName
	 *            : username of the customer
	 * @return iterable with the customers searched for
	 */
	public static int seqIncr(String entity) {
		Entity metaData = getMetaData(entity);
		int counter = Integer.parseInt(metaData.getProperty("maxRowCount").toString()) + 1;
		metaData.setProperty("maxRowCount", counter);
		Util.persistEntity(metaData);
		return counter;
	}

	public static String seqIncrStr(String entity) {
		Entity metaData = getMetaData(entity);
		int counter = Integer.parseInt(metaData.getProperty("maxRowCount").toString()) + 1;
		metaData.setProperty("maxRowCount", counter + "");
		Util.persistEntity(metaData);
		System.out.println("increasing seq" +counter);

		return counter + "";
	}

	public static int seqDecr(String entity) {
		Entity metaData = getMetaData(entity);
		int counter = (int) metaData.getProperty("maxRowCount") - 1;
		metaData.setProperty("maxRowCount", counter);
		Util.persistEntity(metaData);
		return counter;
	}

	/**
	 * Searches for a customer and returns the entity as an iterable The search
	 * is key based instead of query
	 * 
	 * @param customerName
	 *            : username of the customer
	 * @return the entity with the username as key
	 */
	public static Entity getMetaData(String entity) {
		Key key = KeyFactory.createKey("MetaData", entity);
		Entity ent = Util.findEntity(key);
		if (ent == null) {
			ent = createMetaData(entity);
		}
		return ent;
	}

	public static Entity getXMetaData(String entity) {
		Key key = KeyFactory.createKey("MetaData", entity);
		Transaction txn = Util.getDatastoreServiceInstance().beginTransaction();
		try {
			Entity ent = Util.findEntity(key);
			if (ent == null) {
				ent = new Entity("MetaData", entity);
				ent.setProperty("maxRowCount", "0");
			}
			txn.commit();
			return ent;
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			}
		}
	}

	public static void updateXMetaData(ArrayList metadata) {
		try {
			for (Object md : metadata) {
				Util.persistEntity((Entity) md);
			}
		} finally {
		}
	}

}
