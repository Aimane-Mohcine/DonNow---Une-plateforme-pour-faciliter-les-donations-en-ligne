import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {


  constructor(private http: HttpClient,private router: Router) { }
  // Étape actuelle du formulaire
  currentStep: number = 1;

  // Indicateur pour afficher un message d'erreur si les mots de passe ne correspondent pas
  passwordError: boolean = false;

  // Données du formulaire
  formData = {
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    file: null,
    address: '',
    paypal: '',
    description: '',
    terms: false
  };
  isDisabled: boolean = false; // Le bouton est activé par défaut

  selectedFile: File | null = null;

  // Handle file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Passe à l'étape suivante
  nextStep() {
    if (this.currentStep === 1) {
      // Vérifie si le mot de passe et la confirmation correspondent
      if (this.formData.password !== this.formData.confirmPassword) {
        this.passwordError = true; // Affiche le message d'erreur
        return;
      } else {
        this.passwordError = false; // Réinitialise l'erreur
        this.currentStep = 2; // Passe à l'étape suivante
      }
    }
  }

  // Retourne à l'étape précédente
  preStep() {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  onSubmit() {
    if (this.formData.terms) {
      if (!this.selectedFile) {
        alert("Veuillez choisir une image.");
        return;
      }

      const formData = new FormData();

      // Ajouter chaque champ directement
      formData.append('nom', this.formData.nom);
      formData.append('prenom', this.formData.prenom);
      formData.append('cin', this.formData.cin);
      formData.append('email', this.formData.email);
      formData.append('telephone', this.formData.telephone);
      formData.append('password', this.formData.password);
      formData.append('dob', this.formData.dob);
      formData.append('address', this.formData.address);
      formData.append('paypal', this.formData.paypal);
      formData.append('description', this.formData.description);

      // Ajouter le fichier
      formData.append('file', this.selectedFile);

      console.log('Données envoyées au backend :');
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const url = 'http://localhost:8081/api/users/create'; // URL du back-end;

      this.isDisabled = true;

      this.http.post(url, formData).subscribe({
        next: (response) => {
          console.log('Utilisateur créé avec succès :', response);
          this.router.navigate(['/Login']); // Remplacez '/success' par votre chemin cible
        },
        error: (error) => {
          this.isDisabled = false ;

          console.error('Erreur complète du backend :', error);
          if (error.error) {
            alert('Erreur : ' + error.error);
          } else {
            alert('Une erreur est survenue. Veuillez réessayer.');
          }
        }
      });
    } else {
      alert('Vous devez accepter les conditions d’utilisation.');
    }
  }
}
