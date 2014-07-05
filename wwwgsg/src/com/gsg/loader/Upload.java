package com.gsg.loader;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.gsg.helper.Util;

public class Upload extends HttpServlet {
	private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	private static final Logger logger = Logger.getLogger(Util.class.getCanonicalName());

	public void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		ServletFileUpload upload = new ServletFileUpload();
		res.setContentType("text/plain");
		String command = "";
		String entity = "";
		String file = "";
		FileItemIterator iterator;
		int i = 900;
		Entity config = new Entity("Setup", "logo");

		try {
			
			Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);
			BlobKey blobKey = blobs.get("myFile");
			entity = req.getParameter("entity");
			if (entity.equalsIgnoreCase("logo")) {
				config.setProperty("key", blobKey.getKeyString());
				Util.persistEntity(config);
			} else {
				createBackendTask(blobKey, entity);
			}
			res.sendRedirect("/upload.jsp");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void createBackendTask(BlobKey blobKey, String entity) {
		Queue queue = QueueFactory.getQueue("LoadQueue");
		TaskOptions taskOptions = TaskOptions.Builder.withUrl("/loadFile").param("blobKey", blobKey.getKeyString()).param("entity", entity).header("Host", BackendServiceFactory.getBackendService().getBackendAddress("load-backend")).method(Method.POST);
		queue.add(taskOptions);

	}

}
