
export interface INavItem {
  display: string;
  routerLink: string;
}


interface IProfileLink {
  name: string;
  faName: string;
  handle: string;
  link: string;
}


export const navItems: INavItem[] = [
  {display: 'home', routerLink: '/'},
  {display: 'bio', routerLink: '/bio'},
  {display: 'projects', routerLink: '/projects'},
  {display: 'contact', routerLink: '/contact'},
];


export const profileLinks: IProfileLink[] = [
    {
      name: 'linkedin',
      faName: 'fa-linkedin',
      handle: '',
      link: 'https://www.linkedin.com/in/tim-kutcher-a7831416a/'
    },
    {
      name: 'facebook',
      faName: 'fa-facebook',
      handle: '',
      link: 'https://www.facebook.com/tim.kutcher.3'
    },
    {
      name: 'instagram',
      faName: 'fa-instagram',
      handle: '@tkutcher_',
      link: 'https://www.instagram.com/tkutcher_/'
    },
    {
      name: 'twitter',
      faName: 'fa-twitter',
      handle: '@tkutcher_',
      link: 'https://twitter.com/tkutcher_'
    },
    {
      name: 'youtube',
      faName: 'fa-youtube',
      handle: '',
      link: 'https://www.youtube.com/channel/UCHq9PYerV7OnYbJw5EHKQlA'
    },
    {
      name: 'github',
      faName: 'fa-github',
      handle: '@tkutcher',
      link: 'https://github.com/tkutcher'
    },
    {
      name: 'gitlab',
      faName: 'fa-gitlab',
      handle: '@tkutcher',
      link: 'https://gitlab.com/tkutcher'
    },
    {
      name: 'stack-overflow',
      faName: 'fa-stack-overflow',
      handle: '@tplusk',
      link: 'https://stackoverflow.com/users/9970629/tplusk'
    },
  ];
