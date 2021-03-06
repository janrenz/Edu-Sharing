package org.edu_sharing.alfresco.policy;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.node.NodeServicePolicies;
import org.alfresco.repo.node.NodeServicePolicies.BeforeCreateNodePolicy;
import org.alfresco.repo.policy.JavaBehaviour;
import org.alfresco.repo.policy.PolicyComponent;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.QName;
import org.edu_sharing.repository.client.tools.CCConstants;


/**
 * 
 * @author rudi
 * 
 * prevent creating of subobjects of an MAP with MAP_TYPE EDUGROUP
 *
 */
public class BeforeCreateNodeInEduGroupFolder implements NodeServicePolicies.BeforeCreateNodePolicy {

	NodeService nodeService;
	PolicyComponent policyComponent;
	
	public void init(){
		policyComponent.bindClassBehaviour(BeforeCreateNodePolicy.QNAME, ContentModel.TYPE_FOLDER, new JavaBehaviour(this, "beforeCreateNode"));
		policyComponent.bindClassBehaviour(BeforeCreateNodePolicy.QNAME, ContentModel.TYPE_CONTENT, new JavaBehaviour(this, "beforeCreateNode"));
		policyComponent.bindClassBehaviour(BeforeCreateNodePolicy.QNAME, QName.createQName(CCConstants.CCM_TYPE_IO), new JavaBehaviour(this, "beforeCreateNode"));
		policyComponent.bindClassBehaviour(BeforeCreateNodePolicy.QNAME, QName.createQName(CCConstants.CCM_TYPE_MAP), new JavaBehaviour(this, "beforeCreateNode"));
	}
	
	@Override
	public void beforeCreateNode(NodeRef parentRef, QName assocTypeQName, QName assocQName, QName nodeTypeQName) {
		if(QName.createQName(CCConstants.CCM_TYPE_MAP).equals(nodeService.getType(parentRef)) ){
			String mapType = (String)nodeService.getProperty(parentRef, QName.createQName(CCConstants.CCM_PROP_MAP_TYPE));
			//if its "Gemeinsame Inhalte"
			if(mapType != null && mapType.equals(CCConstants.CCM_VALUE_MAP_TYPE_EDUGROUP)){
				throw new NodeCreateDeniedException("creating nodes is not allowed in this folder");
			}
		}
		
	}
	
	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}
	
	public void setPolicyComponent(PolicyComponent policyComponent) {
		this.policyComponent = policyComponent;
	}
	
}
