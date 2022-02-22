import { Component, OnDestroy, OnInit } from "@angular/core";
import { CmdPromptService } from "../cmd-prompt/cmd-prompt.service";
import { ActivatedRoute, UrlSegment } from "@angular/router";

@Component({
  selector: "app-not-found-page",
  templateUrl: "./not-found-page.component.html",
  styleUrls: ["./not-found-page.component.scss"],
})
export class NotFoundPageComponent implements OnInit, OnDestroy {
  url?: UrlSegment[];

  constructor(
    private cmdPromptService: CmdPromptService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.url = this.route.snapshot.url;
    this.cmdPromptService.setPath("~");
    this.cmdPromptService.setStatus({
      kind: "bad",
      name: "NOT_FOUND",
      code: 404,
    });
  }

  ngOnDestroy(): void {
    this.cmdPromptService.setStatus({
      kind: "ok",
      name: "OK",
      code: 200,
    });
  }
}
