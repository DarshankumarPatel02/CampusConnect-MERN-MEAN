import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errors: { username?: string; email?: string; password?: string; confirmPassword?: string } = {};
  emailError: string = '';
  registrationStatus: string = '';

  constructor(private router: Router) {}

  validateForm(): boolean {
    let isValid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!this.username) {
      this.errors.username = 'Please enter your username';
      isValid = false;
    } else {
      this.errors.username = '';
    }

    if (!this.email) {
      this.errors.email = 'Please enter your email';
      isValid = false;
    } else if (!emailRegex.test(this.email)) {
      this.errors.email = 'Please enter a valid email address';
      isValid = false;
    } else {
      this.errors.email = '';
    }

    if (!this.password) {
      this.errors.password = 'Please enter your password';
      isValid = false;
    } else if (this.password.length < 6) {
      this.errors.password = 'Password should be at least 6 characters';
      isValid = false;
    } else {
      this.errors.password = '';
    }

    if (!this.confirmPassword) {
      this.errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (this.confirmPassword !== this.password) {
      this.errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      this.errors.confirmPassword = '';
    }

          // Clear empty fields errors after 3 seconds
          setTimeout(() => {
            this.errors.username = '';
            this.errors.email = '';
            this.errors.password = '';
            this.errors.confirmPassword = '';
          }, 1000);

    return isValid;
  }

  handleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  handleSubmit(): void {
    if (this.validateForm()) {
      axios.post('http://localhost:3200/api/user/', {
        name: this.username,
        email: this.email,
        password: this.password
      })
      .then((res) => {
        console.log(res);
        this.registrationStatus = 'Registration successful!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      })
      .catch((err) => {
        console.log(err?.data?.message);
        if (err?.response?.data?.message === 'Email already registered') {
          this.emailError = 'Email already registered';
        } else {
          alert(err?.response?.data?.message);
        }
      });
    }
  }
}
