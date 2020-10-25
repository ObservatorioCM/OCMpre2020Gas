import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'ag-grid-enterprise';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';

import { HeaderComponent } from './header-component/header.component';
import { HeaderGroupComponent } from './header-group-component/header-group.component';
import { HeaderOCMComponent } from './header-ocm/header-ocm.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HeaderGroupComponent,
    HeaderOCMComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([
      HeaderComponent,
      HeaderGroupComponent
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
