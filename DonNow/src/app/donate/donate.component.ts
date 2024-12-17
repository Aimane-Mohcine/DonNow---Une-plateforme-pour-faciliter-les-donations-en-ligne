import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css'
})
export class DonateComponent implements OnInit {
  constructor( private http: HttpClient,
               private route: ActivatedRoute,
               private router: Router) {
  }
  donated: number = 150; // Example value
  goal: number = 250; // Example value
  donationPercentage: number = (this.donated / this.goal) * 100;
  iduser : number = 0;
  link = "http://localhost:4200/Donate/";

  donate() {
    // Implement your donation logic here
    console.log("Donation initiated!");
  }

  copyLink() {
    // Replace with actual donation link
    let link = this.link + this.compagneData.slug;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  }
  finalDate: Date = new Date('2024-12-31T23:59:59');

  getid(){
    this.route.paramMap.subscribe(params => {
      this.iduser = Number(params.get('id')); // Get the 'id' parameter from the route
    });
  }

Sub :any;
  compagneData: any = {}; // Pour regrouper les données
  userData : any ={}
  isPopupVisible:any;
  popupMessage:any;
  ngOnInit(): void {
    this.getid()

    this.Sub = this.route.snapshot.paramMap.get('Sub');
    if (this.Sub) {
      this.getdata();
    }

    // Vérification de l'URL pour détecter '/0' ou '/1'
    this.route.url
      .pipe(
        map((segments) => segments.map((s) => s.path).join('/')) // Conversion des segments en chaîne
      )
      .subscribe((urlPath) => {
        if (urlPath.includes('/0')) {
          this.showPopup('Donation unsuccessful. Please try again.', true);
        } else if (urlPath.includes('/1')) {
          this.showPopup('Donation successful! Thank you for your support.', false);
        } else {
          this.isPopupVisible = false;
        }
      });


  }
  isError:any;

  // Méthode modifiée pour inclure le paramètre isError
  showPopup(message: string, isError: boolean): void {
    this.popupMessage = message;
    this.isError = isError;
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  getdata(): void {

      this.http.get(`http://localhost:8081/api/compagnes/${this.Sub}`).subscribe(
        (response: any) => {
          this.compagneData = response; // Regrouper les données dans un objet
          console.log('Données de la campagne :', this.compagneData);

          this.donated= this.compagneData.montant;
          this.goal = this.compagneData.montant_necessaire; // Example value
          this.donationPercentage = (this.donated / this.goal) * 100;
          this.iduser = this.compagneData.idAuteur;
          this.finalDate=this.compagneData.date_final;
          this.getUserInfo(this.iduser);

        },
        (error) => {
          console.error('Erreur lors de la récupération des données :', error);
        }
      );

  }
  getUserInfo(userId: number): void {
    this.http.get(`http://localhost:8081/api/users/${userId}`).subscribe(
      (response: any) => {
        this.userData = response;
        console.log('Informations utilisateur :', this.userData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    );
  }

  isButtonDisabled: boolean = true; // Initialement désactivé
  enableButton() {
    this.isButtonDisabled = false; // Permet d'activer le bouton
  }

  disableButton() {
    this.isButtonDisabled = true; // Permet de désactiver le bouton
  }

  amount :any;
  send:any;
  private apiUrl = 'http://localhost:8081/api/pay/create';
  isDisabled: boolean = false; // Le bouton est désactivé par défaut

  goPaypal(){

    this.isDisabled=true;
    this.send = new FormData();
  this.send.append("amount",this.amount);
  this.send.append("url",this.Sub);
  this.send.append("idUser",this.iduser)



    this.http.post(this.apiUrl, this.send).subscribe(
      (response: any) => {
        if (response.success) {
          window.location.href = response.redirectUrl; // Redirection vers PayPal
        } else {
          console.log('Error', response.message);
        }
      },
      (error) => {
        console.log('Error', 'An unexpected error occurred.');
        console.error(error);
        this.isDisabled=false;

      }
    );


}


}
