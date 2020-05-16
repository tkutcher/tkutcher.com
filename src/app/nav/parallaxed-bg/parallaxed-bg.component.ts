import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parallaxed-bg',
  templateUrl: './parallaxed-bg.component.html',
  styleUrls: ['./parallaxed-bg.component.scss']
})
export class ParallaxedBgComponent implements OnInit {

  /* The source of the background image. */
  @Input() imgSrc: string;

  /* The color to use for content beyond the bottom. */
  @Input() bgExtendedColor: string;

  constructor() { }

  ngOnInit(): void {
  }

}
