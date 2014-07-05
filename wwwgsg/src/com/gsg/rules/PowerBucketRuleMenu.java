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

public class PowerBucketRuleMenu implements Rule {

	public Entity runRule(Entity menu) {
		menu.setProperty(
				"ratedPower",
				"Rated Power,Less than 500 VA,500 VA - 1000 VA,1000 VA - 2500 VA,2500 VA - 3500 VA,3500 VA - 5000 VA,5000 VA - 7500 VA,More than 7500 VA");
		return menu;
	}
}