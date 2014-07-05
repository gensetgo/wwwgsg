package com.gsg.loader;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.gsg.helper.Util;

public class LoadDataServlet extends HttpServlet {
	private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	private static final Logger log = Logger.getLogger(LoadDataServlet.class.getName());

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String command = req.getParameter("command");

	}

	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json; charset=utf-8");
		resp.setHeader("Cache-Control", "no-cache");
		String wbStr = req.getParameter("blobKey");
		ArrayList header = new ArrayList();
		String entity = req.getParameter("entity");
		;

		try {
			BlobInfoFactory blobInfoFactory = new BlobInfoFactory(DatastoreServiceFactory.getDatastoreService());
			BlobKey blobKey = new BlobKey(req.getParameter("blobKey"));
			BlobInfo blobInfo = blobInfoFactory.loadBlobInfo(blobKey);
			Long s = blobInfo.getSize();
			byte[] b = blobstoreService.fetchData(blobKey, 0, s);

			// PrintWriter out = res.getWriter();

			InputStream is = new ByteArrayInputStream(b);

			Workbook workbook = Workbook.getWorkbook(is);
			Sheet sheet = workbook.getSheet(0);
			String row = "";
			int golumns = sheet.getColumns();
			int roz = sheet.getRows();
			Entity obj = null;

			for (int k = 0; k < 1; k++) {
				for (int i = 0; i < golumns; i++) {
					Cell a1 = sheet.getCell(i, k);
					row = row + "|" + a1.getContents().toString();
					header.add(i, a1.getContents().toString());
				}
				// System.out.println(row +
				// " ----V 2------------------------------------------\n");
				row = "";
			}
			Object title = null;
			for (int j = 1; j < roz; j++) {
				// System.out.println(roz + "<--               -->" +
				// sheet.getCell(0, j).getContents().toString());
				obj = new Entity(entity, sheet.getCell(0, j).getContents().toString());
				try {
					for (int i = 1; i < golumns; i++) {
						Cell a1 = sheet.getCell(i, j);
						row = row + "|" + a1.getContents().toString();
						title = header.get(i);
						if ((title != null) && (!((String) title).equalsIgnoreCase(""))) {
							obj.setProperty((String) header.get(i), a1.getContents().toString());
						}
					}
					Util.persistEntity(obj);
				} catch (Exception ex) {
					log.severe("Error in Row : " + sheet.getCell(0, j).getContents().toString() + "  : " + ex.getMessage());
				}
				row = "";
			}
			workbook.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

}
