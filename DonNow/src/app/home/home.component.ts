import { Component, OnInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(15px)' })),
      transition(':enter', [
        animate('0.5s', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  userId: string | null = '2';  // Default user ID for static use

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Check if we are running in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Safely access localStorage only in the browser
      if (!localStorage.getItem('user_id')) {
        // If no user_id exists, store the static/default user_id
        localStorage.setItem('user_id', this.userId!);
      }

      // Retrieve the user ID from localStorage
      this.userId = localStorage.getItem('user_id');
      console.log('User ID:', this.userId);
    } else {
      console.log('Running on the server, localStorage is not available.');
    }
  }
}
