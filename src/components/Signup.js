import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";
import { Grid, Stack, InputLabel, FilledInput, FormHelperText } from '@mui/material';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import "./Signup.css";
import onboardGirl from "../assets/onboardgirl.png";
import logo from "../assets/logo.png";
import api from "../api"; // Import the API
import Documents from "./Documents/Documents";

const Signup = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [creditLimit, setCreditLimit] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const step = params.get("step");
  const prof = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : null;

  useEffect(() => {
    if (step) {
      setCurrentStep(parseInt(step));
    }
  }, [step]);

  useEffect(() => {
    fetchUserProfile();

    if (prof?.application?.current_step < 4) {
      setCurrentStep(2);
      
    }
  }, [prof]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.user.fetchProfile();
      const profile = response.data.data;
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("user", JSON.stringify(profile.user));
      localStorage.setItem("application", JSON.stringify(profile.application));
      if (profile.application.current_step === 4) {
        setCreditLimit(profile.application.credit_limit);
        setStatus(profile.applicationstatus);
       navigate("/shop");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    password: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.user.createUser(values);
      const { user, token, application } = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("devicefi_token", token);
      localStorage.setItem("application", JSON.stringify(application));
      fetchUserProfile();
      setCurrentStep(2);
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error.response.data.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-container container-fluid">
      <div className="row">
        <div className="col-md-6 form-section-signup d-flex flex-column align-items-center justify-content-center">
          <img src={logo} alt="Logo" className="logo mb-4" />
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form className="form-width" onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="first_name">First Name</InputLabel>
                          <FilledInput
                            id="first_name"
                            type="text"
                            value={values.first_name}
                            name="first_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.first_name && errors.first_name)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "45px" }}
                          />
                          {touched.first_name && errors.first_name && (
                            <FormHelperText error>{errors.first_name}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="last_name">Last Name</InputLabel>
                          <FilledInput
                            id="last_name"
                            type="text"
                            value={values.last_name}
                            name="last_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.last_name && errors.last_name)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "45px" }}
                          />
                          {touched.last_name && errors.last_name && (
                            <FormHelperText error>{errors.last_name}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                          <FilledInput
                            id="phone_number"
                            type="text"
                            value={values.phone_number}
                            name="phone_number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.phone_number && errors.phone_number)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "45px" }}
                          />
                          {touched.phone_number && errors.phone_number && (
                            <FormHelperText error>{errors.phone_number}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="email">Email</InputLabel>
                          <FilledInput
                            id="email"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "45px" }}
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error>{errors.email}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="address">Address</InputLabel>
                          <FilledInput
                            id="address"
                            type="text"
                            value={values.address}
                            name="address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.address && errors.address)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "45px" }}
                          />
                          {touched.address && errors.address && (
                            <FormHelperText error>{errors.address}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="password">Password</InputLabel>
                          <FilledInput
                            id="password"
                            type="password"
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "45px" }}
                          />
                          {touched.password && errors.password && (
                            <FormHelperText error>{errors.password}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

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
                          Continue
                        </Button>
                      </Grid>
                    </Grid>
                    {errorMessage && <div className="error-message-signup">{errorMessage}</div>}
                    <div className="login-link">
                      Already have an account? <Link to="/login">Login</Link>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h1>ID Verification</h1>
                    <p>You can proceed with additional details here.</p>
                    <Documents applicationId={prof?.application?.id} />
                  </>
                )}

                {currentStep === 3 && (
                  <div style={styles.container}>
                    <CheckCircleOutlined style={styles.icon} />
                    <h1 style={styles.heading}>Account Created</h1>
                    <p style={styles.subtext}>Congratulations! You are eligible to buy products below</p>
                    <div style={styles.amountBox}>
                      <span style={styles.amount}>#{creditLimit}</span>
                    </div>
                    <Button type="primary" onClick={() => navigate("/shop")} style={styles.button}>
                      Explore Product
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
        <div style={{ overflow: "hidden", position: "relative" }} className="col-md-6 image-section d-flex flex-column align-items-center justify-content-center">
          <div style={{ position: "absolute", top: "40px", textAlign: "center" }}>
            <h1>Apply and be eligible</h1>
            <h4>to receive loans for a mobile phone today</h4>
          </div>
          <img style={{ position: "absolute", bottom: "0px", width: "60%" }} src={onboardGirl} alt="Onboarding" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default Signup;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    height: "100vh",
    backgroundColor: "#fff",
  },
  icon: {
    color: "green",
    fontSize: "48px",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#000",
  },
  subtext: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "24px",
    textAlign: "center",
  },
  amountBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
  },
  amount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
    color: "#fff",
    fontWeight: "bold",
    padding: "10px 20px",
    borderRadius: "4px",
    fontSize: "16px",
  },
};