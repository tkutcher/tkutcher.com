import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BioPageComponent } from './bio-page.component';
import { AppNavModule } from '../nav/nav.module';



@NgModule({
  declarations: [BioPageComponent],
  imports: [
    CommonModule,
    AppNavModule
  ]
})
export class AppBioPageModule { }
