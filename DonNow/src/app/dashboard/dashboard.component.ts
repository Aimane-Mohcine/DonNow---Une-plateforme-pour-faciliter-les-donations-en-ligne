import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() userId!: number;  // Accept the userId as input
  aa: string | null = null;
  user: any = {}; // Contient les données récupérées
  pasword:any;
  pasword2:any;
  passwordError: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}


  ngOnInit(): void {
    console.log(`Dashboard for user: ${this.userId}`);


    // Récupérez l'ID de l'URL
    this.aa = this.route.snapshot.paramMap.get('id');


    // Requête GET pour récupérer les données utilisateur
    this.http.get(`http://localhost:8081/api/users/${this.aa}`).subscribe(
      (response) => {
        this.user = response; // Stocker les données utilisateur dans l'objet `user`
        console.log('Données utilisateur récupérées :', this.user); // Afficher dans la console
      },
      (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    );
  }


  Update() {
    if (this.pasword !== this.pasword2) {
      this.passwordError = true; // Affiche le message d'erreur

    } else {
      this.passwordError = false; // Affiche le message d'erreur


      const formData = new FormData();
      formData.append('nom', this.user.nom || '');
      formData.append('prenom', this.user.prenom || '');
      formData.append('cin', this.user.cin || '');
      formData.append('email', this.user.email || '');
      formData.append('telephone', this.user.telephone || '');
      formData.append('password', this.pasword || '');
      formData.append('dob', this.user.dateDeNaissance || '');
      formData.append('address', this.user.adresse || '');
      formData.append('paypal', this.user.paypal || '');
      formData.append('description', this.user.description || '');



      this.http.put(`http://localhost:8081/api/users/${this.user.id}`, formData).subscribe(
        (response: any) => {
          alert('Profil mis à jour avec succès !');
          console.log('Réponse du serveur :', response);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du profil :', error);
          alert('Une erreur est survenue lors de la mise à jour.');
        }
      );


    }
  }
}
