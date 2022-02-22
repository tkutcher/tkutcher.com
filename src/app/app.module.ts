import { ErrorHandler, inject, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppRoutingModule } from "./app-routing.module";
import { AppNavModule } from "./nav/nav.module";
import { AppHomePageModule } from "./home-page/home-page.module";
import { HttpClientModule } from "@angular/common/http";
import { GithubApiService } from "./general/services/github-api/github-api.service";
import { ProjectsPageComponent } from "./projects-page/projects-page.component";
import { AppBioPageModule } from "./bio-page/bio-page.module";
import { DOCUMENT, ViewportScroller } from "@angular/common";
import { CustomViewportScroller } from "./general/custom-viewport-scroller";
import { AnimateModule } from "@wizdm/animate";
import { AppContactModule } from "./contact/contact.module";

@NgModule({
  declarations: [AppComponent, ProjectsPageComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
    AppNavModule,
    AppHomePageModule,
    AppBioPageModule,
    AppContactModule,
    AnimateModule,
  ],
  providers: [
    HttpClientModule,
    GithubApiService,
    {
      provide: ViewportScroller,
      useFactory: () =>
        new CustomViewportScroller(
          "parallax-wrap",
          inject(DOCUMENT),
          window,
          inject(ErrorHandler)
        ),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
