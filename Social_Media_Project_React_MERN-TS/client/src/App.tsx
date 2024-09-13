import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import PrivacyPolicy from './components/privacy-policy';
import ContactUs from './components/contact-us';
import './App.css';
import PostsList from './components/post';
import AdminPanel from './components/contact-panel';
import Profile from './components/profile';
import Career from './components/carrer-page';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/post" element={<PostsList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel/>} />
            <Route path="/career" element={<Career />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;