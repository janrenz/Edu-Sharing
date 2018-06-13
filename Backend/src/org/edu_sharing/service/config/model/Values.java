package org.edu_sharing.service.config.model;
import javax.xml.bind.annotation.XmlElement;

public class Values{
	@XmlElement public String[] supportedLanguages;
	@XmlElement public String extension;
	@XmlElement public String loginUrl;
	@XmlElement public String registerUrl;
	@XmlElement public String recoverPasswordUrl;
	@XmlElement	public String imprintUrl;
	@XmlElement	public String privacyInformationUrl;
	@XmlElement	public String helpUrl;
	@XmlElement	public String whatsNewUrl;
	@XmlElement	public String editProfileUrl;
	@XmlElement	public Boolean editProfile;
	@XmlElement	public String[] workspaceColumns;
	@XmlElement	public String[] hideMainMenu;
	@XmlElement	public LogoutInfo logout;
	@XmlElement	public MenuEntry[] menuEntries;
	@XmlElement	public ContextMenuEntry[] nodeOptions;
	@XmlElement	public ContextMenuEntry[] searchNodeOptions;
	@XmlElement	public ContextMenuEntry[] nodeStoreOptions;
	@XmlElement	public String[] allowedLicenses;
	@XmlElement	public Workflow[] workflows;
	@XmlElement	public Boolean licenseDialogOnUpload;
	@XmlElement	public Boolean nodeReport;
	@XmlElement	public Boolean branding;
	@XmlElement	public String siteTitle;
	@XmlElement	public String userDisplayName;
	@XmlElement	public String defaultUsername;
	@XmlElement	public String defaultPassword;
	@XmlElement	public Banner banner;
	@XmlElement	public AvailableMds[] availableMds;
	@XmlElement	public String[] availableRepositories;
	@XmlElement	public Integer searchViewType;
	@XmlElement	public Integer itemsPerRequest;
	@XmlElement	public Rendering rendering;
	@XmlElement	public SessionExpiredDialog sessionExpiredDialog;
	@XmlElement	public String loginDefaultLocation;
	@XmlElement	public Boolean searchGroupResults;
	@XmlElement	public Mainnav mainnav;
	@XmlElement	public String searchSidenavMode;
	@XmlElement	public Guest guest;
	@XmlElement	public Collections collections;
	@XmlElement	public LicenseAgreement licenseAgreement;
}
