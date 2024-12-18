import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule

import { AppRoutingModule } from './app-routing.module';
import {NgForOf} from "@angular/common";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DonationsComponent } from './donations/donations.component';
import { LoginComponent } from './login/login.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NdonComponent } from './ndon/ndon.component';
import { DonateComponent } from './donate/donate.component';
import {provideHttpClient} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import { ProfileHomeComponent } from './profile-home/profile-home.component';
import { TransactionComponent } from './transaction/transaction.component';
import { FMPassComponent } from './fm-pass/fm-pass.component';
import { ErreurComponent } from './erreur/erreur.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DonationsComponent,
    LoginComponent,
    InscriptionComponent,
    ProfileComponent,
    DashboardComponent,
    NdonComponent,
    DonateComponent,
    ProfileHomeComponent,
    TransactionComponent,
    FMPassComponent,
    ErreurComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Add it here
    AppRoutingModule,
    NgForOf,
    FormsModule,

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
