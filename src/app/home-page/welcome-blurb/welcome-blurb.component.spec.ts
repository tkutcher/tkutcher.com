import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeBlurbComponent } from './welcome-blurb.component';

describe('WelcomeBlurbComponent', () => {
  let component: WelcomeBlurbComponent;
  let fixture: ComponentFixture<WelcomeBlurbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeBlurbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeBlurbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
