import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit {
  constructor(private http: HttpClient,private route: ActivatedRoute) {
  }

  iduser :any;
  userData :any ;
  compagnes : any;
  getid(){
    this.route.paramMap.subscribe(params => {
      this.iduser = Number(params.get('id')); // Get the 'id' parameter from the route
    });
  }

  ngOnInit(){


    this.getid()

    this.getUserInfo(this.iduser);

  }

  getUserInfo(userId: number): void {
    this.http.get(`http://localhost:8081/api/users/${userId}`).subscribe(
      (response: any) => {
        this.userData = response;
        console.log('Informations utilisateur :', this.userData);
        this.getCompagnesByAuteur(this.userData.id);

      },
      (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    );
  }
  getCompagnesByAuteur(idAuteur: number): void {
    const url = `http://localhost:8081/api/compagnes/by-auteur/${idAuteur}`;
    this.http.get(url).subscribe(
      (response: any) => {
        console.log('Données des campagnes :', response);
        this.compagnes = response; // Stocker les données reçues


      },
      (error) => {
        console.error('Erreur lors de la récupération des campagnes :', error);
        alert('Impossible de récupérer les campagnes.');
      }
    );
  }

}
