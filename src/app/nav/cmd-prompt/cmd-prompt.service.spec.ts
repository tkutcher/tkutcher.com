import { TestBed } from '@angular/core/testing';

import { CmdPromptService } from './cmd-prompt.service';

describe('CmdPromptService', () => {
  let service: CmdPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmdPromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
