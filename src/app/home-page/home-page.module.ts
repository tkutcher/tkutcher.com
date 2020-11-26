import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page.component';
import { WelcomeBlurbComponent } from './welcome-blurb/welcome-blurb.component';
import { SoftwareProjectsOverviewComponent } from './software-projects-overview/software-projects-overview.component';
import { CommonModule } from '@angular/common';
import { AppNavModule } from '../nav/nav.module';
import { AnimateModule } from '@wizdm/animate';
import { AthleticsOverviewComponent } from './athletics-overview/athletics-overview.component';
import { AppRoutingModule } from '../app-routing.module';
import { AppContactModule } from '../contact/contact.module';

@NgModule({
  declarations: [
    HomePageComponent,
    WelcomeBlurbComponent,
    SoftwareProjectsOverviewComponent,
    AthleticsOverviewComponent
  ],
  exports: [
    SoftwareProjectsOverviewComponent
  ],
  imports: [
    CommonModule,
    AppNavModule,
    AnimateModule,
    AppRoutingModule,
    AppContactModule
  ]
})
export class AppHomePageModule { }
