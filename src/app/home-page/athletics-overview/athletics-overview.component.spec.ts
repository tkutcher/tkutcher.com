import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleticsOverviewComponent } from './athletics-overview.component';

describe('AthleticsOverviewComponent', () => {
  let component: AthleticsOverviewComponent;
  let fixture: ComponentFixture<AthleticsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AthleticsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleticsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
