import '../styles/privacy-policy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './Navigation';

const PrivacyPolicy = () => {
  return (
    <>
    <Navigation/>
    <div className="text-left">
        <div className='content'>
        <h1>Privacy Policy</h1>
      <p>
        This privacy policy applies to our social media application and
        describes how we collect, use, and share information about our users.
        By using our application, you agree to the terms of this privacy
        policy.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect various types of information from our users, including:
        personal information such as name, email address, and profile
        information; usage information such as IP address, device information,
        and browser type; and any other information you provide to us when
        using our application.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our
        social media application, personalize your experience, and communicate
        with you. We may also use your information to respond to your inquiries
        or requests and to send you updates, newsletters, or promotional
        materials.
      </p>

      <h2>Sharing Your Information</h2>
      <p>
        We may share your information with third-party service providers who
        help us with application hosting, data analysis, and other
        administrative tasks. We may also share your information if required by
        law or to protect our rights or the rights of other users.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable measures to protect your information from
        unauthorized access, disclosure, alteration, or destruction. However,
        please note that no method of transmission over the internet or method
        of electronic storage is 100% secure.
      </p>

      <h2>Changes to this Privacy Policy</h2>
      <p>
        We may update this privacy policy from time to time. Any changes will
        be effective immediately upon posting the updated policy on our
        application. We encourage you to review this policy periodically.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this privacy policy or our
        practices, please contact us at privacy@example.com.
      </p>
        </div>
      
    </div>
    </>
  );
};

export default PrivacyPolicy;