import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JesusModule } from './jesus/jesus.module';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgImageSliderModule } from "ng-image-slider";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { PrivacypolicyComponent } from './jesus/privacypolicy/privacypolicy.component';
import { TermsComponent } from './jesus/terms/terms.component';
//import { EntryComponent } from './jesus/entry/entry.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PrivacypolicyComponent,
    TermsComponent,
//EntryComponent,  
    
    
    

  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    JesusModule,
    NgbModule,
    FormsModule,
    NgImageSliderModule,
    SlickCarouselModule,
    NgxScrollTopModule,
    NgxPaginationModule,
   
  ],

  providers: [],
  bootstrap: [AppComponent],
  exports: [BrowserModule, CommonModule]


})
export class AppModule { }
