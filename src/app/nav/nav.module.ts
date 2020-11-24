import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CmdPromptComponent } from './cmd-prompt/cmd-prompt.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ProfileLinks } from './profile-links/profile-links';
import { FooterComponent } from './footer/footer.component';
import { ParallaxedBgComponent } from './parallaxed-bg/parallaxed-bg.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CmdPromptPathTruncatePipe } from './cmd-prompt/cmd-prompt-path-truncate.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    CmdPromptComponent,
    NotFoundPageComponent,
    ProfileLinks,
    FooterComponent,
    ParallaxedBgComponent,
    CmdPromptPathTruncatePipe
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ProfileLinks,
    ParallaxedBgComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class AppNavModule { }
