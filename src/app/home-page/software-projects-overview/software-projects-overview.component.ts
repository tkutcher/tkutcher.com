import { Component, OnInit } from '@angular/core';
import { GithubApiService } from '../../general/services/github-api/github-api.service';
import { GitlabApiService } from '../../general/services/gitlab-api/gitlab-api.service';


@Component({
  selector: 'app-software-projects-overview',
  templateUrl: './software-projects-overview.component.html',
  styleUrls: ['./software-projects-overview.component.scss']
})
export class SoftwareProjectsOverviewComponent implements OnInit {

  jgradeForks;
  jgradeWatchers;

  quickbaseClientForks;
  quickbaseClientWatchers;

  tkutcherWatchers;

  constructor(
    private github: GithubApiService,
    private gitlab: GitlabApiService,
  ) { }

  ngOnInit(): void {
    this.github.getRepoInfo('jgrade').subscribe((r) => {
      this.jgradeForks = r['forks'];
      this.jgradeWatchers = r['stargazers_count'];
    });

    this.github.getRepoInfo('quickbase-client').subscribe((r) => {
      this.quickbaseClientForks = r['forks'];
      this.quickbaseClientWatchers = r['stargazers_count'];
    });

    this.github.getRepoInfo('tkutcher').subscribe((r) => {
      this.tkutcherWatchers = r['stargazers_count'];
    });

  }

}
