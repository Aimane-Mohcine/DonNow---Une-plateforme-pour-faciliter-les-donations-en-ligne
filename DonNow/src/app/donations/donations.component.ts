import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements  OnInit {
  constructor(private http: HttpClient,private route: ActivatedRoute) {
  }
  compagnes:any;
  tab:any;

  ngOnInit(){

    this.getCompagnes();
  }
  getCompagnes(): void {
    const url = `http://localhost:8081/api/compagnes/all`;
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
