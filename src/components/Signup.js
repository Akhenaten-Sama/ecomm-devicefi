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
import ProfileCard from "./Pages/RightSide";

const Signup = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0); // Start with phone number form
  const [userExists, setUserExists] = useState(true);
  const [userName, setUserName] = useState("");
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
       // navigate("/shop");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const initialValues = {
    phone_number: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    city: "",
  };

  const validationSchema = Yup.object({
    phone_number: Yup.string().required("Phone Number is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("Town/City is required"),
  });

  const handlePhoneSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.user.checkUserExists({ phone_number: values.phone_number });
      if (response.data.exists) {
        setUserExists(true);
        setUserName(response.data.user.name);
      } else {
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setErrorMessage("Error checking user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="page-layout">
      <div style={{ direction: "rtl", width: "60%", display: "flex", justifyContent: "center", alignItems:"center" }} className="main-content">
        <div style={{ direction: "ltr", marginLeft: "0 auto" }}>
        {currentStep !==0  && <img src={logo} alt="Logo" className="logo mb-4" /> }
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={currentStep === 0 ? handlePhoneSubmit : handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form className="form-width" onSubmit={handleSubmit} style={{ padding: "20px" }}>
                {currentStep === 0 && (
                  <>
                    {userExists && <h3>Welcome back, {userName}!</h3>}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {!userExists && <div>
                        <h2>Customer Identity</h2>
                        <p style={{fontSize:"14px", marginBottom:"20px"}}>Enter Customer phone number to know it its a returning or new customer.</p>
                
                        </div>}
                               <Stack spacing={1}>
                          <InputLabel htmlFor="phone_number">Phone Number*</InputLabel>
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
                            style={{ border: "none", height: "35px", width: "100%" }}
                          />
                          {touched.phone_number && errors.phone_number && (
                            <FormHelperText error>{errors.phone_number}</FormHelperText>
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
                    {userExists && (
                      <Button
                        disableElevation
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        className="submit-button"
                        onClick={() => navigate("/shop")}
                        style={{ marginTop: "10px" }}
                      >
                        Continue to Platform
                      </Button>
                    )}
                    {errorMessage && <div className="error-message-signup">{errorMessage}</div>}
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <Grid container spacing={2}>
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
                            style={{ border: "none", height: "35px", width: "100%" }}
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
                            style={{ border: "none", height: "35px", width: "100%" }}
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
                            style={{ border: "none", height: "35px", width: "100%" }}
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
                            style={{ border: "none", height: "35px", width: "100%" }}
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
                            style={{ border: "none", height: "35px", width: "100%" }}
                          />
                          {touched.address && errors.address && (
                            <FormHelperText error>{errors.address}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="city">Town/City</InputLabel>
                          <FilledInput
                            id="city"
                            type="text"
                            value={values.city}
                            name="city"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(touched.city && errors.city)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "35px", width: "100%" }}
                          />
                          {touched.city && errors.city && (
                            <FormHelperText error>{errors.city}</FormHelperText>
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
      </div>
      <div style={{ width: "40%" }} className="right-section">
        <ProfileCard />
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