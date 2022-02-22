import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ParallaxedBgComponent } from "./parallaxed-bg.component";

describe("ParallaxedBgComponent", () => {
  let component: ParallaxedBgComponent;
  let fixture: ComponentFixture<ParallaxedBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParallaxedBgComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallaxedBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
