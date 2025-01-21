import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Grid, Stack, InputLabel, FilledInput, FormHelperText } from '@mui/material';
import './Login.css';
import onboardGirl from '../assets/onboardgirl.png';
import logo from '../assets/logo.png';
import api from '../api'; // Import the API

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);
  const navigate = useNavigate();
  const application = localStorage.getItem('application') ? JSON.parse(localStorage.getItem('application')) : null;

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
        await api.user.initiateOTP({ email: values.email }).then((res) => {
          setOtp(res.data.otp);
        })
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
    <div className="login-container container-fluid">
      <div className="row">
        <div className="col-md-6 form-section-login d-flex flex-column align-items-center justify-content-center">
          <img src={logo} alt="Logo" className="logo mb-4" />
          <h1 className="mb-4">{isAdmin ? 'Admin Login' : 'User Login'}</h1>
          <div className="d-flex mb-4">
            <Button
              variant="text"
              onClick={() => setIsAdmin(false)}
              style={{ backgroundColor:"transparent", textDecoration: !isAdmin ? 'underline' : 'none', color: isAdmin ? "black":"", }}
              className="me-3"
            >
              User Login
            </Button>
            <Button
              variant="text"
              onClick={() => setIsAdmin(true)}
              style={{ backgroundColor:"transparent",textDecoration: isAdmin ? 'underline' : 'none', color: !isAdmin ? "black":"", }}
            >
              Admin Login
            </Button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleBlur, handleChange, isSubmitting, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="form-width">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel color="secondary" htmlFor="email-login">
                        Email Address
                      </InputLabel>
                      <FilledInput
                        id="email-login"
                        type="email"
                        
                        variant='standard'
                         disableUnderline={true}
                        value={values.email}
                        name="email"
                        style={{border:"none", height:"45px"}}
                        onBlur={handleBlur}
                        onChange={handleChange}
                       
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                        className="input-field"
                      />
                      {touched.email && errors.email && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.email}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {!isAdmin && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="password-login">Password</InputLabel>
                        <FilledInput
                          fullWidth
                          error={Boolean(touched.password && errors.password)}
                          id="password-login"
                          type="password"
                          value={values.password}
                          name="password"
                          disableUnderline={true}
                          onBlur={handleBlur}
                          style={{border:"none", height:"45px"}}
                          onChange={handleChange}
                         
                          className="input-field"
                        />
                        {touched.password && errors.password && (
                          <FormHelperText error id="standard-weight-helper-text-password-login">
                            {errors.password}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  )}

                  {isAdmin && isOtpSent && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="otp-login">OTP</InputLabel>
                        <FilledInput
                          fullWidth
                          error={Boolean(touched.otp && errors.otp)}
                          id="otp-login"
                          type="text"
                          value={values.otp}
                          style={{border:"none", height:"45px"}}
                          
                          name="otp"
                          onBlur={handleBlur}
                          disableUnderline={true}
                          onChange={handleChange}
                          placeholder="Enter OTP"
                          className="input-field"
                        />
                        {otp && <p className="text-success">OTP: {otp}</p>}
                        {touched.otp && errors.otp && (
                          <FormHelperText error id="standard-weight-helper-text-otp-login">
                            {errors.otp}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  )}

                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}></Stack>
                  </Grid>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="submit-button"
                    >
                      {isAdmin && !isOtpSent ? 'Continue' : 'Login'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
          <div className="signup-link mt-4">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
        <div style={{overflow:"hidden", position:"relative"}}className="col-md-6 image-section d-flex align-items-center justify-content-center">
        <h1 style={{top:"30px", marginBottom:"50px", position:"absolute"}}>Welcome back</h1>
          <img style={{position:"absolute", bottom:"0px", width:"60%"}} src={onboardGirl} alt="Onboarding" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default Login;