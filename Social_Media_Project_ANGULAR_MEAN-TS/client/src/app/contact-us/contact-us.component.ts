import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  submissionMessage: string = '';

  contactForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  async handleSubmit() {
    if (this.contactForm.valid) {
      try {
        // Make API call to your backend endpoint
        await this.http.post('http://localhost:3200/api/contact', this.contactForm.value).toPromise();

        // Show success message
        this.submissionMessage = 'Form submitted successfully';

        // Reset the form
        this.contactForm.reset();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.submissionMessage = '';
        }, 3000);
      } catch (error) {
        // Handle error
        console.error(error);
        this.submissionMessage = 'An error occurred while submitting the form';
      }
    }
  }
}
