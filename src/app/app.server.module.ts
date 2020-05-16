import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    FlexLayoutServerModule,
    AppModule,
    ServerModule,
    NoopAnimationsModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
