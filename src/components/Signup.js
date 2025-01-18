import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, message } from "antd";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { CheckCircleOutlined } from '@ant-design/icons';
import "./Signup.css";
import onboardGirl from "../assets/onboardgirl.png";
import logo from "../assets/logo.png";
import api from "../api"; // Import the API
import Documents from "./Documents/Documents";
const prof = localStorage.getItem("profile")? JSON.parse(localStorage.getItem("profile")):null;


const Signup = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [creditLimit, setCreditLimit] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const step = params.get("step");

useEffect(()=>{
  if(step){
    setCurrentStep(parseInt(step));
  }
},[step])
  useEffect(() => {
    console.log(prof)
    fetchUserProfile();

    if(prof?.application?.current_step < 4){
      setCurrentStep(2);
    }
  }, []);



  const fetchUserProfile = async () => {
    try {
      const response = await api.user.fetchProfile();
      const profile = response.data.data;
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('user', JSON.stringify(profile.user));
      localStorage.setItem('application', JSON.stringify(profile.application));
      if (profile.application.current_step === 4) {
        setCreditLimit(profile.application.credit_limit);
        setStatus (profile.applicationstatus);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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

  const handleVerifyId = (setFieldValue) => {
    setFieldValue("isIdVerified", true);
    message.success("ID Verified Successfully!");
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.user.createUser(values);
      const { user, token, application } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('devicefi_token', token);
      localStorage.setItem('application', JSON.stringify(application));
      fetchUserProfile();
      message.success("Registration successful!");
    setCurrentStep(2);
    } catch (error) {
      
      console.error('Registration error:', error);
      message.error('Registration failed');
      setErrorMessage(error.response.data.errors);
    } finally {
      setSubmitting(false);
    }
  };
console.log(errorMessage)
  return (
    <div className="signup-container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="form-section">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, dirty, setFieldValue, isSubmitting }) => (
            <form className="form-div" onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <>
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <Field name="first_name">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="First Name"
                          bordered={false}
                          style={{ backgroundColor: "#f5f5f5", padding: "10px", marginBottom: "5px" }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="first_name" component="div" className="error" style={{ color: "red" }} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <Field name="last_name">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Last Name"
                          bordered={false}
                          style={{ backgroundColor: "#f5f5f5", padding: "10px", marginBottom: "5px" }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="last_name" component="div" className="error" style={{ color: "red" }} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <Field name="phone_number">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Phone Number"
                          bordered={false}
                          style={{ backgroundColor: "#f5f5f5", padding: "10px", marginBottom: "5px" }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="phone_number" component="div" className="error" style={{ color: "red" }} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field style={{fontSize:"1Opx"}} name="email">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Email Address"
                          bordered={false}
                          style={{ backgroundColor: "#f5f5f5", padding: "10px", marginBottom: "5px" }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="email" component="div" className="error" style={{ color: "red" }} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <Field name="address">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Address"
                          bordered={false}
                          style={{ backgroundColor: "#f5f5f5", padding: "10px", marginBottom: "5px" }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="address" component="div" className="error" style={{ color: "red" }} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field name="password">
                      {({ field }) => (
                        <Input.Password
                          {...field}
                          placeholder="Password"
                          bordered={false}
                          style={{ backgroundColor: "#f5f5f5", padding: "10px", marginBottom: "5px" }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="password" component="div" className="error" style={{ color: "red" }} />
                  </div>

                  <Button
                    type="primary"
                    onClick={() => handleSubmit()} // Explicitly call Formik's handleSubmit
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Continue
                  </Button>
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
                  <Documents applicationId={prof?.application?.id}/>
                </>
              )}

              {currentStep === 3 && (
                <div style={styles.container}>
                {/* Success Icon */}
                <CheckCircleOutlined style={styles.icon} />
          
                {/* Heading */}
                <h1 style={styles.heading}>Account Created</h1>
          
                {/* Subtext */}
                <p style={styles.subtext}>
                  Congratulations! You are eligible to buy products below
                </p>
          
                {/* Amount Box */}
                {<div style={styles.amountBox}>
                  <span style={styles.amount}>#{creditLimit}</span>
                </div>}
          
                {/* Button */}
                <Button type="primary" onClick={()=>navigate("/shop")}style={styles.button}>
                  Explore Product
                </Button>
              </div>
              )}
            </form>
          )}
        </Formik>
      </div>
      <div className="image-section">
        {currentStep<3?<div>
        <h2>Apply and be eligible</h2>
        <p>to receive a loan for a mobile phone today</p>
       </div>:<h2>Congratulations!!!</h2>} <img
          style={{ width: "380px" }}
          src={onboardGirl}
          alt="Excited woman with a phone"
        />
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