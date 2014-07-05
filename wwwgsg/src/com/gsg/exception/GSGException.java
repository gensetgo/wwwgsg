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
package com.gsg.exception;

import java.io.IOException;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.logging.Logger;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Transaction;
import com.google.common.collect.Multimap;

/**
 * This class defines the methods for basic operations of create, update &
 * retrieve for order entity
 * 
 * @author
 * 
 */
public class GSGException extends Exception {

	/**
	 * Create an entity if it does not exist, else update the existing entity.
	 * The order has header and line item. Both needs to be added in a single
	 * transaction.
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
	 * @throws IOException
	 */
	private static final Logger log = Logger.getLogger(GSGException.class
			.getName());

	public GSGException(String errorMsg) {
		super(errorMsg);
	}

	public static void dummy() {

	}

}
