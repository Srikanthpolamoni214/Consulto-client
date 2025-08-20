import { TextField, Button, Radio, FormLabel, FormControlLabel, RadioGroup } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/client/register.css'
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FcGoogle } from 'react-icons/fc'; // For Google icon
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
    const [state, setRegisterState] = useState({})
      const [googleUser, setGoogleUser] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

    const navigate = useNavigate()

    const validateForm = () => {
        const requiredFields = ['name', 'email', 'password', 'gender', 'mobileNumber', 'age'];
        
        for (let field of requiredFields) {
            const value = state[field];
            
            if (
                value === undefined || 
                value === null ||
                (typeof value === 'string' && value.trim() === '') ||
                (field === 'age' && (isNaN(value) || Number(value) <= 0))
            ) {
                return false;
            }
        }
        return true;
    };

    const submitRegisterForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields!", { position: "top-right" });
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3400/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(state)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                toast.success(data.message || "User registered successfully!", { position: "top-right" });
                setTimeout(() => navigate('/login'), 5000);
            } else {
                toast.error(data.message || "Registration failed", { position: "top-right" });
            }
        } catch (error) {
            toast.error("Network error. Please try again.", { position: "top-right" });
            console.error(error);
        }
    }

    const handleChange = (e) => {
        const value = e.target.name === 'age' 
            ? Number(e.target.value)
            : e.target.value;
            
        setRegisterState({ 
            ...state, 
            [e.target.name]: value 
        });
    }
    
const handleGoogleCompleteSignup = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3400/google-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: googleUser.name,
        email: googleUser.email,
        photoUrl: googleUser.photoUrl,
        password,
      }),
    });

    const result = await res.json();
console.log(result)
    if (result.message === 'Google sign-up successful') {
      alert("✅ Google Signup Completed");
      localStorage.setItem("token", result.token);
      navigate("/login");
    } else if (result.message === 'Email already exists') {
      setMessage("Registration failed: Email already exists or Google account already linked. Please login.");
      // alert("⚠️ User already exists. Please login.");
      // navigate("/login");
    } else {
      alert("❌ Signup Failed");
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, picture } = decoded;
      setGoogleUser({ name, email, photoUrl: picture }); // Switch to Google mode
    } catch (err) {
      alert("Google Authentication Failed");
    }
  };
    return (
        <div className="register-wrapper">
            <div className="register-box">
                <div className="logo-section">
                    <img src="/Consulto_Logo.png" alt="Consulto Logo" className="logo-image" />
                </div>

                <div className="register-container">
                  {   !googleUser &&  (<> <form id="registerForm" className="form" onSubmit={submitRegisterForm}>
                        <TextField required label="UserName" type="text" name="name" fullWidth onChange={handleChange} />
                        <TextField required label="Mobile Number" type="tel" name="mobileNumber" fullWidth onChange={handleChange} />
                        <TextField required label="Email" type="email" name="email" fullWidth onChange={handleChange} />
                        <TextField required label="Password" type="password" name="password" autoComplete="current-password" fullWidth onChange={handleChange} />
                        <TextField required label="Age" type="number" name="age" InputProps={{ inputProps: { min: 1 } }} fullWidth onChange={handleChange} />

                        <FormLabel className="gender-label" required>Gender</FormLabel>
                        <RadioGroup row name="gender" onChange={handleChange} required>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>

                        <Button type="submit" variant="contained" className="form-button">Register Now</Button>
                    </form>     
                
                  <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => alert('Google Sign-In Failed')}
  useOneTap={false}
  render={(renderProps) => (
    <button
      onClick={renderProps.onClick}
      disabled={renderProps.disabled}
      className="flex items-center justify-center gap-3 px-4 py-2 border rounded-md shadow-md bg-white hover:bg-gray-100 text-gray-800 w-full"
    >
      <FcGoogle className="text-xl" />
      <span>Sign up with Google</span> {/* <-- Custom Text */}
    </button>
  )}
/>
                
        </>        )}
                  
 {googleUser && (
          <div className="text-center">
            <h2>Set the password for your Consulto account</h2>
            <p>{googleUser.name}</p>
            <p>{googleUser.email}</p>
            <img
              src={googleUser.photoUrl}
              alt="Google Avatar"
              className="w-20 h-20 rounded-full mx-auto mb-2"
            />
            <form onSubmit={handleGoogleCompleteSignup} className="space-y-4 mt-4">
              <input
                type="password"
                placeholder="Set a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              <button type="submit"  className="clm-sign">
                Complete Signup
              </button>
              <p style={{ color: 'red' }}>{message ? message : ''}</p>
            </form>
          </div>
        )}


                    <Button variant="contained" className="form-button secondary-button">
                        <Link to="/login" className="link-style">Already Registered? Login Now</Link>
                    </Button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;