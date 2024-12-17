import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:8081/api/users/login', credentials).subscribe(
      (response: any) => {
        // Récupérer l'id et afficher un message de succès
        const userId = response.id;
        this.router.navigate(['/Profiles/'+userId]); // Redirigez après la connexion réussie

      },
      (error) => {
        console.error("Erreur renvoyée par le backend :", error);
        if (error.status === 404) {
          this.errorMessage = 'Email introuvable.';
          alert("Email introuvable");
        } else if (error.status === 401) {
          this.errorMessage = 'Mot de passe incorrect.';
          alert("Mot de passe incorrect.");
        } else {
          this.errorMessage = `Une erreur est survenue : ${error.message}`;
          alert(`Erreur : ${error.message}`);
        }
      }
    );
  }


}
