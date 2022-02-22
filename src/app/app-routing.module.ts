import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { BioPageComponent } from "./bio-page/bio-page.component";
import { NotFoundPageComponent } from "./nav/not-found-page/not-found-page.component";
import { HEADER_HEIGHT } from "./general/styling-consts";
import { ContactPageComponent } from "./contact/contact-page/contact-page.component";
import { ProjectsPageComponent } from "./projects-page/projects-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "bio", component: BioPageComponent },
  { path: "projects", component: ProjectsPageComponent },
  { path: "contact", component: ContactPageComponent },
  { path: "**", component: NotFoundPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      scrollOffset: () => [0, HEADER_HEIGHT],
      relativeLinkResolution: "legacy",
      initialNavigation: "enabledBlocking",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
