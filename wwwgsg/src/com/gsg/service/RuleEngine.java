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

import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.common.collect.Multimap;
import com.google.common.collect.SetMultimap;
import com.gsg.helper.MetaData;
import com.gsg.helper.Util;
import com.gsg.rules.PowerBucketRuleCategory;
import com.gsg.rules.PowerBucketRuleMenu;
import com.gsg.rules.PowerBucketRuleProduct;
import com.gsg.rules.PriceBucketRuleCategory;
import com.gsg.rules.PriceBucketRuleMenu;
import com.gsg.rules.PriceBucketRuleProduct;
import com.gsg.rules.Rule;

/**
 * This class defines the methods for basic operations of create, update &
 * retrieve for order entity
 * 
 * @author
 * 
 */
public class RuleEngine extends BaseService {

	/*
	 * This method will run all rules relevant to the products passed as
	 * parameter. The mapping between this filter and applicable rules can
	 * either be decided from the calling method or be in file that will be
	 * opened from within the method
	 */
	public static void executeRules(Iterable<Entity> products) {
		Rule rule = new PriceBucketRuleProduct(); // this will be a factory
													// pattern later. when class
													// will be formed based on
													// what rule
		// needs to be run. this will be in a loop and will form all classes
		// that needs to run its rule on this product
		// config --> category <--> rules
		Iterator iterProducts = products.iterator();
		while (iterProducts.hasNext()) {
			Entity product = (Entity) iterProducts.next();
			product = rule.runRule(product);
			Util.persistEntity(product);
		}
	}

	public static void executeRulesforCategory(String category) {
		Rule rule = new PriceBucketRuleProduct();
		Rule priceRule = new PowerBucketRuleProduct();

		Iterator iterProducts = Util.listEntities("Product_Item",
				"product_category", category).iterator();
		while (iterProducts.hasNext()) {
			Entity product = (Entity) iterProducts.next();
			product = rule.runRule(product);
			product = priceRule.runRule(product);
			Util.persistEntity(product);
		}
		Entity cat = Util.findEntity(KeyFactory.createKey("Product_Category",
				category));
		rule = new PriceBucketRuleCategory();
		cat = rule.runRule(cat);
		rule = new PowerBucketRuleCategory();
		cat = rule.runRule(cat);
		
		Util.persistEntity(cat);

		Entity menu = Util.findEntity(KeyFactory.createKey("Menu", category));
		rule = new PriceBucketRuleMenu();
		menu = rule.runRule(menu);
		rule = new PowerBucketRuleMenu();
		menu = rule.runRule(menu);

		Util.persistEntity(menu);

	}
}
