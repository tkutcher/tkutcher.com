import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CmdPromptComponent } from "./cmd-prompt.component";

describe("CmdPromptComponent", () => {
  let component: CmdPromptComponent;
  let fixture: ComponentFixture<CmdPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmdPromptComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
