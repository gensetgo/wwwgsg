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

public class PowerBucketRuleProduct implements Rule {

	public Entity runRule(Entity product) {
		Object price = product.getProperty("__number__rating");
		double dblPrice = 0;
		String powerCategory = "";
		if (price != null) {
			dblPrice = (Double)price;
			if (dblPrice < 500) {
				powerCategory = "Less than 500 VA";
			} else if ((dblPrice >= 500) && (dblPrice < 1000)) {
				powerCategory = "500 VA - 1000 VA";
			} else if ((dblPrice >= 1000) && (dblPrice < 2500)) {
				powerCategory = "1000 VA - 2500 VA";
			} else if ((dblPrice >= 2500) && (dblPrice < 3500)) {
				powerCategory = "2500 VA - 3500 VA";
			} else if ((dblPrice >= 3500) && (dblPrice < 5000)) {
				powerCategory = "3500 VA - 5000 VA";
			} else if ((dblPrice >= 5000) && (dblPrice < 7500)) {
				powerCategory = "5000 VA - 7500 VA";
			} else if ((dblPrice >= 7500)) {
				powerCategory = "More than 7500 VA";
			}
		}
		product.setProperty("__text__ratedPower", powerCategory);
		return product;
	}
}