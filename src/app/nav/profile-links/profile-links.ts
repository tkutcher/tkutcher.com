import { Component, OnInit } from '@angular/core';
import { profileLinks } from '../nav-items';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-profile-links',
  templateUrl: './profile-links.component.html',
  styleUrls: ['./profile-links.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-8px)'}),
          stagger(100, [
            animate('300ms 4s',
              style({ opacity: 1, transform: 'translateX(0px)'}))
          ])
        ])
      ])
    ])
  ]
})
export class ProfileLinks implements OnInit {

  profileLinks_ = profileLinks;

  constructor() { }

  ngOnInit(): void {
  }

}
