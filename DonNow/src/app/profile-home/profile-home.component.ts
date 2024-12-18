import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.css']
})
export class ProfileHomeComponent implements OnInit {
  activeTab: string = 'dashboard'; // Default active tab
  userId: any;
 aa:any;
  user:any;
  constructor(private router: Router, private route: ActivatedRoute,private http: HttpClient) {}

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('jwtToken');

    const id =this.userId
    if (token) {
      // Appeler le backend pour valider le token
      this.http.post("http://localhost:8081/api/users/validate-token", { token ,id}).subscribe({
        next: (response: any) => {
          if (!response.valid) {
            // Si le token est invalide ou expiré

            this.router.navigate(['/error']); // Rediriger vers la page d'erreur
          }
        },
        error: (err) => {
          console.error('Erreur lors de la validation du token :', err);

          this.router.navigate(['/error']); // Rediriger en cas d'erreur
        }
      });
    } else {
      // Si aucun token n'est trouvé, rediriger directement vers la page d'erreur
      this.router.navigate(['/error']);
    }





    // Requête GET pour récupérer les données utilisateur
    this.http.get(`http://localhost:8081/api/users/${this.userId}`).subscribe(
      (response) => {
        this.user = response; // Stocker les données utilisateur dans l'objet `user`
        console.log('Données utilisateur récupérées :', this.user); // Afficher dans la console
      },
      (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']); // Redirect to login page
  }
}
