import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  contacts: Contact[] = []; 
  loggedIn: boolean = false;
  username: string = '';
  password: string = '';
  selectedContacts: string[] = [];
  errorMessage: string = '';
  
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {}

  handleLogin(): void {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  
    if (!this.username) {
      this.errorMessage = 'Username is required';
    } else if (!this.password) {
      this.errorMessage = 'Password is required';
    } else if (this.username === 'admin' && this.password === 'admin') {
      this.loggedIn = true;
      this.fetchContacts();
    } else {
      this.errorMessage = 'Invalid credentials';
    }
  }  

  handleLogout(): void {
    this.loggedIn = false;
  }

  async fetchContacts(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', token || '');
  
      const response = await this.http.get<Contact[]>('http://localhost:3200/api/contact', { headers }).toPromise();
      if (response) {
        this.contacts = response;
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  async handleDelete(contactId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', token || '');

      await this.http.delete(`http://localhost:3200/api/contact/${contactId}`, { headers }).toPromise();
      this.fetchContacts();
    } catch (error) {
      console.error(error);
    }
  }

  handleSelect(contactId: string): void {
    const selectedIndex = this.selectedContacts.indexOf(contactId);

    if (selectedIndex === -1) {
      this.selectedContacts.push(contactId);
    } else {
      this.selectedContacts = this.selectedContacts.filter(id => id !== contactId);
    }
  }

  async deleteSelectedContacts(): Promise<void> {
    for (const contactId of this.selectedContacts) {
      await this.handleDelete(contactId);
    }
    this.selectedContacts = [];
  }
}
