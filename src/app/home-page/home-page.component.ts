import { Component, OnInit } from '@angular/core';
import { CmdPromptService } from '../nav/cmd-prompt/cmd-prompt.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private cmdPromptService: CmdPromptService
  ) { }

  ngOnInit(): void {

    this.cmdPromptService.writeToPrompt('sh welcome.sh', {
      duration: 1000, delayToClear: 500
    });
  }

}
