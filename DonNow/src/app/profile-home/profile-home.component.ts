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
    localStorage.removeItem('user');  // Clear user data from localStorage
    this.router.navigate(['/']); // Redirect to login page
  }
}
