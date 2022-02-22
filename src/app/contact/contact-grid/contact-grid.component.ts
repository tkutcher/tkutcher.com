import { Component, OnInit } from "@angular/core";
import { IProfileLink, profileLinks } from "../../nav/nav-items";

interface IContactBlock {
  faIcon: string;
  title: string;
  contents: IProfileLink[];
}

@Component({
  selector: "app-contact-grid",
  templateUrl: "./contact-grid.component.html",
  styleUrls: ["./contact-grid.component.scss"],
})
export class ContactGridComponent implements OnInit {
  readonly contactBlocks: IContactBlock[] = [
    {
      title: "Email",
      faIcon: "fas fa-envelope",
      contents: [
        {
          name: "personal",
          faName: "fas fa-smile",
          handle: "tim@tkutcher.com",
          link: "mailto:tim@tkutcher.com",
        },
        {
          name: "work",
          faName: "fas fa-building",
          handle: "tkutcher@dicorp.com",
          link: "mailto:tkutcher@dicorp.com",
        },
      ],
    },
    {
      title: "Code",
      faIcon: "fas fa-code",
      contents: [profileLinks[5], profileLinks[6], profileLinks[7]],
    },
    {
      title: "Social Media",
      faIcon: "fas fa-hashtag",
      contents: [profileLinks[0], profileLinks[1], profileLinks[2], profileLinks[3]],
    },
    {
      title: "Professional",
      faIcon: "fas fa-user-tie",
      contents: [
        profileLinks[0],
        {
          name: "work",
          faName: "fas fa-envelope",
          handle: "tkutcher@dicorp.com",
          link: "mailto:tkutcher@dicorp.com",
        },
        {
          name: "DICORP",
          faName: "fas fa-globe",
          handle: "DICORP, Inc.",
          link: "https://dicorp.com",
        },
        {
          name: "ZPD Solutions",
          faName: "fas fa-globe",
          handle: "ZPD Solutions",
          link: "https://zpdsolutions.com",
        },
      ],
    },
    {
      title: "Media",
      faIcon: "fas fa-icons",
      contents: [
        profileLinks[4],
        {
          name: "Spotify",
          faName: "fab fa-spotify",
          handle: "Tim Kutcher",
          link: "https://open.spotify.com/user/224qqcv3bwopg7srmr73b7duq",
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
