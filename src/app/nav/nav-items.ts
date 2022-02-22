export interface INavItem {
  display: string;
  routerLink?: string;
  href?: string;
}

export interface IProfileLink {
  name: string;
  faName: string;
  handle: string;
  link: string;
}

export const navItems: INavItem[] = [
  { display: "home", routerLink: "/" },
  { display: "bio", routerLink: "/bio" },
  { display: "projects", routerLink: "/projects" },
  { display: "contact", routerLink: "/contact" },
  {display: "blog", href: "https://medium.com/@tkutcher"}
];

export const profileLinks: IProfileLink[] = [
  {
    name: "linkedin",
    faName: "fab fa-linkedin",
    handle: "Tim Kutcher",
    link: "https://www.linkedin.com/in/tim-kutcher-a7831416a/",
  },
  {
    name: "medium",
    faName: "fab fa-medium",
    handle: "tkutcher",
    link: "https://medium.com/@tkutcher",
  },
  {
    name: "facebook",
    faName: "fab fa-facebook",
    handle: "Tim Kutcher",
    link: "https://www.facebook.com/tim.kutcher.3",
  },
  {
    name: "instagram",
    faName: "fab fa-instagram",
    handle: "@tkutcher_",
    link: "https://www.instagram.com/tkutcher_/",
  },
  {
    name: "twitter",
    faName: "fab fa-twitter",
    handle: "@tkutcher_",
    link: "https://twitter.com/tkutcher_",
  },
  {
    name: "youtube",
    faName: "fab fa-youtube",
    handle: "tkutcher",
    link: "https://www.youtube.com/channel/UCHq9PYerV7OnYbJw5EHKQlA",
  },
  {
    name: "github",
    faName: "fab fa-github",
    handle: "@tkutcher",
    link: "https://github.com/tkutcher",
  },
  {
    name: "gitlab",
    faName: "fab fa-gitlab",
    handle: "@tkutcher",
    link: "https://gitlab.com/tkutcher",
  },
  {
    name: "stack-overflow",
    faName: "fab fa-stack-overflow",
    handle: "@tplusk",
    link: "https://stackoverflow.com/users/9970629/tplusk",
  },
];
