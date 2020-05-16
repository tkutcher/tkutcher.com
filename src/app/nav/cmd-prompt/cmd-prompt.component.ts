import { Component, Input, OnInit } from '@angular/core';
import { CmdPromptService, IPromptStatus } from './cmd-prompt.service';


@Component({
  selector: 'app-cmd-prompt',
  templateUrl: './cmd-prompt.component.html',
  styleUrls: ['./cmd-prompt.component.scss']
})
export class CmdPromptComponent implements OnInit {

  promptText: string;
  promptPath: string;
  promptStatus: IPromptStatus = {kind: 'ok', name: 'OK', code: 200};

  constructor(
    private cmdPromptService: CmdPromptService
  ) { }

  ngOnInit(): void {
    this.cmdPromptService.textChange.subscribe(s => this.promptText = s);
    this.cmdPromptService.pathChange.subscribe(s => this.promptPath = s);
    this.cmdPromptService.statusChange.subscribe(s => this.promptStatus = s);
  }



}
