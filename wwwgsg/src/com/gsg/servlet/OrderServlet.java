/**
 * Copyright 2011, Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.gsg.servlet;

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

import java.io.ByteArrayOutputStream;
import java.security.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Transaction;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
//import com.gsg.accounting.TaxCalculator;
import com.gsg.helper.Util;
//import com.payzippy.sdk.*;
/**
 * This servlet responds to the request corresponding to orders. The Class
 * places the order.
 * 
 * @author
 */
@SuppressWarnings("serial")
public class OrderServlet extends BaseServlet {

	private static final Logger logger = Logger.getLogger(OrderServlet.class
			.getCanonicalName());
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	private BlobstoreService blobstoreService = BlobstoreServiceFactory
			.getBlobstoreService();

	/**
	 * Redirect the call to doDelete or doPut method.
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String action = "" + req.getParameter("action");
		if (action.equalsIgnoreCase("trackOrder")) {
			doTrack(req, resp);
		} else {
			doPut(req, resp);
			return;
		}
	}

	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	/**
	 * Insert the order and corresponding line item in a single transaction
	 */
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String message = "";

		try {

			int itemRoz = Integer.parseInt(req.getParameter("itemRoz"));
			SimpleDateFormat dteFormat = new SimpleDateFormat("YYY-MM-dd");
			String dte = dteFormat.format(new Date()).toString();
			String appnd = "";
			String email = req.getParameter("email");
			String phone = req.getParameter("phone");
			String cust_name = req.getParameter("cust_name");
			String pincode = req.getParameter("pincode");
			String address = req.getParameter("address");
			String landmark = req.getParameter("landmark");
			String city = req.getParameter("city");
			String state = req.getParameter("state");

			String cust_name_bill = req.getParameter("cust_name_bill");
			String pincode_bill = req.getParameter("pincode_bill");
			String address_bill = req.getParameter("address_bill");
			String landmark_bill = req.getParameter("landmark_bill");
			String city_bill = req.getParameter("city_bill");
			String state_bill = req.getParameter("state_bill");

			String pay_method = req.getParameter("pay_method");
			String utr = req.getParameter("utr");
	//		String scan = req.getParameter("scan");

			String item_sub_tot = req.getParameter("item_sub_tot");
			String item_vat = req.getParameter("item_vat");
			String item_grand_tot = req.getParameter("item_grand_tot");
			String summary="";
			Entity order = new Entity("Order");
			order.setProperty("orderDate", dte);
			order.setProperty("email", email);
			order.setProperty("phone", phone);
			order.setProperty("cust_name", cust_name);
			order.setProperty("pincode", pincode);
			order.setProperty("address", address);
			order.setProperty("landmark", landmark);
			order.setProperty("city", city);
			order.setProperty("state", state);
			order.setProperty("cust_name_bill", cust_name_bill);
			order.setProperty("pincode_bill", pincode_bill);
			order.setProperty("address_bill", address_bill);
			order.setProperty("landmark_bill", landmark_bill);
			order.setProperty("city_bill", city_bill);
			order.setProperty("state_bill", state_bill);
			order.setProperty("pay_method", pay_method);
			order.setProperty("utr", utr);
			//order.setProperty("scan", scan);
			order.setProperty("item_sub_tot", item_sub_tot);
			order.setProperty("item_vat", item_vat);
			order.setProperty("item_grand_tot", item_grand_tot);
			order.setProperty("status", "Under Review");
			
			Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);
			if(blobs.get("scan")!=null){
				String blobKey = blobs.get("scan").getKeyString();
				order.setProperty("scanDocKey", blobKey);
			}

			
			Util.persistEntity(order);	

			for (int i = 1; i <= itemRoz; i++) {
				if (i == 1) {
					appnd = "";
				} else {
					appnd = i + "";
				}
				Entity lineItem = new Entity("Item", order.getKey());
				lineItem.setProperty("item_price",
						req.getParameter("item_price" + appnd));
				lineItem.setProperty("item_quantity",
						req.getParameter("item_quantity" + appnd));
				lineItem.setProperty("item_line_tot",
						req.getParameter("item_line_tot" + appnd));
				lineItem.setProperty("item_des",
						req.getParameter("item_des" + appnd));
				lineItem.setProperty("item_id",
						req.getParameter("item_id" + appnd));
				summary=summary+" "+req.getParameter("item_des" + appnd);
				Util.persistEntity(lineItem);
				
			}
			message = "Order created successfully";
			order.setProperty("productinfo", summary);

			
			if(pay_method.equalsIgnoreCase("credit card")){
				
				//set all the parameters in the charging builder object
/*				ChargingRequestBuilder chargingBuilder=ChargingRequest.getBuilder();
				chargingBuilder.setBuyerEmailId(email);
				chargingBuilder.setMerchantTransactionId((""+order.getKey()).replace("Order(", "").replace(")", ""));
				chargingBuilder.setMerchantKeyId("payment");
				chargingBuilder.setMerchantId("test_t1516");
				
				chargingBuilder.setTransactionAmount("43000");
				chargingBuilder.setPaymentMethod("NET");
				chargingBuilder.setCurrency("INR");
				chargingBuilder.setUiMode("REDIRECT").setHashMethod("sha256");
				chargingBuilder.setTransactionType("SALE");
				chargingBuilder.setBankName("ICICI");
				
				//similarly set all the mandatory parameters as shown above

				//and to set any optional parameter in the charging builder object
				chargingBuilder.putParams("buyer_phone_no", phone);
				chargingBuilder.putParams("shipping_address", address);
				chargingBuilder.putParams("callback_url", "http://localhost:8888/orderConfirmation.jsp?id="+order.getKey());

				//call build method which returns ChargingRequest object by passing the secret key
				ChargingRequest chargingRequest = chargingBuilder.build("58e5e534bbf36a5f4a4870a50ca1bbbd4133ca74555a6e7a5b307c504a295bcf");

				String url = chargingRequest.getUrl("https://www.payzippy.com/payment/api/charging/v1");

				//if ui_mode is REDIRECT, then
				resp.sendRedirect(url);*/
				String merchant_key="0dy9po";
				String url=	"https://test.payu.in/_payment";
				String surl="http://www.gensetgo.com/orderConfirmation.jsp?id="+order.getKey().getId();
				String furl="http://www.gensetgo.com/orderConfirmation.jsp?id="+order.getKey().getId();
				String service_provider="payu_paisa";
				String hash=getHashString(order);

				url=url+"?key="+merchant_key+"&txnid="+order.getKey().getId()+"&service_provider="+service_provider+"&amount="+order.getProperty("item_grand_tot")+"&productinfo="+order.getProperty("productinfo")+"&firstname="+order.getProperty("cust_name")+"&email="+order.getProperty("email")+"&phone="+order.getProperty("phone")+"&surl="+surl+"&furl="+furl+"&hash="+hash;
				System.out.println(url);
				resp.sendRedirect(url);
			/*	RequestDispatcher dispatcher = req
						.getRequestDispatcher(url);
				dispatcher.forward(req, resp);*/
			}else{
				req.setAttribute("productinfo",summary);
			RequestDispatcher dispatcher = req
					.getRequestDispatcher("orderConfirmation.jsp");
			sendEmail("" + order.getKey().getId(), email, cust_name);
			dispatcher.forward(req, resp);
			}
		} catch (Exception e) {
			logger.log(Level.SEVERE, e.getMessage(), e);
			message = "Order creation failed. Reason: ";
			resp.getWriter().println(
					Util.writeJSONError(message + " >> " + e.getMessage()));
		}
	}

	public void sendEmail(String orderId, String email, String name)
			throws Exception {
		// String content = "Invoice number " + invNum + "generated";
		String content = orderConfirmation(orderId);
		System.out.println(content);
		logger.log(Level.INFO, content);
		Properties properties = new Properties();
		Session session = Session.getDefaultInstance(properties, null);
		// ByteArrayOutputStream outputStream = null;
		MimeBodyPart textBodyPart = new MimeBodyPart();
		// textBodyPart.setText(content);
		textBodyPart.setContent(content, "text/html; charset=utf-8");
		// outputStream = new ByteArrayOutputStream();
		// byte[] bytes = outputStream.toByteArray();
		// DataSource dataSource = new ByteArrayDataSource(bytes,
		// "application/pdf");
		// MimeBodyPart pdfBodyPart = new MimeBodyPart();
		// pdfBodyPart.setDataHandler(new DataHandler(dataSource));
		// pdfBodyPart.setFileName("VSA_INVOICE_" + invNum + ".pdf");
		MimeMultipart mimeMultipart = new MimeMultipart();
		mimeMultipart.addBodyPart(textBodyPart);
		// mimeMultipart.addBodyPart(pdfBodyPart);
		MimeMessage mimeMessage = new MimeMessage(session);

		mimeMessage.setFrom(new InternetAddress("gensetgo@gmail.com",
				"GensetGo Sales Team"));
		mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(
				email, name));
		mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(
				"sales@gensetgo.com", "GensetGo Sales Team"));
		mimeMessage.setSubject("Order Confirmation - " + orderId);
		mimeMessage.setContent(mimeMultipart);
		Transport.send(mimeMessage);

	}

	private String orderConfirmation(String orderId) {

		Entity order = Util.findEntity(KeyFactory.createKey("Order",
				Long.parseLong(orderId)));

		Iterator iterator = Util.listChildren("Item",
				KeyFactory.createKey("Order", Long.parseLong(orderId)))
				.iterator();
		String htm = " <html><head><style>.specs-table {width: 100%;border-spacing: 1px;font-family: Corbel, Arial, Helvetica, sans-serif;}"
				+ ".separator {	background-color: #F4F4F4;	height: 2px;	margin-top:1%;	margin-bottom:1%;	}"
				+ ".w-col-12 {	width: 100%}.w-col .w-col {	padding-left: 0;	padding-right: 0}.details-p1box-features "
				+ "{	height: 400px;	font-family: Corbel, Arial, Helvetica, sans-serif;	color: #554d42;	font-size: 14px; 	"
				+ "font-style: normal;	font-weight: 300;	text-align: left;	letter-spacing: 0px;	list-style-type: disc;	text-shadow: none;"
				+ "	background: url(/images/tu.jpg) no-repeat center center;}</style></head>";
		 htm = htm+"<body class=\"specs-table\">Dear "+order.getProperty("cust_name")+",<br/> <br/> Thanks for shopping at GensetGo!! <br><br/>  You have placed the below-mentioned order with us. The order is "
				+ "currently under review. We shall get back to you shortly with further updates. Meanwhile, please  review your order and do let us know in case of "
				+ "descrepancies by replying to this email or by calling us at +91-8956711191";
		 htm =htm+ " <div class=\"w-row row2\">	<div class=\"w-col w-col-12 details-p1box\">		<br /> <br />	<h3>Order Reference Number -";
		htm = htm
				+ orderId
				+ "</h3>	<table class=\"specs-table\"><tr><td><table class=\"specs-table\"><tr><th colspan=\"2\">Personal Details</th></tr><tr><td>Name</td>	<td>";
		htm = htm + order.getProperty("cust_name")
				+ "</td></tr>	<tr><td>Email</td><td>"
				+ order.getProperty("email")
				+ "</td></tr><tr><td>Phone Number</td>	<td>";
		htm = htm
				+ order.getProperty("phone")
				+ "</td></tr></table></td><td><table class=\"specs-table\"><tr><td>Date of Order</td><td>"
				+ order.getProperty("orderDate") + "</td>";
		htm = htm + "					</tr>";
		htm = htm + "						<tr>";
		htm = htm + "							<td>Payment Method</td>";
		htm = htm + "							<td>" + order.getProperty("pay_method") + " - "
				+ ("" + order.getProperty("utr")).replace(" - null", "") + "";
		htm = htm + "							</tr>";

		htm = htm + "					</table>";
		htm = htm + "		</td>";
		htm = htm + "		</tr>";
		htm = htm + "	</table>";
		htm = htm + "		<div class=\"separator\"></div>";
		htm = htm + "		<table class=\"specs-table\">";
		htm = htm + "			<tr>";
		htm = htm + "				<td>";
		htm = htm + "	<table>";
		htm = htm + "<th colspan=\"2\">Shipping Address</th>";
		htm = htm + "<tr>";
		htm = htm + "<td>Name*</td>";
		htm = htm + "<td>" + order.getProperty("cust_name") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "	<td>Pin Code*</td>";
		htm = htm + "<td>" + order.getProperty("pincode") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>Address*</td>";
		htm = htm + "<td>" + order.getProperty("address") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>Landmark</td>";
		htm = htm + "<td>" + order.getProperty("landmark") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>City*</td>";
		htm = htm + "<td>" + order.getProperty("city") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>State*</td>";
		htm = htm + "<td>" + order.getProperty("state") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "</table>";
		htm = htm + "</td>";
		htm = htm + "<td></td>";
		htm = htm + "<td>";
		htm = htm + "<table>";
		htm = htm + "<th colspan=\"2\">Billing Address</th>";
		htm = htm + "<tr>";
		htm = htm + "<td>Name</td>";
		htm = htm + "<td>" + order.getProperty("cust_name_bill") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>Pin Code</td>";
		htm = htm + "<td>" + order.getProperty("pincode_bill") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>Address</td>";
		htm = htm + "<td>" + order.getProperty("address_bill") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>Landmark</td>";
		htm = htm + "<td>" + order.getProperty("landmark_bill") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>City</td>";
		htm = htm + "<td>" + order.getProperty("city_bill") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td>State</td>";
		htm = htm + "<td>" + order.getProperty("state_bill") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "</table>";
		htm = htm + "</td>";
		htm = htm + "</tr>";
		htm = htm + "</table>";
		htm = htm + "<div class=\"separator\"></div>";
		htm = htm + "<h3>Item Summary</h3>";
		htm = htm + "<table class=\"specs-table\">";
		htm = htm + "	<tr>";
		htm = htm + "<td>S no</td>";
		htm = htm + "<td>Item</td>";
		htm = htm + "<td>Price</td>";
		htm = htm + "<td>Quantity</td>";
		htm = htm + "<td>Total</td>";
		htm = htm + "</tr>";
		while (iterator.hasNext()) {
			Entity lineItem = (Entity) iterator.next();
			htm = htm + "<tr>";
			htm = htm + "<td>1</td>";
			htm = htm + "<td>" + lineItem.getProperty("item_id") + "</td>";
			htm = htm + "<td>" + lineItem.getProperty("item_price") + "</td>";
			htm = htm + "<td>" + lineItem.getProperty("item_quantity")
					+ "</td>";
			htm = htm + "<td>" + lineItem.getProperty("item_line_tot")
					+ "</td>";
			htm = htm + "</tr>";
		}

		htm = htm + "<tr>";
		htm = htm + "<td colspan=\"5\">&nbsp;</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td colspan=\"4\">Sub Total</td>";
		htm = htm + "<td>" + order.getProperty("item_sub_tot") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td colspan=\"4\">VAT</td>";
		htm = htm + "<td>" + order.getProperty("item_vat") + "</td>";
		htm = htm + "</tr>";
		htm = htm + "<tr>";
		htm = htm + "<td colspan=\"4\">Grand Total</td>";
		htm = htm + "<td>" + order.getProperty("item_grand_tot") + "</td>";
		htm = htm + "<tr>";
		htm = htm + "<tr>";
		htm = htm + "<td colspan=\"5\">&nbsp;</td>";
		htm = htm + "<tr>";
		htm = htm + "</table>";
		htm = htm + "<div class=\"separator\"></div>";
		htm = htm + "<br /> <br />";

		htm = htm + "</div>";
		htm = htm + "</div>";
		htm = htm + "<br/>";
		htm = htm + "Thanks again for shopping with us. <br/><br/>  Regards, <br/> Sales Team, <br/> GensetGo <br/><br/> <a>www.gensetgo.com</a>";

		htm = htm + "</body>";
		htm = htm + "</html>";

		return htm;

	}

	/**
	 * Delete the order and respective line items also in a single transaction
	 */
	protected void doTrack(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String orderId = req.getParameter("orderNumber");
		Entity order = null;
		try{
		if ((orderId != null) && (!orderId.equalsIgnoreCase(""))) {
			order = Util.findEntity(KeyFactory.createKey("Order",
					Long.parseLong(orderId)));
		}

		if (order == null) {
			SetMultimap<String, String> searchFilter = HashMultimap.create();
			searchFilter.put("orderDate", req.getParameter("orderDate"));
			searchFilter.put("email", req.getParameter("orderEmail"));
			Iterator orderiter = Util.listEntities("Order", searchFilter).iterator();
			if ( (orderiter!=null ) && (orderiter.hasNext())) {
				order= (Entity) orderiter.next();
			}
		}
		if (order != null) {
			req.setAttribute("order", order);
			RequestDispatcher dispatcher = req
					.getRequestDispatcher("orderConfirmation.jsp");
			dispatcher.forward(req, resp);
		} else {
			req.setAttribute("msg", "Hard Luck !!. Please try again");
			RequestDispatcher dispatcher = req
					.getRequestDispatcher("trackOrder.jsp");
			dispatcher.forward(req, resp);

		}
		}catch(Exception e){
			req.setAttribute("msg", "Hard Luck !!. Please try again");
			RequestDispatcher dispatcher = req
					.getRequestDispatcher("trackOrder.jsp?");
			dispatcher.forward(req, resp);
			e.printStackTrace();
		}

	}
	
	public String hashCal(String type,String str){
		byte[] hashseq=str.getBytes();
		StringBuffer hexString = new StringBuffer();
		try{
		MessageDigest algorithm = MessageDigest.getInstance(type);
		algorithm.reset();
		algorithm.update(hashseq);
		byte messageDigest[] = algorithm.digest();
            
		

		for (int i=0;i<messageDigest.length;i++) {
			String hex=Integer.toHexString(0xFF & messageDigest[i]);
			if(hex.length()==1) hexString.append("0");
			hexString.append(hex);
		}
			
		}catch(NoSuchAlgorithmException nsae){ }
		
		return hexString.toString();


	}
	
	public String getHashString(Entity order){
		String merchant_key="0dy9po";
		String salt="G0sUvbRo";
		String hashSequence = "item_grand_tot|productinfo|cust_name|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
		String[] hashVarSeq=hashSequence.split("\\|");
		String hashString= merchant_key+"|"+order.getKey().getId()+"|";
		
		for(String part : hashVarSeq)
		{
			hashString= order.getProperty(part)+"";
			hashString=hashString.concat("|");
		}
		hashString=hashString.concat(salt);
		
				System.out.println(hashString); 

		 String hash=hashCal("SHA-512",hashString);
		 		System.out.println(hash);

		
		return hash;
	}


	/**
	 * Get the requested orders and the line items in JSON format
	 * 
	 * protected void doGet(HttpServletRequest req, HttpServletResponse resp)
	 * throws ServletException, IOException { super.doGet(req, resp); String
	 * code = ""; String command = req.getParameter("command"); // searchFor =
	 * "SET"; PrintWriter out = resp.getWriter(); StringBuilder sb = new
	 * StringBuilder(); Iterable<Entity> entities = null; String currentCursor =
	 * req.getParameter("currentCursor");
	 * 
	 * if (command.equalsIgnoreCase("edit_stock")) { code =
	 * req.getParameter("code"); entities = Order.getAllStockForOrder(code); //
	 * out.println(Util.writeJSON(entity));
	 * out.println(Util.writeJSONM(entities)); } else if
	 * (command.equalsIgnoreCase("edit_item")) { code =
	 * req.getParameter("code"); entities = Order.getAllItemsForOrder(code);
	 * out.println(Util.writeJSONM(entities)); } else if
	 * (command.equalsIgnoreCase("edit_order")) { code =
	 * req.getParameter("code"); Entity entity = Order.getOrder(code);
	 * out.println(Util.writeJSON(entity)); } else if
	 * (command.equalsIgnoreCase("edit_att")) { code = req.getParameter("code");
	 * entities = Order.getAttachments(code);
	 * out.println(Util.writeJSON(entities)); } else if
	 * (command.equalsIgnoreCase("suggest")) { // String searchBy =
	 * req.getParameter("pl-searchby"); String searchFor =
	 * req.getParameter("type1"); searchFor = req.getParameter("term");
	 * SetMultimap<String, String> filter = Search.getFullText(searchFor);
	 * sb.append("["); Iterator it = filter.values().iterator(); while
	 * (it.hasNext()) { // entities = PL.getPL(it.next().toString());
	 * sb.append("\""); sb.append(it.next().toString()); sb.append("\","); } int
	 * x = sb.lastIndexOf(","); if (x >= 0) { sb.deleteCharAt(x); }
	 * sb.append("]"); // entities = PL.getPL(filter);
	 * out.println(sb.toString()); // System.out.println(sb.toString()); } else
	 * if (command.equalsIgnoreCase("search")) { // NOT USED String searchBy =
	 * req.getParameter("pl-searchby"); String searchFor =
	 * req.getParameter("q"); SetMultimap<String, String> filter =
	 * Search.getFullText(searchFor); entities = PL.getPL(filter);
	 * out.println(Util.writeJSON(entities)); } else if
	 * (command.equalsIgnoreCase("list")) { entities =
	 * Order.getPaginatedBillings(currentCursor, 22);
	 * out.println(Util.writeJSONPaginated(entities, 22)); } else if
	 * (command.equalsIgnoreCase("autoSave")) { String name =
	 * req.getParameter("name"); String value = req.getParameter("value");
	 * String orderId = req.getParameter("order"); Entity entity =
	 * Order.autoSave(orderId, name, value);
	 * out.println(Util.writeJSON(entity)); } else if
	 * (command.equalsIgnoreCase("cancel")) { String orderId =
	 * req.getParameter("order"); Entity entity = Order.cancelOrder(orderId);
	 * out.println(Util.writeJSON(entity)); } else if
	 * (command.equalsIgnoreCase("db_pending_order_payments")) { entities =
	 * Order.getUnpaidItems(); out.println(Util.writeJSON(entities)); }
	 * 
	 * }
	 */
}
