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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.common.collect.SetMultimap;

/**
 * This is the utility class for all servlets. It provides method for inserting,
 * deleting, searching the entity from data store. Also contains method for
 * displaying the entity in JSON format.
 * 
 */
public class Util {

	private static final Logger logger = Logger.getLogger(Util.class
			.getCanonicalName());
	private static DatastoreService datastore = DatastoreServiceFactory
			.getDatastoreService();

	private static MemcacheService keycache = MemcacheServiceFactory
			.getMemcacheService();

	/**
	 * Add the entity to cache and also to the datastore infilter --> brand |
	 * bharat,usha,.. price| 122,223,332 and filter --> AND two above
	 * 
	 * @param entity
	 *            : entity to be persisted
	 */

	public static Iterable<Entity> filterResult(String kind,
			SetMultimap<String, ArrayList> searchANDFilter, String[] sortPars) {
		// logger.log(Level.INFO, "Search entities based on search criteria");

		Iterator it = searchANDFilter.entries().iterator();
		Query query = new Query(kind);
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			// System.out.println(pairs.getKey() + " = " + pairs.getValue());
			query = INQuery(query, pairs.getKey() + "",
					(ArrayList) pairs.getValue());
			// it.remove(); // avoids a ConcurrentModificationException
		}
		String sort = "";
		String firstChar = "";
		if (sortPars != null) {
			for (int i = 0; i < sortPars.length; i++) {
				sort = sortPars[i].trim();
				firstChar = sort.substring(0, 1);
				if (firstChar.equalsIgnoreCase("-")) {
					query.addSort(sort.substring(1), SortDirection.DESCENDING);
				} else if (firstChar.equalsIgnoreCase("+")) {
					query.addSort(sort.substring(1), SortDirection.ASCENDING);
				} else {
					query.addSort(sort, SortDirection.ASCENDING);
				}
			}
		}
		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	public static Iterable<Entity> filterResult(String kind,
			SetMultimap<String, String[]> searchANDFilter, String sortPar,
			String currentCursor, int pageSize) {
		// logger.log(Level.INFO, "Search entities based on search criteria");

		Iterator it = searchANDFilter.entries().iterator();
		Query query = new Query(kind);
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			// System.out.println(pairs.getKey() + " = " + pairs.getValue());
			query = INQuery(query, pairs.getKey() + "",
					(ArrayList) Arrays.asList((String[]) pairs.getValue()));
			it.remove(); // avoids a ConcurrentModificationException
		}
		if (sortPar != null && !"".equals(sortPar)) {
			query.addSort(sortPar, SortDirection.DESCENDING);
		}
		FetchOptions fetchOptions = FetchOptions.Builder.withLimit(pageSize);
		if ((currentCursor != null)
				&& (!currentCursor.equalsIgnoreCase("undefined"))) {
			fetchOptions.startCursor(Cursor.fromWebSafeString(currentCursor));
		}
		PreparedQuery pq = datastore.prepare(query);
		return pq.asQueryResultList(fetchOptions);
	}

	public static Query INQuery(Query query, String searchBy, ArrayList inFilter) {

		if (inFilter != null && !"".equals(inFilter)) {
			query.addFilter(searchBy, FilterOperator.IN, inFilter);
		}
		return query;
	}

	public static Iterable<Entity> listINEntities(String kind, String searchBy,
			ArrayList inFilter) {
		Query query = new Query(kind);
		if (inFilter != null && !"".equals(inFilter)) {
			query.addFilter(searchBy, FilterOperator.IN, inFilter);
		}
		PreparedQuery pq = datastore.prepare(query);
		FetchOptions fetchOptions = FetchOptions.Builder.withLimit(15);
		return pq.asIterable(fetchOptions);
	}

	public static void persistEntity(Entity entity) {
		// logger.log(Level.INFO, "Saving entity");
		Key key = entity.getKey();
		Transaction txn = datastore.beginTransaction();
		try {
			datastore.put(entity);
			txn.commit();
		} catch (Exception e) {
			e.printStackTrace();
			logger.log(Level.SEVERE, e.getMessage());
			throw e;
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			} else {
				addToCache(key, entity);
			}
		}
	}

	/**
	 * Delete the entity from persistent store represented by the key Also
	 * delete it from cache
	 * 
	 * @param key
	 *            : key to delete the entity from the persistent store
	 */
	public static void deleteEntity(Key key) {
		// logger.log(Level.INFO, "Deleting entity");
		Transaction txn = datastore.beginTransaction();
		try {
			datastore.delete(key);
			txn.commit();
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			} else {
				deleteFromCache(key);
			}
		}
	}

	/**
	 * Delete the entities represented by a list of keys Delete the entitites
	 * from cache also
	 * 
	 * @param keys
	 *            : keys for the entities that are to be deleted
	 */
	public static void deleteEntity(final List<Key> keys) {
		datastore.delete(new Iterable<Key>() {
			public Iterator<Key> iterator() {
				return keys.iterator();
			}
		});
		deleteFromCache(keys);
	}

	/**
	 * Search and return the entity from the cache . If absent , search the
	 * datastore.
	 * 
	 * @param key
	 *            : key to find the entity
	 * @return entity
	 */
	public static Entity findEntity(Key key) {
		// logger.log(Level.INFO, "Search the entity");
		Entity entity = null;
		try {
			entity = getFromCache(key);
			if (entity != null) {
				return entity;
			}
			entity = datastore.get(key);
			addToCache(key, entity);
			logger.log(Level.INFO, "Expensive DB call");
			return entity;
		} catch (EntityNotFoundException e) {
			return null;
		}
	}

	/***
	 * Search entities based on search criteria
	 * 
	 * @param kind
	 * @param searchBy
	 *            : Searching Criteria (Property)
	 * @param searchFor
	 *            : Searching Value (Property Value)
	 * @return List all entities of a kind from the cache or datastore (if not
	 *         in cache) with the specified properties
	 */
	public static Iterable<Entity> listEntities(String kind) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Query query = new Query(kind);
		PreparedQuery pq = datastore.prepare(query);
		// FetchOptions fetchOptions = FetchOptions.Builder.withLimit(15);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntities(String kind, String searchBy,
			String searchFor) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.EQUAL, searchFor);
		}
		PreparedQuery pq = datastore.prepare(query);
		// FetchOptions fetchOptions = FetchOptions.Builder.withLimit(15);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntitiesGT(String kind, String searchBy,
			String searchFor) {
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.GREATER_THAN, searchFor);
		}
		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntitiesNoLimit(String kind,
			String searchBy, String searchFor) {
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.EQUAL, searchFor);
		}
		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntitiesSPL(String kind,
			String searchBy, String searchFor) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.EQUAL, searchFor);
		}
		PreparedQuery pq = datastore.prepare(query);
		FetchOptions fetchOptions = FetchOptions.Builder.withLimit(15);
		return pq.asIterable(fetchOptions);
	}

	public static Iterable<Entity> listEntitiesNoLimit(String kind,
			String searchBy, String searchFor, String sortPar) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.EQUAL, searchFor);
		}
		if (sortPar != null && !"".equals(sortPar)) {
			query.addSort(sortPar, SortDirection.DESCENDING);
		}

		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntitiesLimited(String kind,
			String searchBy, String searchFor, String sortPar, int num) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.EQUAL, searchFor);
		}
		if (sortPar != null && !"".equals(sortPar)) {
			query.addSort(sortPar, SortDirection.DESCENDING);
		}

		PreparedQuery pq = datastore.prepare(query);
		FetchOptions fetchOptions = FetchOptions.Builder.withLimit(num);
		return pq.asIterable(fetchOptions);
	}

	public static Iterable<Entity> listEntitiesLimited(String kind,
			String searchBy, String searchFor, String sortPar,
			String currentCursor, int pageSize) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Query query = new Query(kind);
		if (searchFor != null && !"".equals(searchFor)) {
			query.addFilter(searchBy, FilterOperator.EQUAL, searchFor);
		}
		if (sortPar != null && !"".equals(sortPar)) {
			query.addSort(sortPar, SortDirection.DESCENDING);
		}
		FetchOptions fetchOptions = FetchOptions.Builder.withLimit(pageSize);
		if ((currentCursor != null)
				&& (!currentCursor.equalsIgnoreCase("undefined"))) {
			fetchOptions.startCursor(Cursor.fromWebSafeString(currentCursor));
		}

		PreparedQuery pq = datastore.prepare(query);
		return pq.asQueryResultList(fetchOptions);
	}

	public static Iterable<Entity> listEntitiesLimited(String kind,
			SetMultimap<String, String> searchFilter, String sortPar,
			String currentCursor, int pageSize) {
		// logger.log(Level.INFO, "Search entities based on search criteria");

		Iterator it = searchFilter.entries().iterator();
		Query query = new Query(kind);
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			// System.out.println(pairs.getKey() + " = " + pairs.getValue());
			query.addFilter(pairs.getKey() + "", FilterOperator.EQUAL,
					(String) pairs.getValue() + "");
			it.remove(); // avoids a ConcurrentModificationException
		}
		if (sortPar != null && !"".equals(sortPar)) {
			query.addSort(sortPar, SortDirection.DESCENDING);
		}
		FetchOptions fetchOptions = FetchOptions.Builder.withLimit(pageSize);
		if ((currentCursor != null)
				&& (!currentCursor.equalsIgnoreCase("undefined"))) {
			fetchOptions.startCursor(Cursor.fromWebSafeString(currentCursor));
		}
		PreparedQuery pq = datastore.prepare(query);
		return pq.asQueryResultList(fetchOptions);
	}

	public static Iterable<Entity> listEntities(String kind,
			SetMultimap<String, String> searchFilter) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Iterator it = searchFilter.entries().iterator();
		Query query = new Query(kind);
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			// System.out.println(pairs.getKey() + " = " + pairs.getValue());
			query.addFilter(pairs.getKey() + "", FilterOperator.EQUAL,
					(String) pairs.getValue() + "");
			it.remove(); // avoids a ConcurrentModificationException
		}
		PreparedQuery pq = datastore.prepare(query);
		// FetchOptions fetchOptions = FetchOptions.Builder.withLimit(15);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntities(String kind,
			SetMultimap<String, String> searchFilter, String sortPar) {
		// logger.log(Level.INFO, "Search entities based on search criteria");
		Iterator it = searchFilter.entries().iterator();
		Query query = new Query(kind);
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			// System.out.println(pairs.getKey() + " = " + pairs.getValue());
			query.addFilter(pairs.getKey() + "", FilterOperator.EQUAL,
					(String) pairs.getValue() + "");
			it.remove(); // avoids a ConcurrentModificationException
		}
		if (sortPar != null && !"".equals(sortPar)) {
			query.addSort(sortPar, SortDirection.DESCENDING);
		}
		PreparedQuery pq = datastore.prepare(query);
		// FetchOptions fetchOptions = FetchOptions.Builder.withLimit(15);
		return pq.asIterable();
	}

	public static Iterable<Entity> listEntities(String kind,
			SetMultimap<String, String> searchFilter, String[] sortPar) {
		Iterator it = searchFilter.entries().iterator();
		Query query = new Query(kind);
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			// System.out.println(pairs.getKey() + " = " + pairs.getValue());
			query.addFilter(pairs.getKey() + "", FilterOperator.EQUAL,
					(String) pairs.getValue() + "");
			it.remove(); // avoids a ConcurrentModificationException
		}
		for (int i = 0; i < sortPar.length; i++) {
			query.addSort(sortPar[i], SortDirection.DESCENDING);
		}
		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	/**
	 * Get the list of children from a parent key in the entity group
	 * 
	 * @param kind
	 *            : the entity kind of the children that is to be searched for
	 * @param ancestor
	 *            : the parent key of the entity group where we need to search
	 * @return iterable with all children of the parent of the specified kind
	 */
	public static Iterable<Entity> listChildren(String kind, Key ancestor) {
		Query query = new Query(kind);
		query.setAncestor(ancestor);
		// query.addFilter(Entity.KEY_RESERVED_PROPERTY,
		// FilterOperator.GREATER_THAN, ancestor);
		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	/**
	 * Get the list of keys of all children for a given entity kind in a given
	 * entity group represented by the parent key
	 * 
	 * @param kind
	 *            : Entity kind of the children that needs to be searched for
	 * @param ancestor
	 *            : Parent key of the entity group that needs to be searched for
	 * @return an iterable with keys of children
	 */
	public static Iterable<Entity> listChildKeys(String kind, Key ancestor) {
		Query query = new Query(kind);
		query.setAncestor(ancestor).setKeysOnly();
		query.addFilter(Entity.KEY_RESERVED_PROPERTY,
				FilterOperator.GREATER_THAN, ancestor);
		PreparedQuery pq = datastore.prepare(query);
		return pq.asIterable();
	}

	public static String writeSuggestions(Iterable<Entity> entities) {
		StringBuilder sb = new StringBuilder();
		int i = 0;
		for (Entity result : entities) {
			Map<String, Object> properties = result.getProperties();
			sb.append("\"");
			for (String key : properties.keySet()) {
				sb.append(properties.get(key) + "|");
			}
			sb.append("\",");
			i++;
		}
		return sb.toString();
	}

	public static String writeJSONM(Iterable<Entity> entities) {
		StringBuilder sb = new StringBuilder();
		int i = 0;
		// String app = "";
		sb.append("{\"data\": [");
		for (Entity result : entities) {
			Map<String, Object> properties = result.getProperties();
			sb.append("{");
			if (result.getKey().getName() == null)
				sb.append("\"name\" : \"" + result.getKey().getId() + "\",");
			else
				sb.append("\"name\" : \"" + result.getKey().getName() + "\",");

			for (String key : properties.keySet()) {
				// sb.append("\"" + key+app + "\" : \"" + properties.get(key) +
				// "\",");
				sb.append("\"" + key + "\" : \"" + properties.get(key) + "\",");

			}
			sb.deleteCharAt(sb.lastIndexOf(","));
			sb.append("},");
			i++;
			// app=app+i;
		}
		if (i > 0) {
			sb.deleteCharAt(sb.lastIndexOf(","));
		}
		sb.append("]}");
		// System.out.println(sb);
		return sb.toString();
		// return
		// "{ query:'Li', suggestions:['Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania'], data:['LR', 'LY', 'LI', 'LT']	} ";

	}

	public static String writeJSONGraph(Iterable<Entity> entities) {
		StringBuilder sb = new StringBuilder();
		int i = 0;
		// sb.append("{ \"cols\": [ {\"id\":\"\",\"label\":\"Topping\",\"pattern\":\"\",\"type\":\"string\"}, {\"id\":\"\",\"label\":\"Slices\",\"pattern\":\"\",\"type\":\"number\"} ],  \"rows\": [ ");
		sb.append("{ \"cols\": [");
		Map<String, Object> keyProperties = null;
		Map<String, String> firstRowType = new HashMap();
		if (entities != null) {
			for (Entity result : entities) {
				Map<String, Object> properties = result.getProperties();
				if (i == 0) {
					keyProperties = properties;
					sb.append("{\"id\": \"ID/Name\" , \"label\": \"ID/Name\", \"type\":\"number\"},");
					for (String key : properties.keySet()) {
						sb.append("{\"id\": \"" + key + "\" ,\"label\": \""
								+ key.replace("_", " ").toUpperCase()
								+ "\", \"type\":\""
								+ typeIs(properties.get(key) + "") + "\"},");
						firstRowType.put(key, typeIs(properties.get(key) + ""));
					}
					sb.deleteCharAt(sb.lastIndexOf(","));
					sb.append("],\"rows\": [");
				}

				sb.append("{\"c\":[");
				if (result.getKey().getName() == null)
					sb.append("{\"v\": \"" + result.getKey().getId() + "\"},");
				else
					sb.append("{\"v\": \"" + result.getKey().getName() + "\"},");

				for (String key : keyProperties.keySet()) {
					if (((String) firstRowType.get(key))
							.equalsIgnoreCase("number")) {
						sb.append("{\"v\": "
								+ Double.parseDouble((properties.get(key)
										.toString()).replace(",", "")) + "},");
					} else if (((String) firstRowType.get(key))
							.equalsIgnoreCase("date")) {
						String dte = Integer.parseInt(getYear(properties.get(
								key).toString()))
								+ ","
								+ (Integer.parseInt(getMonth(properties
										.get(key).toString())) - 1)
								+ ","
								+ Integer.parseInt(getDay(properties.get(key)
										.toString()));
						sb.append("{\"v\": \"Date(" + dte + ")\"},");
					} else {
						sb.append("{\"v\": \"" + properties.get(key) + "\"},");
					}
				}
				sb.deleteCharAt(sb.lastIndexOf(","));
				sb.append("]},");
				i++;
			}
			if (i > 0) {
				sb.deleteCharAt(sb.lastIndexOf(","));
			}
		}
		sb.append("]}");
		// System.out.println(sb);
		return sb.toString();
		// return
		// "{ query:'Li', suggestions:['Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania'], data:['LR', 'LY', 'LI', 'LT']	} ";

	}

	/**
	 * List the entities in JSON format
	 * 
	 * @param entities
	 *            entities to return as JSON strings
	 */
	public static String writeJSON(Iterable<Entity> entities) {
		StringBuilder sb = new StringBuilder();
		try {
			int i = 0;
			sb.append("{\"data\": [");
			if (entities != null) {
				for (Entity result : entities) {
					Map<String, Object> properties = result.getProperties();
					sb.append("{");
					if (result.getKey().getName() == null)
						sb.append("\"name\" : \"" + result.getKey().getId()
								+ "\",");
					else
						sb.append("\"name\" : \"" + result.getKey().getName()
								+ "\",");

					for (String key : properties.keySet()) {
						sb.append("\"" + key + "\" : \"" + properties.get(key)
								+ "\",");
					}
					sb.deleteCharAt(sb.lastIndexOf(","));
					sb.append("},");
					i++;
				}
				if (i > 0) {
					sb.deleteCharAt(sb.lastIndexOf(","));
				}
			}
			sb.append("]}");
		} catch (Exception e) {
			e.printStackTrace();
			logger.log(Level.SEVERE, e.getMessage(), e);
		}
		System.out.println(sb);
		logger.log(Level.INFO,sb.toString());
		return sb.toString();
		// return
		// "{ query:'Li', suggestions:['Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania'], data:['LR', 'LY', 'LI', 'LT']	} ";

	}

	public static String writeJSONPaginated(Iterable<Entity> entities,
			int pageSize) {
		StringBuilder sb = new StringBuilder();
		String cursorString = ((QueryResultList<Entity>) entities).getCursor()
				.toWebSafeString();
		String lastPage = "N";
		try {
			int i = 0;
			sb.append("{\"data\": [");
			if (entities != null) {
				for (Entity result : entities) {
					Map<String, Object> properties = result.getProperties();
					sb.append("{");
					if (result.getKey().getName() == null)
						sb.append("\"name\" : \"" + result.getKey().getId()
								+ "\",");
					else
						sb.append("\"name\" : \"" + result.getKey().getName()
								+ "\",");

					for (String key : properties.keySet()) {
						sb.append("\"" + ("" + key).trim() + "\" : \""
								+ ("" + properties.get(key)).trim() + "\",");
					}
					sb.deleteCharAt(sb.lastIndexOf(","));
					sb.append("},");
					i++;
				}
				if (i > 0) {
					// sb.deleteCharAt(sb.lastIndexOf(","));
				}
				if (i < pageSize) {
					lastPage = "Y";
				}
				sb.append("{\"name\" : \"footer\",\"nextCursor\" : \""
						+ cursorString + "\",\"lastPage\":\"" + lastPage
						+ "\" }");
			}
			sb.append("]}");
		} catch (Exception e) {
			e.printStackTrace();
		}
		// System.out.println(sb);
		return sb.toString();
		// return
		// "{ query:'Li', suggestions:['Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania'], data:['LR', 'LY', 'LI', 'LT']	} ";

	}

	public static String writeJSON(Entity entity) {
		StringBuilder sb = new StringBuilder();
		int i = 0;
		sb.append("{\"data\": [");
		// for (Entity result : entities) {
		if (entity != null) {
			sb.append("{");

			Map<String, Object> properties = entity.getProperties();

			if (entity.getKey().getName() == null)
				sb.append("\"name\" : \"" + entity.getKey().getId() + "\",");
			else
				sb.append("\"name\" : \"" + entity.getKey().getName() + "\",");

			for (String key : properties.keySet()) {
				sb.append("\"" + key + "\" : \"" + properties.get(key) + "\",");
			}
			sb.deleteCharAt(sb.lastIndexOf(","));
			sb.append("},");
			i++;
			// }
			if (i > 0) {
				sb.deleteCharAt(sb.lastIndexOf(","));
			}
		}
		sb.append("]}");
		System.out.println(sb.toString());
		return sb.toString();
	}

	public static String writeJSONError(String message) {
		StringBuilder sb = new StringBuilder();
		sb.append("{\"data\": [");
		sb.append("{");
		sb.append("\"responseType\" : \"ERROR\",");
		sb.append("\"message\" : \"" + message + "\",");
		sb.deleteCharAt(sb.lastIndexOf(","));
		sb.append("}");

		sb.append("]}");
		System.out.println(sb.toString());
		return sb.toString();
	}

	public static String writeJSONInfo(String message) {
		StringBuilder sb = new StringBuilder();
		sb.append("{\"data\": [");
		sb.append("{");
		sb.append("\"responseType\" : \"INFO\",");
		sb.append("\"message\" : \"" + message + "\",");
		sb.deleteCharAt(sb.lastIndexOf(","));
		sb.append("}");

		sb.append("]}");
		System.out.println(sb.toString());
		return sb.toString();
	}

	public static String writeJSONSuccess(String message) {
		StringBuilder sb = new StringBuilder();
		sb.append("{\"data\": [");
		sb.append("{");
		sb.append("\"responseType\" : \"SUCCESS\",");
		sb.append("\"message\" : \"" + message + "\",");
		sb.deleteCharAt(sb.lastIndexOf(","));
		sb.append("}");

		sb.append("]}");
		System.out.println(sb.toString());
		return sb.toString();
	}

	/**
	 * Retrieves Parent and Child entities into JSON String
	 * 
	 * @param entities
	 *            : List of parent entities
	 * @param childKind
	 *            : Entity type for Child
	 * @param fkName
	 *            : foreign-key to the parent in the child entity
	 * @return JSON string
	 */
	public static String writeJSON(Iterable<Entity> entities, String childKind,
			String fkName) {
		StringBuilder sb = new StringBuilder();
		int i = 0;
		sb.append("{\"data\": [");
		for (Entity result : entities) {
			Map<String, Object> properties = result.getProperties();
			sb.append("{");
			if (result.getKey().getName() == null)
				sb.append("\"name\" : \"" + result.getKey().getId() + "\",");
			else
				sb.append("\"name\" : \"" + result.getKey().getName() + "\",");
			for (String key : properties.keySet()) {
				sb.append("\"" + key + "\" : \"" + properties.get(key) + "\",");
			}
			Iterable<Entity> child = listEntities(childKind, fkName,
					String.valueOf(result.getKey().getId()));
			for (Entity en : child) {
				for (String key : en.getProperties().keySet()) {
					sb.append("\"" + key + "\" : \""
							+ en.getProperties().get(key) + "\",");
				}
			}
			sb.deleteCharAt(sb.lastIndexOf(","));
			sb.append("},");
			i++;
		}
		if (i > 0) {
			sb.deleteCharAt(sb.lastIndexOf(","));
		}
		sb.append("]}");
		return sb.toString();
	}

	/**
	 * Adds the entity to cache
	 * 
	 * @param key
	 *            : key of the entity
	 * @param entity
	 *            : Entity being added
	 */
	public static void addToCache(Key key, Entity entity) {
		// logger.log(Level.INFO, "Adding entity to cache");
		keycache.put(key, entity);
	}

	/**
	 * Delete the entity from cache
	 * 
	 * @param key
	 *            : Key of the entity that needs to be deleted
	 */
	public static void deleteFromCache(Key key) {
		logger.log(Level.INFO, "Deleting entity from cache");
		keycache.delete(key);
	}

	/**
	 * Delete entities based on a set of keys
	 * 
	 * @param keys
	 *            : list of keys for the entities that are to be deleted
	 */
	public static void deleteFromCache(List<Key> keys) {
		keycache.deleteAll(keys);
	}

	/**
	 * Search for an entity based on key in the cache
	 * 
	 * @param key
	 *            : key of the entity that is searched for
	 * @return the entity
	 */
	public static Entity getFromCache(Key key) {
		return (Entity) keycache.get(key);
	}

	/**
	 * Utility method to send the error back to UI
	 * 
	 * @param data
	 * @param resp
	 * @throws IOException
	 */
	public static String getErrorResponse(Exception ex) throws IOException {
		return "Error:" + ex.toString();
	}

	/**
	 * Utility method to get the datastore service in entities
	 * 
	 * @return datastore
	 */
	public static DatastoreService getDatastoreServiceInstance() {
		return datastore;
	}

	public static Entity getUser(String email) {
		try {
			if (email != null) {
				Iterable<Entity> entities = Util.listEntities("User", "", "");
				String entMail = "NONE";
				for (Entity result : entities) {
					entMail = ((String) result.getProperty("email"))
							.toLowerCase();
					if (email.equalsIgnoreCase(entMail)) {
						return result;
					}
				}
			}
		} catch (Exception e) {
			logger.severe(e.getMessage());
		}
		return null;
	}

	public static String findMgrPhn(String shop) {
		try {
			if (shop != null) {
				Iterable<Entity> entities = Util.listEntitiesSPL("User",
						"shop", shop);
				String mgr = "NONE";
				for (Entity result : entities) {
					mgr = ((String) result.getProperty("phone"));
					return mgr;
				}
			}
		} catch (Exception e) {
			logger.severe(e.getMessage());
		}
		return null;
	}

	public static String getMonth(String saleDate) {
		// TODO Auto-generated method stub
		String mnth = "01";
		if (!saleDate.trim().equalsIgnoreCase("")) {
			mnth = saleDate.split("-")[1];
		}
		return mnth;
	}

	public static String getYear(String saleDate) {
		// TODO Auto-generated method stub
		String yr = "2008";
		if (!saleDate.trim().equalsIgnoreCase("")) {
			yr = saleDate.split("-")[0];
		}
		return yr;
	}

	public static String getDay(String saleDate) {
		// TODO Auto-generated method stub
		String yr = "01";
		if (!saleDate.trim().equalsIgnoreCase("")) {
			yr = saleDate.split("-")[2];
		}
		return yr;
	}

	public static String getMonthYear(String saleDate) {
		String mnthYr = "2008-01";
		if (!saleDate.trim().equalsIgnoreCase("")) {
			mnthYr = saleDate.split("-")[0] + "-" + saleDate.split("-")[1];
		}
		return mnthYr;
	}

	public static int getNVLIntProperty(Entity item, String property) {
		int itemProp = 0;
		String sItemProp = (String) item.getProperty(property);
		if ((sItemProp != null) && (!sItemProp.equalsIgnoreCase(""))) {
			itemProp = Integer.parseInt(sItemProp);
		}
		return itemProp;
	}

	public static double getNVLDoubleProperty(Entity item, String property) {
		double itemProp = 0;
		String sItemProp = item.getProperty(property) + "";
		try {
			if ((sItemProp != null) && (!sItemProp.equalsIgnoreCase(""))) {
				itemProp = Double.parseDouble(sItemProp.replace(",", "")
						.replace("$", ""));
			}
		} catch (Exception e) {
			itemProp = 0;
			// logger.severe(e.getMessage());
		}
		return itemProp;
	}

	public static String typeIs(String str) {

		if (str.replace(",", "").matches("-?\\d+(\\.\\d+)?")) {
			return "number";
		} else if (str
				.replace(",", "")
				.matches(
						"((19|20)\\d{2})-([1-9]|0[1-9]|1[0-2])-(0[1-9]|[1-9]|[12][0-9]|3[01])")) {
			return "date";
		} else if (str.replace(",", "").matches(
				"(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/((19|20)\\d\\d)")) {
			return "date";
		} else {
			return "string";
		}
	}

	public static void purgeTable(String string) {
		Query query = new Query(string);
		PreparedQuery pq = datastore.prepare(query);
		try {
			for (Entity result : pq.asIterable()) {
				deleteEntity(result.getKey());
			}

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

	}
}