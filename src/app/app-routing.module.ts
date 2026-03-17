import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { AboutComponent } from './jesus/about/about.component';
import { EventsComponent } from './jesus/events/events.component';
import { ServicesComponent } from './jesus/services/services.component';
import { GalleryComponent } from './jesus/gallery/gallery.component';
import { CollegesComponent } from './jesus/colleges/colleges.component';
import { ProfileComponent } from './jesus/profile/profile.component';
import { LoginComponent } from './jesus/login/login.component';
import { BusinessComponent } from './jesus/business/business.component';
import { ChurchTimingsComponent } from './jesus/church-timings/church-timings.component';
import { JobsComponent } from './jesus/jobs/jobs.component';
import { MarriagesComponent } from './jesus/marriages/marriages.component';
import { AttacksComponent } from './jesus/attacks/attacks.component';
import { ContactusComponent } from './jesus/contactus/contactus.component';
import { SignupComponent } from './jesus/signup/signup.component';
import { InstituteComponent } from './jesus/institute/institute.component';
import { SubgalleryComponent } from './jesus/subgallery/subgallery.component';
import { LeadersComponent } from './jesus/leaders/leaders.component';
import { UpdateComponent } from './jesus/update/update.component';
import { DownloadsComponent } from './jesus/downloads/downloads.component';
import { HelpComponent } from './jesus/help/help.component';
import { NewsComponent } from './jesus/news/news.component';

import { WishComponent } from './jesus/wish/wish.component';
import { OurhelpComponent } from './jesus/ourhelp/ourhelp.component';
import { VideospageComponent } from './jesus/videospage/videospage.component';
import { SubnewsComponent } from './jesus/subnews/subnews.component';
import { PrivacypolicyComponent } from './jesus/privacypolicy/privacypolicy.component';
import { TermsComponent } from './jesus/terms/terms.component';
import { WingsComponent } from './jesus/wings/wings.component';
import { OrganizationComponent } from './jesus/organization/organization.component';
import { WebhelpComponent } from './jesus/webhelp/webhelp.component';
import { ChurchPastorSearchComponent } from './jesus/church-pastor-search/church-pastor-search.component';
import { BelieverregisterComponent } from './jesus/believerregister/believerregister.component';
import { StudentregisterComponent } from './jesus/studentregister/studentregister.component';
import { MinistryregisterComponent } from './jesus/ministryregister/ministryregister.component';
import { PastorregisterComponent } from './jesus/pastorregister/pastorregister.component';
import { ChurchregisterComponent } from './jesus/churchregister/churchregister.component';
import { OrganisationregisterComponent } from './jesus/organisationregister/organisationregister.component';
import { PastorassociationregisterComponent } from './jesus/pastorassociationregister/pastorassociationregister.component';
import { AddadsComponent } from './jesus/addads/addads.component';
import { AddattacksComponent } from './jesus/addattacks/addattacks.component';
import { AddbusinessComponent } from './jesus/addbusiness/addbusiness.component';
import { AddchurchtimingsComponent } from './jesus/addchurchtimings/addchurchtimings.component';
import { AddinstituteComponent } from './jesus/addinstitute/addinstitute.component';
import { AddjobsComponent } from './jesus/addjobs/addjobs.component';
import { AddmarriagesComponent } from './jesus/addmarriages/addmarriages.component';
import { AddmeetingsComponent } from './jesus/addmeetings/addmeetings.component';
import { TechsolComponent } from './jesus/techsol/techsol.component';
import { SuppRegComponent } from './jesus/supp-reg/supp-reg.component';
import { SurveyNewsComponent } from './jesus/survey-news/survey-news.component';
import { NewspageComponent } from './jesus/newspage/newspage.component';
import { JosephviewComponent } from './jesus/josephview/josephview.component';
import { InjusticeComponent } from './jesus/injustice/injustice.component';
import { ChurchgoComponent } from './jesus/churchgo/churchgo.component';
import { ApchristianpoliticsComponent } from './jesus/apchristianpolitics/apchristianpolitics.component';
import { ChristianattackvideoComponent } from './jesus/christianattackvideo/christianattackvideo.component';
import { EntryComponent } from './jesus/entry/entry.component';
import { NamoduComponent } from './jesus/namodu/namodu.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'events', component: EventsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'colleges', component: CollegesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'attacks', component: AttacksComponent },
  { path: 'injustice', component: InjusticeComponent },
    { path: 'marriages', component: MarriagesComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'church_timings', component: ChurchTimingsComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'institute', component: InstituteComponent },
  { path: 'subgallery/:id', component: SubgalleryComponent },
 { path: 'supp-reg', component:SuppRegComponent },
  { path: 'leaders', component: LeadersComponent },
  { path: 'update', component: UpdateComponent },
  { path: 'downloads', component: DownloadsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'news', component: NewsComponent },
  { path: 'ourhelp', component: OurhelpComponent },
  { path: 'videospage', component: VideospageComponent },
  { path: 'attack', component: AttacksComponent },
  { path: 'subnews/:id', component: SubnewsComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'wings', component: WingsComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'webhelp', component: WebhelpComponent },
  { path: 'newspage', component: NewspageComponent },
 { path: 'josephview', component: JosephviewComponent },
  { path: 'techsol', component: TechsolComponent },
  { path: 'church-pastor-search', component: ChurchPastorSearchComponent },
  { path: 'believerregister', component: BelieverregisterComponent },
  { path: 'studentregister', component: StudentregisterComponent },
  { path: 'ministryregister', component: MinistryregisterComponent },
  { path: 'pastorregister', component: PastorregisterComponent },
  { path: 'churchregister', component: ChurchregisterComponent },
  { path: 'organisationregister', component: OrganisationregisterComponent },
  { path: 'pastorassociationregister', component: PastorassociationregisterComponent },
  { path: 'addads', component: AddadsComponent },
  { path: 'addattacks', component: AddattacksComponent },
  { path: 'addbusiness', component: AddbusinessComponent },
  { path: 'addchurchtimings', component: AddchurchtimingsComponent },
  { path: 'addinstitute', component: AddinstituteComponent },
  { path: 'addjobs', component: AddjobsComponent },
  { path: 'addmarriages', component: AddmarriagesComponent },
  { path: 'addmeetings', component: AddmeetingsComponent },
 { path: 'survey-news', component: SurveyNewsComponent },
  { path: 'churchgo', component: ChurchgoComponent },
  { path: 'apchristianpolitics', component: ApchristianpoliticsComponent },
  { path: 'christianattackvideo', component:ChristianattackvideoComponent },
  { path: 'entry', component: EntryComponent },
 { path: 'namodu', component: NamoduComponent  },
 { path: 'wish', component:WishComponent  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
