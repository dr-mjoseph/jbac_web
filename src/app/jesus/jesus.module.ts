import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JesusRoutingModule } from './jesus-routing.module';
import { AboutComponent } from './about/about.component';
import { EventsComponent } from './events/events.component';
import { ServicesComponent } from './services/services.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CollegesComponent } from './colleges/colleges.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { ChurchTimingsComponent } from './church-timings/church-timings.component';
import { AttacksComponent } from './attacks/attacks.component';
import { MarriagesComponent } from './marriages/marriages.component';
import { JobsComponent } from './jobs/jobs.component';
import { BusinessComponent } from './business/business.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContactusComponent } from './contactus/contactus.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SubgalleryComponent } from './subgallery/subgallery.component';
import { InstituteComponent } from './institute/institute.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeadersComponent } from './leaders/leaders.component';
import { UpdateComponent } from './update/update.component';
import { HelpComponent } from './help/help.component';
import { NewsComponent } from './news/news.component';
import { OurhelpComponent } from './ourhelp/ourhelp.component';
import { VideospageComponent } from './videospage/videospage.component';


import { SearchPipePipe } from './signup/search-pipe.pipe';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { SubnewsComponent } from './subnews/subnews.component';
import { SubvideoComponent } from './subvideo/subvideo.component';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { WingsComponent } from './wings/wings.component';
import { OrganizationComponent } from './organization/organization.component';
import { WebhelpComponent } from './webhelp/webhelp.component';
import { ChurchPastorSearchComponent } from './church-pastor-search/church-pastor-search.component';
import { BelieverregisterComponent } from './believerregister/believerregister.component';
import { StudentregisterComponent } from './studentregister/studentregister.component';
import { MinistryregisterComponent } from './ministryregister/ministryregister.component';
import { PastorregisterComponent } from './pastorregister/pastorregister.component';
import { ChurchregisterComponent } from './churchregister/churchregister.component';
import { OrganisationregisterComponent } from './organisationregister/organisationregister.component';
import { PastorassociationregisterComponent } from './pastorassociationregister/pastorassociationregister.component';
import { HomeComponent } from './home/home.component';
import { AddchurchtimingsComponent } from './addchurchtimings/addchurchtimings.component';
import { AddinstituteComponent } from './addinstitute/addinstitute.component';
import { AddmeetingsComponent } from './addmeetings/addmeetings.component';
import { AddbusinessComponent } from './addbusiness/addbusiness.component';
import { AddmarriagesComponent } from './addmarriages/addmarriages.component';
import { AddattacksComponent } from './addattacks/addattacks.component';
import { AddjobsComponent } from './addjobs/addjobs.component';
import { AddadsComponent } from './addads/addads.component';
import { TechsolComponent } from './techsol/techsol.component';
import { SuppRegComponent } from './supp-reg/supp-reg.component';
import { SurveyNewsComponent } from './survey-news/survey-news.component';
import { NewspageComponent } from './newspage/newspage.component';
import { JosephviewComponent } from './josephview/josephview.component';
import { InjusticeComponent } from './injustice/injustice.component';
import { MeetingComponent } from './meeting/meeting.component';
import { ChurchgoComponent } from './churchgo/churchgo.component';
import { ApchristianpoliticsComponent } from './apchristianpolitics/apchristianpolitics.component';
import { ChristianattackvideoComponent } from './christianattackvideo/christianattackvideo.component';
import { EntryComponent } from './entry/entry.component';
import { Ap1croreBelieversComponent } from './ap1crore-believers/ap1crore-believers.component';
import { WorkComponent } from './work/work.component';
import { NamoduComponent } from './namodu/namodu.component';
import { WishComponent } from './wish/wish.component';




@NgModule({
  declarations: [
    AboutComponent,
    EventsComponent,
    ServicesComponent,
    GalleryComponent,
    CollegesComponent,
    ProfileComponent,
    LoginComponent,
    ChurchTimingsComponent,
    AttacksComponent,
    MarriagesComponent,
    JobsComponent,
    BusinessComponent,
    SignupComponent,
    ContactusComponent,
    SubgalleryComponent,
    InstituteComponent,
    DownloadsComponent,
    LeadersComponent,
    UpdateComponent,
    HelpComponent,
    NewsComponent,
    OurhelpComponent,
    VideospageComponent,
    SearchPipePipe,
    SubnewsComponent,
    SubvideoComponent,
    PaymentgatewayComponent,
    WingsComponent,
    OrganizationComponent,
    WebhelpComponent,
    ChurchPastorSearchComponent,
    BelieverregisterComponent,
    StudentregisterComponent,
    MinistryregisterComponent,
    PastorregisterComponent,
    ChurchregisterComponent,
    OrganisationregisterComponent,
    PastorassociationregisterComponent,
    HomeComponent,
    AddchurchtimingsComponent,
    AddinstituteComponent,
    AddmeetingsComponent,
    AddbusinessComponent,
    AddmarriagesComponent,
    AddattacksComponent,
    AddjobsComponent,
    AddadsComponent,
    TechsolComponent,
    SuppRegComponent,
    SurveyNewsComponent,
    NewspageComponent,
    JosephviewComponent,
    InjusticeComponent,
    MeetingComponent,
  ChurchgoComponent,
  ApchristianpoliticsComponent,
  ChristianattackvideoComponent,
  EntryComponent,
  Ap1croreBelieversComponent,
  WorkComponent,
  NamoduComponent,
  WishComponent,
    
    
  ],
  imports: [
    CommonModule,
    JesusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    HttpClientModule,
    NgSelectModule,
    NgxPaginationModule,
    SelectDropDownModule,
    
  ]
})
export class JesusModule { }
