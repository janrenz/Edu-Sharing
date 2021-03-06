import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIAnimation} from '../../../core-module/ui/ui-animation';
import {trigger} from '@angular/animations';
import {UIHelper} from '../../../core-ui-module/ui-helper'
import {OptionItem} from '../../../core-ui-module/option-item';
import {Helper} from '../../../core-module/rest/helper';
import {UIConstants} from '../../../core-module/ui/ui-constants';
import {UIService} from '../../../core-module/core.module';

@Component({
  selector: 'actionbar',
  templateUrl: 'actionbar.component.html',
  styleUrls: ['actionbar.component.scss'],
  animations: [
    trigger('openOverlay', UIAnimation.openOverlay(UIAnimation.ANIMATION_TIME_FAST))
  ]
})
/**
 * The action bar provides several icons, usually at the top right, with actions for a current context
 */
export class ActionbarComponent {
  /**
   * The amount of options which are not hidden inside an overflow menu
   * @type {number} (default: depending on mobile (1) or not (2))
   * Also use numberOfAlwaysVisibleOptionsMobile to control the amount of mobile options visible
   */
  @Input() numberOfAlwaysVisibleOptions=2;
  @Input() numberOfAlwaysVisibleOptionsMobile=1;
  /**
   * Appearance show actionbar as button or circles (collection)
   * Values 'button' or 'round'
   * Appearance default = button;
   */
  @Input() appearance='button';
    /**
     * dropdownPosition is for position of dropdown (default = left)
     * Values 'left' or 'right'
     */
  @Input() dropdownPosition='left';
  public optionsAlways : OptionItem[] = [];
  public optionsMenu : OptionItem[] = [];
  public optionsToggle : OptionItem[] = [];

  /**
   * backgroundType for color matching, either bright, dark or primary
   * @type {boolean}
   */
  @Input() backgroundType = 'bright';
  /**
   * Set a node that will be returned by callbacks (optional, otherwise the return value is always null)
   * @type {null}
   */
  /**
   * Style, currently default or 'flat' if all always visible icons should get a flat look
   * @type {string}
   */
  @Input() style = 'default';
  /**
   * Should disabled ("greyed out") options be shown or hidden?
   * @type {boolean}
   */
  @Input() showDisabled = true;
  /**
   * Set the options, see @OptionItem
   * @param options
   */
  @Input() set options(options : OptionItem[]) {
    options=UIHelper.filterValidOptions(this.ui,Helper.deepCopyArray(options));
    if(options==null) {
      this.optionsAlways=[];
      this.optionsMenu=[];
      return;
    }
    this.optionsToggle=UIHelper.filterToggleOptions(options,true);
    this.optionsAlways=this.getActionOptions(UIHelper.filterToggleOptions(options,false)).slice(0,this.getNumberOptions());
    if(!this.optionsAlways.length) {
      this.optionsAlways=UIHelper.filterToggleOptions(options,false).slice(0,this.getNumberOptions());
    }
    this.optionsMenu=this.hideActionOptions(UIHelper.filterToggleOptions(options,false),this.optionsAlways);
    if(this.optionsMenu.length<2) {
      this.optionsAlways=this.optionsAlways.concat(this.optionsMenu);
      this.optionsMenu=[];
    }
  }

  public getNumberOptions() {
    if(window.innerWidth<UIConstants.MOBILE_WIDTH) {
      return this.numberOfAlwaysVisibleOptionsMobile;
    }
    return this.numberOfAlwaysVisibleOptions;
  }
  constructor(private ui : UIService, private translate : TranslateService) {

  }
  private click(option : OptionItem) {
    if(!option.isEnabled) {
      if(option.disabledCallback) {
          option.disabledCallback();
      }
      return;
    }
    option.callback();
  }
  private getActionOptions(options: OptionItem[]) {
    const result:OptionItem[]=[];
    for(const option of options) {
      if(option.showAsAction)
        result.push(option);
    }
    return result;
  }

  private hideActionOptions(options: OptionItem[], optionsAlways: OptionItem[]) {
    const result:OptionItem[]=[];
    for(const option of options) {
      if(optionsAlways.indexOf(option)==-1)
        result.push(option);
    }
    return result;
  }

    private filterDisabled(options: OptionItem[]) {
      if(options==null)
          return null;
      const filtered=[];
      for(const option of options) {
          if(option.isEnabled || this.showDisabled)
              filtered.push(option);
      }
      return filtered;
    }

    canShowDropdown() {
        if (!this.optionsMenu.length) {
          return false;
        }
        return this.optionsMenu.filter((o) =>
          o.isEnabled).length > 0;
    }
}
