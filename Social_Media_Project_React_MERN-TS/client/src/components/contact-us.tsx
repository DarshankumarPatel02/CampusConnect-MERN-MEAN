import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/contactUs.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navigation from './Navigation';
import axios from 'axios';

const ContactUs: React.FC = () => {
  const [submissionMessage, setSubmissionMessage] = useState('');

  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address. Please enter a valid email.'
      )
      .required('Email is required'),
    message: Yup.string().required('Message is required'),
  });

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: FormikHelpers<any>) => {
    try {
      // Make API call to your backend endpoint
      await axios.post('http://localhost:3200/api/contact', values);

      // Show success message
      setSubmissionMessage('Form submitted successfully');

      // Reset the form
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmissionMessage('');
      }, 3000);
    } catch (error) {
      // Handle error
      console.error(error);
      setSubmissionMessage('An error occurred while submitting the form');
    } finally {
      // Set submitting state to false
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="container contact-us">
        <div className="row">
          <div className="col-md-6">
            <div className="contact-details">
              <h1 style={{ textAlign: 'left' }}>Contact Details</h1>
              <br />
              <h4>Phone:</h4> <p>+1-123-456-7890</p> <hr />
              <h4>Email:</h4> <p>contact@socialmedia.com</p> <hr />
              <h4>Address:</h4> <p>56th Street, North Side, NY, USA</p> <hr />
              <div className="social-media-icons">
                <a href="#">
                  <FaFacebook />
                </a>
                <a href="#">
                  <FaTwitter />
                </a>
                <a href="#">
                  <FaInstagram />
                </a>
                <a href="#">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="contact-form">
              <h1 style={{ textAlign: 'left' }}>Get in touch with Us</h1>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <Field type="text" name="name" className="form-control" />
                      <ErrorMessage name="name" component="div" className="error" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field type="email" name="email" className="form-control" />
                      <ErrorMessage name="email" component="div" className="error" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <Field as="textarea" name="message" className="form-control" rows={3} />
                      <ErrorMessage name="message" component="div" className="error" />
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                    {submissionMessage && (
                      <div className="submission-message">{submissionMessage}</div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
