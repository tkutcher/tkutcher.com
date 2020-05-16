import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppNavModule } from './nav/nav.module';
import { AppHomePageModule } from './home-page/home-page.module';
import { HttpClientModule } from '@angular/common/http';
import { GithubApiService } from './general/services/github-api/github-api.service';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { AppBioPageModule } from './bio-page/bio-page.module';


@NgModule({
  declarations: [
    AppComponent,
    ContactPageComponent,
    ProjectsPageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
    AppNavModule,
    AppHomePageModule,
    AppBioPageModule,
  ],
  providers: [
    HttpClientModule,
    GithubApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
