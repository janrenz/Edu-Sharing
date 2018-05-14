import {UIAnimation} from "../ui-animation";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {trigger} from "@angular/animations";
import {Node,NodeList} from "../../rest/data-object";
import {RestNodeService} from "../../rest/services/rest-node.service";
import {ConfigurationService} from "../../services/configuration.service";
import {RestHelper} from "../../rest/rest-helper";
import {ConfigurationHelper} from "../../rest/configuration-helper";
import {Router} from "@angular/router";
import {UIConstants} from "../ui-constants";


@Component({
  selector: 'node-info',
  templateUrl: 'node-info.component.html',
  styleUrls: ['node-info.component.scss'],
  animations: [
      trigger('fade', UIAnimation.fade()),
      trigger('cardAnimation', UIAnimation.cardAnimation())
  ]
})
/**
 * A node info dialog (useful primary for admin stuff)
 */
export class NodeInfoComponent{
    _path: Node[];
    _node : Node;
    _creator: string;
    _json: string;
  @Input() set node(node : Node){
    this._node=node;
    this._creator=ConfigurationHelper.getPersonWithConfigDisplayName(this._node.createdBy,this.config);
    this._json=JSON.stringify(this._node,null,4);
    this.nodeApi.getNodeParents(this._node.ref.id,true).subscribe((data:NodeList)=>{
      this._path=data.nodes.reverse();
    });
  }
  @Output() onClose = new EventEmitter();
  constructor(private nodeApi : RestNodeService,
              private config : ConfigurationService,
              private router : Router){}

  close(){
    this.onClose.emit();
  }
  openNode(){
    this.router.navigate([UIConstants.ROUTER_PREFIX,"workspace"],{queryParams:{id:this._node.parent.id,file:this._node.ref.id}});
  }
  openBreadcrumb(pos:number){
    let node=this._path[pos-1];
    this.router.navigate([UIConstants.ROUTER_PREFIX,"workspace"],{queryParams:{id:node.ref.id}});
  }
}
