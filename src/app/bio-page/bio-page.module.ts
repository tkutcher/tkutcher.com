import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BioPageComponent } from './bio-page.component';
import { AppNavModule } from '../nav/nav.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [BioPageComponent],
  imports: [
    CommonModule,
    AppNavModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AppBioPageModule { }
