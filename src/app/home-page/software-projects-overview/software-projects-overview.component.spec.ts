import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareProjectsOverviewComponent } from './software-projects-overview.component';

describe('SoftwareProjectsOverviewComponent', () => {
  let component: SoftwareProjectsOverviewComponent;
  let fixture: ComponentFixture<SoftwareProjectsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareProjectsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareProjectsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
