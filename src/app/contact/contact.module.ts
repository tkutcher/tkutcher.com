import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ContactGridComponent } from './contact-grid/contact-grid.component';
import { AppNavModule } from '../nav/nav.module';



@NgModule({
  declarations: [
    ContactPageComponent,
    ContactGridComponent
  ],
  exports: [
    ContactGridComponent
  ],
  imports: [
    CommonModule,
    AppNavModule
  ]
})
export class AppContactModule { }
