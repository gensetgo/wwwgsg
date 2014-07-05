package com.gsg.helper;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;

public class Serve extends HttpServlet {
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

public void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
	try{
		ImagesService imagesService = ImagesServiceFactory.getImagesService();

        BlobKey blobKey = new BlobKey(req.getParameter("blob-key"));
        String size = ""+req.getParameter("size");
        if(size.equalsIgnoreCase("thumbnail")){
        	res.sendRedirect(imagesService.getServingUrl(blobKey,150,false));
        } if(size.equalsIgnoreCase("details")){
        	res.sendRedirect(imagesService.getServingUrl(blobKey,350,false));
        }else{
        blobstoreService.serve(blobKey, res);
        }
    }catch(Exception e){
    	
    	
    }
}

}