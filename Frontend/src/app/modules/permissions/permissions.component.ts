import {Component, ViewChild, ElementRef} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Translation} from "../../core-ui-module/translation";
import {
    NodeRef, IamUser, NodeWrapper, Node, Version, NodeVersions, LoginResult,
    IamGroups, Group, OrganizationOrganizations, Organization
} from "../../core-module/core.module";
import {Router, Params, ActivatedRoute, Routes} from "@angular/router";
import {Toast} from "../../core-ui-module/toast";
import {RestConnectorService} from "../../core-module/core.module";
import {RestOrganizationService} from "../../core-module/core.module";
import {ConfigurationService} from "../../core-module/core.module";
import {Title} from "@angular/platform-browser";
import {UIHelper} from "../../core-ui-module/ui-helper";
import {SessionStorageService} from "../../core-module/core.module";
import {RestHelper} from "../../core-module/core.module";
import {MainNavComponent} from '../../common/ui/main-nav/main-nav.component';
import {GlobalContainerComponent} from "../../common/ui/global-container/global-container.component";

@Component({
  selector: 'permissions-main',
  templateUrl: 'permissions.component.html',
  styleUrls: ['permissions.component.scss'],
  animations: [

  ]
})
export class PermissionsMainComponent {
  @ViewChild('mainNav') mainNavRef: MainNavComponent;
  public tab : number;
  public searchQuery: string;
  private selected: Organization[];
  public isAdmin = false;
  public disabled = false;
  TABS = ["ORG","GROUP","USER","DELETE"];
  constructor(private toast: Toast,
              private route: ActivatedRoute,
              private router: Router,
              private config: ConfigurationService,
              private title: Title,
              private translate: TranslateService,
              private storage : SessionStorageService,
              private organization: RestOrganizationService,
              private connector: RestConnectorService) {
    Translation.initialize(translate,this.config,this.storage,this.route).subscribe(()=>{
      UIHelper.setTitle('PERMISSIONS.TITLE',this.title,this.translate,this.config);
        this.connector.isLoggedIn().subscribe((data: LoginResult) => {
            if(data.isValidLogin && !data.isGuest && !data.currentScope){
                this.organization.getOrganizations().subscribe((data: OrganizationOrganizations) => {
                    this.isAdmin = data.canCreate;
                });
                this.tab=0;
            }
            else{
                this.goToLogin();
            }
            GlobalContainerComponent.finishPreloading();
        }, (error: any) => this.goToLogin());
        this.config.get("hideMainMenu").subscribe((data:string[])=>{
            if(data && data.indexOf("permissions")!=-1){
                //this.router.navigate([UIConstants.ROUTER_PREFIX+"workspace"]);
                this.disabled=true;
            }
        });
    });

  }

  public doSearch(event: string) {
    this.searchQuery = event;
  }

  setTab(tab: number) {
    if (tab != 0 && !this.selected && !this.isAdmin) {
      this.toast.error(null, "PERMISSIONS.SELECT_ORGANIZATION");
      this.tab = 0;
      return;
    }
    if (tab === this.tab)
      return;
    if (tab === 0) {
      this.selected = null;
    }
    this.searchQuery = null;
    this.tab = tab;
  }

  private goToLogin() {
    RestHelper.goToLogin(this.router,this.config);
  }
}
