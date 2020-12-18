import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { headerAppearanceAnimation, HeaderAppearanceState } from './header.animations';
import { INavItem, navItems } from '../nav-items';
import { CmdPromptService } from '../cmd-prompt/cmd-prompt.service';
import { NavService } from '../nav.service';
import { HEADER_HEIGHT } from '~/general/styling-consts';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [headerAppearanceAnimation]
})
export class HeaderComponent implements OnInit, OnDestroy {

  readonly HEADER_HEIGHT_ = HEADER_HEIGHT;

  readonly navItems_ = navItems;
  appearanceState: HeaderAppearanceState;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private navService: NavService,
    private cmdPromptService: CmdPromptService
  ) { }

  ngOnInit(): void {
    this.appearanceState = HeaderAppearanceState.Transparent;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.scroll, true);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scroll, true);
    }
  }

  scroll = (e: any): void => {
    if (e.target.scrollTop == 0) {
      this.appearanceState = HeaderAppearanceState.Transparent
    } else {
      this.appearanceState = HeaderAppearanceState.Floating
    }
  };

  onNavItemHover = (item: INavItem) => {
    this.cmdPromptService.writeToPrompt('cd ' + item.routerLink, {
      clearAfter: false
    });
  };

  onNavItemExit = () => {
    this.cmdPromptService.clearPrompt();
  }
}
