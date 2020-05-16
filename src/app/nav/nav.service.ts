import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CmdPromptService } from './cmd-prompt/cmd-prompt.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cmdPromptService: CmdPromptService,
  ) {

    this.router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        this.cmdPromptService.setPath('~' + (e.url === '/' ? '' : e.url));
        this.cmdPromptService.clearPrompt();
      }
    });
  }
}
