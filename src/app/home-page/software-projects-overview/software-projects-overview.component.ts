import { Component, OnInit } from "@angular/core";
import { GithubApiService } from "../../general/services/github-api/github-api.service";
import { GitlabApiService } from "../../general/services/gitlab-api/gitlab-api.service";

@Component({
  selector: "app-software-projects-overview",
  templateUrl: "./software-projects-overview.component.html",
  styleUrls: ["./software-projects-overview.component.scss"],
})
export class SoftwareProjectsOverviewComponent implements OnInit {
  jgradeForks: string | number = "";
  jgradeWatchers: string | number = "";

  quickbaseClientForks: string | number = "";
  quickbaseClientWatchers: string | number = "";

  tkutcherWatchers: string | number = "";

  constructor(private github: GithubApiService, private gitlab: GitlabApiService) {}

  ngOnInit(): void {
    this.github.getRepoInfo("jgrade").subscribe((r) => {
      // @ts-ignore
      this.jgradeForks = r["forks"];
      // @ts-ignore
      this.jgradeWatchers = r["stargazers_count"];
    });

    this.github.getRepoInfo("quickbase-client").subscribe((r) => {
      // @ts-ignore
      this.quickbaseClientForks = r["forks"];
      // @ts-ignore
      this.quickbaseClientWatchers = r["stargazers_count"];
    });

    this.github.getRepoInfo("tkutcher").subscribe((r) => {
      // @ts-ignore
      this.tkutcherWatchers = r["stargazers_count"];
    });
  }
}
