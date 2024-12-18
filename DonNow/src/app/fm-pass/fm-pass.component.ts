import { Component } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-fm-pass',
  templateUrl: './fm-pass.component.html',
  styleUrl: './fm-pass.component.css'
})
export class FMPassComponent {
  currentStep: number = 1;
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Error tracking
  emailError: boolean = false;
  codeError: boolean = false;
  passwordError: boolean = false;

  // Simulate verification data
  private mockCode: string = '123456'; // Simulated verification code

  constructor(private http: HttpClient,private router: Router) {}
  private apiUrl = 'http://localhost:8081/api/users/email'; // Remplacez par votre URL backend

  existEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.post<boolean>(this.apiUrl, null, { params });
  }
  private apiUrl2 = 'http://localhost:8081/api/users/verify-reset-code'; // Remplacez par votre URL backend

  verifyResetCode(email: string, code: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, code };

    return this.http.post<boolean>(this.apiUrl2, body, { headers });
  }

  sendResetCode() {
    const body = { email: this.email };

    this.http.post<any>('http://localhost:8081/api/users/forgot-password', body).subscribe({
      next: (response) => {
        if (response.success) {

        } else {
          alert("le message pas envoiyer a ce email ")
        }
      },
      error: (err) => {
        console.error('Erreur:', err);

      },
    });
  }

  goToStep(step: number) {
    // Validate step 1: Email
    if (step === 2) {
      if (!this.validateEmail(this.email)) {
        this.emailError = true;
        return;
      }

  if(step ===2 ){

    this.existEmail(this.email).subscribe({
      next: (exists) => {
       if(exists=== false){

         this.emailError = true;
       }else {
         this.emailError = false;

         this.currentStep = step;
        this.sendResetCode();

       }
      },
      error: (err) => {
        console.error('Error checking email:', err);
        alert("il exist erreur dans backend ")
      }
    });
    return;
  }
      this.emailError = false;

      console.log('Verification code sent to:', this.email);
    }

    // Validate step 2: Code verification
    if (step === 3) {


      this.verifyResetCode(this.email, this.verificationCode).subscribe({
        next: (result) => {
         if(result===true){

           this.codeError = false;
           this.currentStep = step;



         }else {
           this.codeError = true;

         }
        },
        error: (error) => {
          console.error('Erreur lors de la vérification du code', error);
        },
      });
    }


  }

  onSubmit() {
    // Validate passwords
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = true;
      return;
    }
    this.passwordError = false;

    this.http.post<any>(
      'http://localhost:8081/api/users/reset-password', // URL du backend
      { email: this.email, newPassword: this.newPassword }, // Corps directement passé
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) } // Headers
    ).subscribe({
      next: (response) => {
        console.log('Réponse :', response.message);
        alert('Votre mot de passe a été réinitialisé avec succès !');

        this.router.navigate(['/Login']);

      },
      error: (error) => {
        console.error('Erreur :', error);
      },
    });

  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }




}
