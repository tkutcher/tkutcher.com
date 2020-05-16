import { Component, OnInit } from '@angular/core';
import { profileLinks } from '../nav/nav-items';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  readonly profileLinks_ = profileLinks;

  constructor() { }

  ngOnInit(): void {
  }

}
