import { AfterViewInit, Component, OnInit } from '@angular/core';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-welcome-blurb',
  templateUrl: './welcome-blurb.component.html',
  styleUrls: ['./welcome-blurb.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-8px)'}),
          stagger(300, [
            animate('400ms 1700ms',
              style({ opacity: 1, transform: 'translateY(0px)'}))
          ])
        ])
      ])
    ])
  ]
})
export class WelcomeBlurbComponent implements OnInit, AfterViewInit {
  isLoaded = false;

  welcomeParagraphs = [
    '<b>Welcome</b>',
    'My name is Tim Kutcher.',
    'I\'m a software engineer from Maryland, high school baseball & volleyball coach, and former college athlete.',
    'Ravens & Bohs & Crabs & O\'s.',
    'My passions are sports, leadership, family & friends, beautiful code, and beautiful code' +
    ' that writes beautiful code.'
  ];

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  ngAfterViewInit(): void {
  }

}
