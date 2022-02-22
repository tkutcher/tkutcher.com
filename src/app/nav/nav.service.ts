import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from "@angular/router";
import { CmdPromptService } from "./cmd-prompt/cmd-prompt.service";
import { isPlatformBrowser } from "@angular/common";
import { SeoService } from "../general/services/seo/seo.service";

@Injectable({
  providedIn: "root",
})
export class NavService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cmdPromptService: CmdPromptService,
    private seo: SeoService
  ) {
    // @ts-ignore  FIXME
    this.router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        this.seo.updateTitleForNewRoute(e.url);
        this.cmdPromptService.setPath("~" + (e.url === "/" ? "" : e.url));
        this.cmdPromptService.clearPrompt();
      }
    });
  }
}
