
import {Component, ViewChild, HostListener, ElementRef} from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import {Translation} from "../../common/translation";
import {RestSearchService} from '../../common/rest/services/rest-search.service';
import {RestMetadataService} from '../../common/rest/services/rest-metadata.service';
import {RestNodeService} from '../../common/rest/services/rest-node.service';
import {RestConstants} from '../../common/rest/rest-constants';
import {RestConnectorService} from "../../common/rest/services/rest-connector.service";
import {Node, NodeList, LoginResult, STREAM_STATUS} from '../../common/rest/data-object';
import {OptionItem} from "../../common/ui/actionbar/option-item";
import {TemporaryStorageService} from "../../common/services/temporary-storage.service";
import {UIHelper} from "../../common/ui/ui-helper";
import {Title} from "@angular/platform-browser";
import {ConfigurationService} from "../../common/services/configuration.service";
import {SessionStorageService} from "../../common/services/session-storage.service";
import {UIConstants} from "../../common/ui/ui-constants";
import {RestMdsService} from "../../common/rest/services/rest-mds.service";
import {RestHelper} from "../../common/rest/rest-helper";
import {ListItem} from "../../common/ui/list-item";
import {MdsHelper} from "../../common/rest/mds-helper";
import {Observable} from 'rxjs/Rx';
import {RestStreamService} from "../../common/rest/services/rest-stream.service";



@Component({
  selector: 'app-stream',
  templateUrl: 'stream.component.html',
  styleUrls: ['stream.component.scss'],
  })



export class StreamComponent {
  today() {
      var d = new Date();
      var weekday = d.getDay();
      var dd = d.getDate(); 
      var mm = d.getMonth()+1; //January is 0!
      var yyyy = String(d.getFullYear());
      var outstring = '';
      if (weekday == 0) outstring += 'Sonntag, der ';
      if (weekday == 1) outstring += 'Montag, der ';
      if (weekday == 2) outstring += 'Dienstag, der ';
      if (weekday == 3) outstring += 'Mittwoch, der ';
      if (weekday == 4) outstring += 'Donnerstag, der ';
      if (weekday == 5) outstring += 'Freitag, der ';
      if (weekday == 6) outstring += 'Samstag, der ';
      if(dd<10) {outstring += '0'+String(dd);} else {outstring += String(dd);}
      outstring += '. ';
      if(mm<10) {outstring += '0'+String(mm);} else {outstring +=  String(mm);}
      return outstring + '. ' + String(yyyy);
  }
  menuOption = 'stream';
  streams: any;
  actionOptions:OptionItem[]=[];

  erledigtOption = new OptionItem('Erledigt','check',(node: Node)=>{
    this.updateStream(node, STREAM_STATUS.DONE).subscribe(data => this.updateDataFromJSON(STREAM_STATUS.OPEN) , error => console.log(error));
  });

  nichtErledigtOption = new OptionItem('Doch Nicht Erledigt','check',(node: Node)=>{
    this.updateStream(node, STREAM_STATUS.OPEN).subscribe(data => this.updateDataFromJSON(STREAM_STATUS.DONE) , error => console.log(error));
  });

  // TODO: Store and use current search query
  searchQuery:string;
  doSearch(query:string){
    this.searchQuery=query;
    console.log(query);
    // TODO: Search for the given query doch nicht erledigt
  }
  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private connector:RestConnectorService,
    private nodeService: RestNodeService,
    private searchService: RestSearchService,
    private metadataService:RestMetadataService,
    private streamService:RestStreamService,
    private storage : TemporaryStorageService,
    private session : SessionStorageService,
    private title : Title,
    private config : ConfigurationService,
    private http: Http,
    private translate : TranslateService) {
      Translation.initialize(translate,this.config,this.session,this.route).subscribe(()=>{
        UIHelper.setTitle('STREAM.TITLE',title,translate,config);
      });

      // please refer to http://appserver7.metaventis.com/ngdocs/4.1/classes/optionitem.html
      this.actionOptions.push(this.erledigtOption);
      this.actionOptions.push(new OptionItem('Ganz oben anzeigen','arrow_upward',()=>{
          alert('callback 2');
      }));
      this.actionOptions.push(new OptionItem('Aus Stream entfernen','remove_circle',()=>{
        alert('callback 3');
    }));
      this.updateDataFromJSON(STREAM_STATUS.OPEN);

  }

  onScroll() {
    console.log("scrolled!!");
    //this.getJSON().subscribe(data => this.streams = this.streams.concat(data['stream']), error => console.log(error));
  }

  menuOptions(option: any) {
    this.menuOption = option;
    if (option === 'stream') {
      this.updateDataFromJSON(STREAM_STATUS.OPEN);
      this.actionOptions[0] = this.erledigtOption;
    } else {
      this.updateDataFromJSON(STREAM_STATUS.DONE);
      this.actionOptions[0] = this.nichtErledigtOption;
    }

  }

  updateDataFromJSON(streamStatus: any) {
    this.getSimpleJSON(streamStatus).subscribe(data => {
      console.log('test: ', data);
      this.streams = (<any>data)['streams'];
      console.log(this.streams);
    }, error => console.log(error));
  }

  sortieren() {
    //console.log(this.streams);
    console.log(this.actionOptions);
   // let temp = this.other['stream'].shift();
    //this.other['stream'].push(temp);
  }

  refresh(): void {
    window.location.reload();
  }

  onStreamObjectClick(node: any) {
    console.log(node.nodes[0].ref.id);
    this.router.navigate([UIConstants.ROUTER_PREFIX+"render", node.nodes[0].ref.id])

  }

  public getJSON(streamStatus: any): Observable<any> {
    let request:any={offset:this.streams ? this.streams.length : 0};
    return this.streamService.getStream(streamStatus,this.searchQuery,{},request);
  }

  public getSimpleJSON(streamStatus: any) {
    return this.streamService.getStream(streamStatus);
  }

  public updateStream(idToUpdate: any, status: any): Observable<any> {
    return this.streamService.updateStatus(idToUpdate, this.connector.getCurrentLogin().authorityName, status)
  }


}
