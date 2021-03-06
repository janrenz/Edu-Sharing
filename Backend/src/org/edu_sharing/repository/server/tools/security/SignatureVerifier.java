package org.edu_sharing.repository.server.tools.security;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.alfresco.repo.security.authentication.AuthenticationUtil;
import org.alfresco.repo.security.authentication.AuthenticationUtil.RunAsWork;
import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.edu_sharing.repository.client.tools.CCConstants;
import org.edu_sharing.repository.server.tools.ApplicationInfo;
import org.edu_sharing.repository.server.tools.ApplicationInfoList;
import org.edu_sharing.service.stream.StreamService;
import org.edu_sharing.service.stream.StreamServiceFactory;
import org.edu_sharing.service.stream.StreamServiceHelper;
import org.edu_sharing.service.permission.PermissionService;

public class SignatureVerifier {

	Logger logger = Logger.getLogger(SignatureVerifier.class);
	
	public class Result{
		int statuscode;
		String message;
		
		public Result(int statuscode,String message) {
			this.statuscode = statuscode;
			this.message = message;
		}
		
		public String getMessage() {
			return message;
		}
		
		public int getStatuscode() {
			return statuscode;
		}
	}
	
	
	public Result verify(String appId, String sig, String signed, String timeStamp){
		
		logger.debug("appId:"+appId+" sig:"+sig+" signed:"+signed+" timeStamp:"+timeStamp);
			
			ApplicationInfo appInfo = ApplicationInfoList.getRepositoryInfoById(appId);
			if(appInfo == null){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"appid "+appId+" is not registered");
			}
			
			if(appInfo.getPublicKey() == null || appInfo.getPublicKey().trim().equals("")){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MISSING PUBLIC KEY for appId:"+appId);
			}
			
			if(sig == null){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MISSING Signature");
			}
			
			
			if(timeStamp == null || timeStamp.trim().equals("")){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MISSING timestamp");
			}
		
			
			long messageSendTs = new Long(timeStamp);
			long messageArrivedTs = System.currentTimeMillis();
						
			long messageSendOffset = appInfo.getMessageSendOffsetMs();

			if((messageSendTs - messageSendOffset) > messageArrivedTs){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MESSAGE SEND TIMESTAMP newer than MESSAGE ARRIVED TIMESTAMP");
			}
			
			long messageOffset = appInfo.getMessageOffsetMs();
			
			if((messageArrivedTs - messageSendTs) > messageOffset ){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MESSAGE SEND TIMESTAMP TO OLD");
			}
						
			
			if(signed == null){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MISSING signed data");
			}
			
			if(!signed.contains(timeStamp)){
				return new Result(HttpServletResponse.SC_BAD_REQUEST,"MISSING timestamp in signed data");
			}
			
			boolean verified = false;
			try{
				Signing signing = new Signing();
				
				byte[] decoded = new Base64().decode(sig.getBytes());
				
				verified = signing.verify(signing.getPemPublicKey(appInfo.getPublicKey(), "RSA"),decoded, signed, "SHA1withRSA");
				
				
			}catch(Exception e){
				e.printStackTrace();
				return new Result(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,e.getMessage());
			}
			
			
			if(!verified){
				return new Result(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Signature could not be verified!");
			}
			
			
			return new Result(HttpServletResponse.SC_OK, "OK");
		
	}
}
