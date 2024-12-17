import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DonateComponent} from "./donate/donate.component";
import {HomeComponent} from "./home/home.component";
import {DonationsComponent} from "./donations/donations.component";
import {InscriptionComponent} from "./inscription/inscription.component";
import {LoginComponent} from "./login/login.component";
import {NdonComponent} from "./ndon/ndon.component";
import {ProfileComponent} from "./profile/profile.component";
import {ProfileHomeComponent} from "./profile-home/profile-home.component";
import {TransactionComponent} from "./transaction/transaction.component";
import {FMPassComponent} from "./fm-pass/fm-pass.component";

const routes: Routes = [
  { path: 'Dashboard/:id',title:'Dashboard', component: DashboardComponent },
  { path: 'Donate/:Sub',title:'Donate', component: DonateComponent },
  { path: 'Donate/:Sub/:id',title:'Donate', component: DonateComponent },

  { path: '',title:'DonNow', component: HomeComponent },
  { path: 'Donations',title:'Donations', component: DonationsComponent },
  { path: 'Inscription',title:'Inscription', component: InscriptionComponent },
  { path: 'Login',title:'Login', component: LoginComponent },
  { path: 'Ndon/:id',title:'Ndon', component: NdonComponent },
  { path: 'Profile/:id',title:'Profile', component: ProfileComponent },
  { path: 'Profiles/:id',title:'Profile Home', component: ProfileHomeComponent },
  { path: 'Add',title:'Profile Home', component: TransactionComponent },
  { path: 'FMP',title:'Profile Home', component: FMPassComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
