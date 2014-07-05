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

public class PowerBucketRuleCategory implements Rule {

	public Entity runRule(Entity cat) {
		cat.setProperty("__text__ratedPower", "Rated Power");
		return cat;
	}
}