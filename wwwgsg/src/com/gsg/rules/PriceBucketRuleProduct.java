package com.gsg.rules;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.gsg.helper.Util;
import com.gsg.service.Products;

public class PriceBucketRuleProduct implements Rule {

	public Entity runRule(Entity product) {
		Object price =  product.getProperty("__number__price");
		double dblPrice = 0;
		String priceCategory = "";
		if (price != null) {
			dblPrice = (Double)price;
			if (dblPrice < 15000) {
				priceCategory = "Less than 15000";
			} else if ((dblPrice >= 15000) && (dblPrice < 20000)) {
				priceCategory = "15000 - 20000";
			} else if ((dblPrice >= 20000) && (dblPrice < 40000)) {
				priceCategory = "20000 - 40000";
			} else if ((dblPrice >= 40000) && (dblPrice < 60000)) {
				priceCategory = "40000 - 60000";
			} else if ((dblPrice >= 60000) && (dblPrice < 100000)) {
				priceCategory = "60000 - 100000";
			} else if ((dblPrice >= 100000) && (dblPrice < 150000)) {
				priceCategory = "100000 - 150000";
			} else if ((dblPrice >= 150000) && (dblPrice < 200000)) {
				priceCategory = "150000 - 200000";
			} else if ((dblPrice >= 200000) && (dblPrice < 500000)) {
				priceCategory = "200000 - 500000";
			} else if ((dblPrice >= 500000)) {
				priceCategory = "More than 500000";
			}
		}
		product.setProperty("__text__priceCategory", priceCategory);
		return product;
	}
}