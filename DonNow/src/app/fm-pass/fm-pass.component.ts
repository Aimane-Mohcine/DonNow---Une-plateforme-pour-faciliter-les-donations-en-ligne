import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-fm-pass',
  templateUrl: './fm-pass.component.html',
  styleUrl: './fm-pass.component.css'
})
export class FMPassComponent {
  currentStep: number = 1;
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Error tracking
  emailError: boolean = false;
  codeError: boolean = false;
  passwordError: boolean = false;

  // Simulate verification data
  private mockCode: string = '123456'; // Simulated verification code

  goToStep(step: number) {
    // Validate step 1: Email
    if (step === 2) {
      if (!this.validateEmail(this.email)) {
        this.emailError = true;
        return;
      }
      this.emailError = false;
      console.log('Verification code sent to:', this.email);
    }

    // Validate step 2: Code verification
    if (step === 3) {
      if (this.verificationCode !== this.mockCode) {
        this.codeError = true;
        return;
      }
      this.codeError = false;
      console.log('Code verified:', this.verificationCode);
    }

    this.currentStep = step;
  }

  onSubmit() {
    // Validate passwords
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = true;
      return;
    }
    this.passwordError = false;

    // Simulate password reset success
    console.log('Password reset successfully:', this.newPassword);
    alert('Votre mot de passe a été réinitialisé avec succès !');
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
