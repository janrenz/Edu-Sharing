package org.edu_sharing.repository.server.tools.cache;

import java.io.File;
import java.util.ArrayList;

import org.alfresco.repo.content.ContentStore;
import org.alfresco.repo.model.Repository;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.namespace.QName;
import org.apache.commons.io.FileUtils;
import org.edu_sharing.alfrescocontext.gate.AlfAppContextGate;
import org.edu_sharing.repository.client.tools.CCConstants;
import org.edu_sharing.repository.server.PreviewServlet;
import org.springframework.context.ApplicationContext;

import antlr.collections.List;

public class PreviewCache {
	public static int[] CACHE_SIZES_WIDTH=new int[]{200,250,320,400,400,600};
	public static int[] CACHE_SIZES_HEIGHT=new int[]{150,200,240,300,350,450};
	

	private static final String STORE_LOCATION = "previewCache";
	private static File getCacheStore(){
		File cacheStore = new File(getRootLocation(), STORE_LOCATION);
		if (! cacheStore.exists()) {
			cacheStore.mkdir();
		}
		return cacheStore;
	}
	private static File getRootLocation() {
    	
		ApplicationContext applicationContext = AlfAppContextGate.getApplicationContext();
		
		ContentStore store = (ContentStore) applicationContext.getBean("fileContentStore");
		return new File(store.getRootLocation()).getParentFile();
    }
	public static File getFileForNode(String nodeId,int width,int height,boolean createDirectories){
		File folder=new File(getCacheStore(),width==-1 ? "full_"+PreviewServlet.MAX_IMAGE_SIZE : (width+"x"+height));
		if(!folder.exists()){
			if(createDirectories)
				folder.mkdir();
			else
				return null;
		}
		
		folder=new File(folder,nodeId.substring(0,4));
		if(!folder.exists() && createDirectories){
			if(createDirectories)
				folder.mkdir();
			else
				return null;
		}
		return new File(folder,nodeId+".jpg");
	}
	/**
	 * Removes all previews from the given node from cache
	 * The system will automatically rebuild the cache on the next preview request
	 * Call this method if the content has changed
	 * @param nodeId
	 */
	public static void purgeCache(String nodeId){
		ApplicationContext applicationContext = AlfAppContextGate.getApplicationContext();
		ServiceRegistry serviceRegistry = (ServiceRegistry) applicationContext.getBean(ServiceRegistry.SERVICE_REGISTRY);
		NodeService nodeService = serviceRegistry.getNodeService();
		
		ArrayList<String> ids=new ArrayList<String>();
		ids.add(nodeId);
		
		//only for IO's
		if(nodeService.getType(new NodeRef(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE,nodeId)).
				equals(QName.createQName(CCConstants.CCM_TYPE_IO))) {
			for(ChildAssociationRef ref : nodeService.getChildAssocs(new NodeRef(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE,nodeId))){
				ids.add(ref.getChildRef().getId());
			}
		}
		for(String id : ids){
			for(int i=0;i<CACHE_SIZES_WIDTH.length;i++) {
				File file=getFileForNode(id, CACHE_SIZES_WIDTH[i], CACHE_SIZES_HEIGHT[i],false);
				if(file!=null) file.delete();
			}
		}
	}
	public static int getNumberOfPreviews() {
		int count=0;
		for(int i=0;i<CACHE_SIZES_WIDTH.length;i++){
			String name=CACHE_SIZES_WIDTH[i]+"x"+CACHE_SIZES_HEIGHT[i];
			File[] files = new File(getCacheStore(),name).listFiles();
			if(files!=null)
				count+=files.length;
		}
		return count;	
	}
	public static long getTotalSize() {
		return FileUtils.sizeOfDirectory(getCacheStore());
	}
}
