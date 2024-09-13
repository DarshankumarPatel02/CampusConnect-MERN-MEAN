import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errors: { email?: string; password?: string } = {};
  emailErrorMessage: string = '';
  showEmailError: boolean = false;
  passwordErrorMessage: string = '';
  showPasswordError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  handleSubmit(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const newErrors: { email?: string; password?: string } = {};

    if (!this.email) {
      newErrors.email = 'Please enter your email';
    } else if (!emailRegex.test(this.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!this.password) {
      newErrors.password = 'Please enter your password';
    } else if (this.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      this.errors = newErrors;
      
      // Show the error messages for 5 seconds
      setTimeout(() => {
        this.errors = {};
      }, 1000);
    } else {
      this.errors = {};
      axios.post('http://localhost:3200/api/user/login', {
        email: this.email,
        password: this.password,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem('token', res.data.token); // Store the token in local storage
        this.authService.login(res.data.token); // Use the AuthService to handle login
        this.router.navigate(['/post']); // Redirect the user to the 'post' route
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status === 404) {
          this.errors.email = 'Email is not registered';
        } else if (err?.response?.status === 401) {
          this.errors.password = 'Wrong password';
        } else {
          alert(err?.response?.data?.message);
        }
      });
    }
  }
}
