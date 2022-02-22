import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

interface IPage {
  title: string;
  description: string;
  keywords?: string;
}

const baseKeywords = `
  Software, 
  Engineer,
  Software Engineer, 
  Baltimore, 
  App, 
  Developer, 
  Angular, 
  Python,
  Personal Website`;

const defaultIPage: IPage = {
  title:
    "tkutcher.com - Tim Kutcher's Personal Website | Software Engineer from Maryland",
  description: `
    This is the personal website for Tim Kutcher. I am a software engineer from 
    Maryland who specializes in full-stack web development (primarily in Python and Angular). 
    I am also a high school baseball & volleyball coach, and former college athlete.
    My passions are sports, leadership, friends and family, beautiful code, and beautiful 
    code that writes beautiful code.
  `,
  keywords: baseKeywords,
};

const pageRoutes: Record<string, IPage> = {
  "/": defaultIPage,
  "/contact": {
    title: "tkutcher.com | Contact Me",
    description: `
      Contact me on social media, through GitHub or GitLab, or via an email to
      discuss any ideas for something I might be able to help build.
    `,
    keywords: baseKeywords + ", Contact,",
  },
  "/projects": {
    title: "tkutcher.com | Projects",
    description: `
      Learn about some of the software projects I have worked on and see some of my
      work.
    `,
    keywords: baseKeywords + ", Contact,",
  },
  "/bio": {
    title: "tkutcher.com | Bio",
    description: `
      A history of some of the things I've done.
    `,
    keywords: baseKeywords + ", Biography,",
  },
};

const getIPage = (url: string) => {
  let p = url.split("#")[0].split("?")[0];
  let pathArray = p.split("/");

  while (pathArray.length > 0) {
    p = pathArray.join("/");
    p = p == "" ? "/" : p;
    if (pageRoutes.hasOwnProperty(p)) {
      return pageRoutes[p];
    }
    pathArray = pathArray.slice(0, -1);
  }
  return defaultIPage;
};

@Injectable({
  providedIn: "root",
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  updateTitleForNewRoute(url: string) {
    const pg = getIPage(url);
    this.title.setTitle(pg.title);
    this.meta.updateTag({ name: "description", content: pg.description });
    if (pg.keywords) {
      this.meta.updateTag({ name: "keywords", content: pg.keywords });
    }
  }
}
