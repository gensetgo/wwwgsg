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

public class PriceBucketRuleMenu implements Rule {

	public Entity runRule(Entity menu) {
		menu.setProperty(
				"priceCategory",
				"Price Range,Less than 15000,15000 - 20000,20000 - 40000,40000 - 60000,60000 - 100000,100000 - 150000,150000 - 200000,200000 - 500000,More than 500000");
		return menu;
	}
}