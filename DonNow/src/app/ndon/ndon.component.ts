import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ndon',
  templateUrl: './ndon.component.html',
  styleUrl: './ndon.component.css'
})
export class NdonComponent implements OnInit {
  @Input() userId!: number;  // Accept the userId as input


  constructor(private http: HttpClient,private route: ActivatedRoute) {
  }
  compagnes :any;
  id:any;
  ngOnInit(): void {
    console.log(`Dashboard for user: ${this.userId}`);
    // Récupérez l'ID de l'URL
    this.id = this.route.snapshot.paramMap.get('id');
    this.getCompagnesByAuteur(this.id);
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
