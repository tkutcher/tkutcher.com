import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLinks } from './icon-links.component';

describe('IconLinksComponent', () => {
  let component: ProfileLinks;
  let fixture: ComponentFixture<ProfileLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLinks ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLinks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
