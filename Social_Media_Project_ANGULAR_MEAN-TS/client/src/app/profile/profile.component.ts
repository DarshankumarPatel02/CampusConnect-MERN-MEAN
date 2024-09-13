import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  updatedEmail = '';
  updatedUsername = '';
  successMessage = '';
  errorMessage = '';
  id= '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:3200/api/user/userDetails', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(
      data => {
        this.updatedEmail = data.email;
        this.updatedUsername = data.username;
        this.id = data.id;
      },
      error => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  updateProfile(): void {
    const updatedData = {
      email: this.updatedEmail,
      username: this.updatedUsername
    };

    this.http.put(`http://localhost:3200/api/user/profile/${this.id}`, updatedData).subscribe(
      () => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Error updating profile. Please try again.';
        this.successMessage = '';
        console.error('Error updating profile:', error);
      }
    );
  }
}
