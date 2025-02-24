import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Select, MenuItem, InputLabel, FilledInput, FormHelperText, Grid, Stack } from "@mui/material";
import { Steps } from "antd";
import { CheckCircleOutlined,CloseOutlined, HourglassOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Signup.css";
import onboardGirl from "../assets/onboardgirl.png";
import logo from "../assets/logo.png";
import api from "../api"; // Import the API
import ProfileCard from "./Pages/RightSide";

const { Step } = Steps;

const Signup = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0); // Start with phone number form
  const [userExists, setUserExists] = useState(null);
  const [userName, setUserName] = useState("");
  const [creditLimit, setCreditLimit] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [edit, setEdit] = useState(false)
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const step = params.get("step");
  const prof = (localStorage.getItem("application") && localStorage.getItem('application') !== undefined) ? JSON.parse(localStorage.getItem("application")) : null;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.clear()
      localStorage.setItem('devicefi_token', token);
    }
  }, [location.search]);

  useEffect(() => {
    if (step) {
      setCurrentStep(parseInt(step));
    }
  }, [step]);

  useEffect(() => {
    fetchUserProfile();
    //fetchDocumentTypes();
    // fetchSubmittedDocuments();
    if (prof?.current_step === 4) {
      setUserExists(true)

    } else if (prof?.current_step < 3 && prof?.current_step !== 1 && edit === false) {
      setCurrentStep((2))
    }
  }, [prof]);

  useEffect(() => {
    fetchDocumentTypes();
    fetchSubmittedDocuments();
  }, [userExists]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.user.checkUserExists(user.phone_number);
      const profile = response.data.data;
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("user", JSON.stringify(profile.user));
      if(profile.application){
        localStorage.setItem("application", JSON.stringify(profile.application));
      }
     
      if (profile.application.current_step === 3) {
        setCreditLimit(profile.application.credit_limit);
        setStatus(profile.applicationstatus);
        // navigate("/shop");
      }
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  const fetchDocumentTypes = async (document = prof?.id) => {
    try {
      const response = await api.document.getRequiredDocuments(document);
      setDocumentTypes(response.data.data.filter(doc => doc.is_required));
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  const fetchSubmittedDocuments = async () => {
    try {
      const response = await api.document.getApplicationDocuments(prof.id);
      const documents = response.data.data.documents;
      documents.sort((a, b) => (a.verification_status === "verified" ? -1 : 1));
      setSubmittedDocuments(documents);
    } catch (error) {
      console.error("Error fetching submitted documents:", error);
    }
  };

  const initialValues = {
    phone_number: "" || user?.phone_number,
    first_name: "" || user?.first_name,
    last_name: "" || user?.last_name,
    email: "" || user?.email,
    address: "" || user?.address,
    city: "" || user?.city,
    document_type: "",
    id_number: "",
  };

  const validationSchema = Yup.object({
    phone_number: Yup.string().required("Phone Number is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("Town/City is required"),
  });

  const handlePhoneSubmit = async (values) => {
    try {
      const response = await api.user.checkUserExists(values.phone_number);
      if (response.data.data.user) {
        setUserExists(true);
        setUserName(response.data.data.user.first_name);
        localStorage.setItem('user', JSON.stringify(response.data.data.user))

        if(response.data.data.application){
            localStorage.setItem('application', JSON.stringify(response.data.data.application))
        }
     
      } else {
        setUserExists(false);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      if (error?.response?.data?.message === "User not found") {
        setUserExists(false);
      }
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const handleSubmit = async (values, app = prof) => {
    try {
      delete values.document_type
      delete values.id_number
      const response = !app ? await api.user.createUser(values) : await api.user.updateUser({ ...values, user_id: prof?.user_id });
      const { user, token, application } = response.data.data;
      fetchUserProfile();
      fetchDocumentTypes(application.id)
      setCurrentStep(2);
      localStorage.setItem("user", JSON.stringify(user));
      // localStorage.setItem("devicefi_token", token);
      localStorage.setItem("application", JSON.stringify(application));

    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error?.response?.data?.errors);
    }
  };

  const handleDocumentSubmit = async (values) => {
    if (submittedDocuments.some(doc => doc.verification_status === "verified")) {
      setCurrentStep(3);
      return
    } else {
      setCurrentStep(2);
    }
    try {
      const response = await api.document.submitSingleDocument({
        document_type: values.document_type,
        id_number: values.id_number,
        user_id: user.id,
        application_id: prof.id
      });
      fetchSubmittedDocuments();

    } catch (error) {
      console.error("Error submitting document:", error);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const handleContinueClick = (values) => {
    if (userExists === null) {
      handlePhoneSubmit(values);
    } else if (userExists === false) {
      setCurrentStep(1);
    } else if (userExists === true) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="page-layout">
      <div style={{ direction: "rtl", width: "60%", display: "flex", justifyContent: "center", alignItems: "center" }} className="main-content">
        <div style={{ direction: "ltr", marginLeft: "0 auto" }}>
          {currentStep !== 0 && <img src={logo} alt="Logo" className="logo mb-4" />}
          <Formik initialValues={initialValues} validationSchema={validationSchema}>
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <form className="form-width" style={{ padding: "20px" }}>
                {currentStep === 0 && (
                  <>

                    {userExists === true && <div> <h3 style={{ marginBottom: "30px" }}>Returning Customer</h3><div style={{
                      backgroundColor: '#F5F9FF',
                      borderRadius: '12px',
                      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)', // Reduced elevation
                      padding: '20px',
                      margin: '5px 0', marginBottom: "20px"
                    }}>
                      <div style={{ ...headingStyle, }}>
                        <div style={profileImageStyle}>{user?.first_name.slice(0, 1)}{user?.last_name.slice(0, 1)}</div>
                        <span>{user?.first_name} {user?.last_name}</span>

                      </div><div style={{ justifySelf: "center" }}>{user?.phone_number?.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "$1-$2-$3-$4")}</div></div></div>}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {userExists === null && (
                          <div>
                            <h2>Customer Identity</h2>
                            <p style={{ fontSize: "14px", marginBottom: "20px" }}>Enter Customer phone number to know if it's a returning or new customer.</p>
                          </div>
                        )}
                        {userExists === false && (
                          <div>
                            <h2>New Customer</h2>
                            <p style={{ fontSize: "14px", marginBottom: "20px" }}>The customer appears to be new on our platform.</p>
                            <div style={{
                              backgroundColor: '#F5F9FF',
                              borderRadius: '12px',
                              boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)', // Reduced elevation
                              padding: '10px',
                              margin: '5px 0'
                            }}>
                              <div style={headingStyle}>



                              </div>{values?.phone_number&&<div style={{ justifySelf: "center" }}>{values?.phone_number.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "$1-$2-$3-$4")}</div>}</div>
                          </div>
                        )}
                        {(userExists !== false && userExists !== true) && (<Stack spacing={1}>
                          <InputLabel htmlFor="phone_number">Phone Number*</InputLabel>

                          <FilledInput
                            id="phone_number"
                            type="text"
                            value={values.phone_number || user?.phone_number}
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
                        </Stack>)}
                      </Grid>
                      <Grid item xs={12}>
                        {userExists !== true && <div>

                          <Button
                            disableElevation
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "20px" }}
                            className="submit-button"
                            onClick={() => handleContinueClick(values)}
                          >
                            Continue
                          </Button>
                          {userExists !== null && <Button
                            disableElevation
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            variant="outlined"
                            color="primary"
                            style={{ marginTop: "20px" }}
                            className="submit-button"
                            onClick={() => { localStorage.clear(); window.location.reload() }}
                          >
                            Previous
                          </Button>}
                        </div>}
                      </Grid>
                    </Grid>
                    {userExists && currentStep === 0 && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Button
                          disableElevation
                          fullWidth
                          size="large"
                          variant="contained"
                          color="primary"
                          className="submit-button"
                          onClick={() => navigate("/shop")}
                          style={{ marginTop: "25px" }}
                        >
                          Continue to Platform
                        </Button>
                        <Button fullWidth
                          size="large"
                          variant="outlined"
                          color="primary"
                          className="submit-button"
                          onClick={() => { localStorage.clear(); window.location.reload() }}
                          style={{ marginTop: "25px" }}>
                          Previous
                        </Button>
                      </div>

                    )}

                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <h4>New Customer Registration</h4>
                    <div>
                      <Steps progressDot size='default' style={{ marginBottom: "10px", marginLeft: "-60px", width: "100% !important" }} current={0}>
                        <Step />
                        <Step />
                        <Step />
                      </Steps>
                    </div>

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
                          variant="contained"
                          color="primary"
                          style={{ marginTop: "10px" }}
                          className="submit-button"
                          onClick={() => handleSubmit(values)}
                        >
                          Continue
                        </Button>
                      </Grid>
                    </Grid>

                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2>Onboarding</h2>
                    <Steps progressDot style={{ marginBottom: "10px", marginLeft: "-60px", marginTop: "20px", width: "100% !important" }} current={1}>
                      <Step />
                      <Step />
                      <Step />
                    </Steps>
                    <Grid container spacing={2} style={{ marginTop: "20px" }}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="document_type">Document Type</InputLabel>
                          <Select
                            id="document_type"
                            name="document_type"
                            value={values.document_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            error={Boolean(touched.document_type && errors.document_type)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "35px", width: "100%" }}
                          >
                            {documentTypes.map((docType) => (
                              <MenuItem key={docType} value={docType.document_type}>
                                {docType.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.document_type && errors.document_type && (
                            <FormHelperText error>{errors.document_type}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="id_number">ID Verification Number</InputLabel>
                          <FilledInput
                            id="id_number"
                            type="text"
                            value={values.id_number}
                            name="id_number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            fullWidth
                            placeholder="Enter ID Verification Number"
                            error={Boolean(touched.id_number && errors.id_number)}
                            className="input-field"
                            disableUnderline={true}
                            style={{ border: "none", height: "35px", width: "100%" }}
                          />
                          {touched.id_number && errors.id_number && (
                            <FormHelperText error>{errors.id_number}</FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <div
                          style={{
                            backgroundColor: "#f5f5f5",
                            height: "150px",
                            width: "100%",
                            marginTop: "10px",
                            padding: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                          }}
                        >
                          {submittedDocuments.length > 0 ? (
                            submittedDocuments.map((doc, index) => (
                              <div key={index} style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                {doc.verification_status === "verified" ? (
                                  <div> {index + 1}. {doc.requirement.name} <CheckCircleOutlined style={{ color: "green", fontSize: "24px", marginRight: "10px" }} /> </div>
                                ) : (
                                  <div> {index + 1}. {doc.requirement.name} <HourglassOutlined style={{ color: "orange", fontSize: "24px", marginRight: "10px" }} /> </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <span>Verification check</span>
                          )}
                        </div>
                      </Grid>

                      <Grid item style={{ display: "flex" }} xs={12}>
                        <Button disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          variant="outlined"
                          color="primary"
                          style={{ marginTop: "20px", marginRight: "10px" }}
                          className="submit-button"
                          onClick={() => { setEdit(true); setCurrentStep(1) }}> Previous</Button>
                        <Button
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          variant="contained"
                          color="primary"
                          style={{ marginTop: "20px" }}
                          className="submit-button"
                          onClick={() => handleDocumentSubmit(values)}
                        >
                          Submit
                        </Button>

                      </Grid>
                    </Grid>

                  </>
                )}

                {currentStep === 3 && (
                  <div style={styles.container}>
                       { user?.credit_approved?<div>
                        <CheckCircleOutlined style={styles.icon} />
                    <h3 style={styles.heading}>Congratulations!</h3>
                    <p style={styles.subtext}>You are eligible to buy products worth</p>
                    <div style={styles.amountBox}>
                      <span style={styles.amount}>R{user?.credit_limit}</span>
                    </div>
                    <Button type="primary" onClick={() => navigate("/shop")} style={styles.button}>
                      Explore Product
                    </Button></div>:<div>
                    {/* <CloseOutlined style={{...styles.icon,color:"red"}} /> */}
                    <h3 style={styles.heading}>Sorry! {user?.first_name}</h3>

                    <p style={styles.subtext}>You are not eligible at this time..</p>
                      </div>}
                                 
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div style={{ width: "40%" }} className="right-section">
        <ProfileCard check={currentStep} />
      </div>
    </div>
  );
};

export default Signup;
const containerStyle = {
  fontFamily: 'Inter, sans-serif',
  padding: '20px',
  borderRadius: '12px',
  maxWidth: '400px',
  display: "flex",
  justifyContent: "center",

  flexDirection: "column",
  height: '100vh', // Ensure everything is visible within 100vh
  overflowY: 'hidden', // Add scroll if content overflows
};

const headingStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',

};

const subHeadingStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#0165F2',
};

const textStyle = {
  fontSize: '14px',
  color: '#333333',
  margin: '5px 0',
};

const verifiedStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '14px',
  color: '#28a745',
  fontWeight: '500',
};

const profileImageStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#007bff',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '16px',
};
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
    lineHeight: "30px",
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
