import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input, Button } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import onboardGirl from '../assets/onboardgirl.png';
import logo from '../assets/logo.png';
import api from '../api'; // Import the API

const application = localStorage.getItem('application') ? JSON.parse(localStorage.getItem('application')) : null;
const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.user.fetchProfile();
      const profile = response.data.data;
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('user', JSON.stringify(profile.user));
      localStorage.setItem('application', JSON.stringify(profile.application));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (application?.current_step < 4) {
      navigate(`/signup?step=${application.current_step}`);
    }

    if (application?.current_step === 4) {
      navigate('/shop');
    }
  }, [application, navigate]);

  const initialValues = {
    email: '',
    password: '',
    otp: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: !isAdmin ? Yup.string().required('Password is required') : Yup.string(),
    otp: isAdmin && isOtpSent ? Yup.string().required('OTP is required') : Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isAdmin && !isOtpSent) {
        // Initiate OTP
        await api.user.initiateOTP({ email: values.email });
        setIsOtpSent(true);
      } else if (isAdmin && isOtpSent) {
        // Verify OTP
        const response = await api.user.verifyOTP({ email: values.email, otp: values.otp });
        const { user, application, token } = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('devicefi_token', token);
        console.log(application,"wdw")
        fetchUserProfile();
        if (application?.current_step < 4) {
          navigate(`/signup?step=${application.current_step}`);
        }

        if (application?.current_step === 4) {
          navigate('/shop');
        }
      } else {
        // User login
        const response = await api.user.loginUser({ email: values.email, password: values.password });
        const { user, application, token } = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('devicefi_token', token);
        console.log(application,"wdw")
        fetchUserProfile();
        if (application?.current_step < 4) {
          navigate(`/signup?step=${application.current_step}`);
        }

        if (application?.current_step === 4) {
          navigate('/shop');
        }
      }
    } catch (error) {
      setErrorMessages(error.response.data.message);
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-section-login">
        <img src={logo} alt="Logo" className="logo" />
        <h1>{isAdmin ? 'Admin Login' : 'User Login'}</h1>
        <Button type="link" onClick={() => setIsAdmin(!isAdmin)}>
          {isAdmin ? 'Switch to User Login' : 'Switch to Admin Login'}
        </Button>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="email">
                {({ field }) => (
                  <div className="form-group">
                    <Input
                      {...field}
                      placeholder="Email Address"
                      bordered={false}
                      style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '10px' }}
                    />
                    <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
                  </div>
                )}
              </Field>

              {!isAdmin && (
                <Field name="password">
                  {({ field }) => (
                    <div className="form-group">
                      <Input.Password
                        {...field}
                        placeholder="Password"
                        bordered={false}
                        style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '10px' }}
                      />
                      <ErrorMessage name="password" component="div" className="error" style={{ color: 'red' }} />
                    </div>
                  )}
                </Field>
              )}

              {isAdmin && isOtpSent && (
                <Field name="otp">
                  {({ field }) => (
                    <div className="form-group">
                      <Input
                        {...field}
                        placeholder="Enter OTP"
                        bordered={false}
                        style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '10px' }}
                      />
                      <ErrorMessage name="otp" component="div" className="error" style={{ color: 'red' }} />
                    </div>
                  )}
                </Field>
              )}

              <Button type="primary" htmlType="submit" loading={isSubmitting} disabled={isSubmitting}>
                {isAdmin && !isOtpSent ? 'Continue' : 'Login'}
              </Button>
              {errorMessages && <div className="error-message-signup">{errorMessages}</div>}
              <div className="login-link">
                Sign Up Instead <Link to="/signup">SIGNUP</Link>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div className="image-section">
        <img src={onboardGirl} alt="Onboarding" />
      </div>
    </div>
  );
};

export default Login;