import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
//import { TechnologyModule } from './technology/technology.module';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule.forRoot(),
    RouterModule.forRoot(routes)//,
    //TechnologyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
