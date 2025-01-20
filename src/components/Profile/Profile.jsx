import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormFeedback,
  Container,
  Row,
  Col,
} from "reactstrap";
import background from "../../assets/profilebackground.jpeg";
import profileImg from "../../assets/profile.jpg";
import api from "../../api"; // Import the API
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "../Header/Header"; // Import Header
import Footer from "../Footer/Footer"; // Import Footer
import "./Profile.css";



const ProfileFormScreen = () => {
  const [err, setErr] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    

    setTimeout(() => {
        if (!user?.id) {
            navigate("/login");
          }
    }, 2000);
    
  }, [user]);

  const handleEditProfile = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      localStorage.setItem("user", JSON.stringify({ ...user, ...values, login_counter: 1 }));
      await api.user.updateProfile(values);
      setIsModalOpen(false);
      setStatus({ success: true });
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.response.data.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="page-content">
        <Container fluid>
          <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
            {/* Profile Details Section */}
            <Paper
              elevation={4}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 3,
              }}
            >
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></Box>
              <Avatar
                alt="Profile Picture"
                src={profileImg}
                sx={{
                  width: 100,
                  height: 100,
                  position: "absolute",
                  top: 150,
                  left: "8%",
                  transform: "translateX(-50%)",
                  border: "4px solid white",
                }}
              />
              <Box sx={{ marginTop: 8, paddingBottom: 2, paddingLeft: "16px" }}>
                <Typography variant="h4">
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user?.email}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user?.phone_number}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user?.address}
                </Typography>
              </Box>
              <IconButton
                aria-label="settings"
                onClick={() => setIsModalOpen(true)}
                sx={{ position: "absolute", top: 16, right: 16 }}
              >
                <MoreVertIcon style={{color:"white"}}color="action" />
              </IconButton>
            </Paper>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ borderRadius: 3, padding: 3, marginBottom: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Additional Details
                  </Typography>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Employment Status:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {user?.employment_status}
                    </Typography>
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Income Source:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {user?.income_details?.income_source}
                    </Typography>
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Monthly Income:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      ₦{user?.income_details?.monthly_income}
                    </Typography>
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Additional Income:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      ₦{user?.income_details?.additional_income}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ borderRadius: 3, padding: 3, marginBottom: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Status
                  </Typography>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Onboarding Status:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {user?.onboarding_status}
                    </Typography>
                  </Box>
                  {/* <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Account Status:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {user.account_status}
                    </Typography>
                  </Box> */}
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>KYC Status:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {user?.kyc_status}
                    </Typography>
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Credit Approved:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {user?.credit_approved ? "Yes" : "No"}
                    </Typography>
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body1" className="detail-field">
                      <strong>Credit Limit:</strong>
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      ₦{user?.credit_limit}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            {/* Edit Profile Modal */}
            <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} centered className="custom-modal">
              <ModalHeader toggle={() => setIsModalOpen(false)}>Edit Profile</ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={{
                    first_name: user?.first_name || "",
                    last_name: user?.last_name || "",
                    email: user?.email || "",
                    phone_number: user?.phone_number || "",
                    address: user?.address || "",
                    employment_status: user?.employment_status || "",
                    income_source: user?.income_details?.income_source || "",
                    monthly_income: user?.income_details?.monthly_income || "",
                    additional_income: user?.income_details?.additional_income || "",
                  }}
                  validationSchema={Yup.object().shape({
                    first_name: Yup.string().max(255).required("First Name is required"),
                    last_name: Yup.string().max(255).required("Last Name is required"),
                    email: Yup.string()
                      .email("Must be a valid email")
                      .max(255)
                      .required("Email is required"),
                    phone_number: Yup.string().max(15).required("Phone Number is required"),
                    address: Yup.string().max(255).required("Address is required"),
                    employment_status: Yup.string().max(255).required("Employment Status is required"),
                    income_source: Yup.string().max(255).required("Income Source is required"),
                    monthly_income: Yup.number().required("Monthly Income is required"),
                    additional_income: Yup.number().required("Additional Income is required"),
                  })}
                  onSubmit={handleEditProfile}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="firstname-signup">First name*</Label>
                            <Input
                              id="firstname-signup"
                              type="text"
                              value={values?.first_name}
                              name="first_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="John"
                              invalid={Boolean(touched.first_name && errors.first_name)}
                            />
                            {touched.first_name && errors.first_name && (
                              <FormFeedback>{errors.first_name}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="lastname-signup">Last name*</Label>
                            <Input
                              id="lastname-signup"
                              type="text"
                              value={values?.last_name}
                              name="last_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Doe"
                              invalid={Boolean(touched.last_name && errors.last_name)}
                            />
                            {touched.last_name && errors.last_name && (
                              <FormFeedback>{errors.last_name}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="email-signup">Email Address*</Label>
                            <Input
                              id="email-signup"
                              type="email"
                              value={values?.email}
                              name="email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="demo@company.com"
                              invalid={Boolean(touched.email && errors.email)}
                            />
                            {touched.email && errors.email && (
                              <FormFeedback>{errors.email}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="phone_number-signup">Phone Number*</Label>
                            <Input
                              id="phone_number-signup"
                              type="text"
                              value={values?.phone_number}
                              name="phone_number"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="1234567890"
                              invalid={Boolean(touched.phone_number && errors.phone_number)}
                            />
                            {touched.phone_number && errors.phone_number && (
                              <FormFeedback>{errors.phone_number}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="address-signup">Address*</Label>
                            <Input
                              id="address-signup"
                              type="text"
                              value={values.address}
                              name="address"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="123 Main St"
                              invalid={Boolean(touched.address && errors.address)}
                            />
                            {touched.address && errors.address && (
                              <FormFeedback>{errors.address}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="employment_status-signup">Employment Status*</Label>
                            <Input
                              id="employment_status-signup"
                              type="text"
                              value={values.employment_status}
                              name="employment_status"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Employed"
                              invalid={Boolean(touched.employment_status && errors.employment_status)}
                            />
                            {touched.employment_status && errors.employment_status && (
                              <FormFeedback>{errors.employment_status}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="income_source-signup">Income Source*</Label>
                            <Input
                              id="income_source-signup"
                              type="text"
                              value={values.income_source}
                              name="income_source"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Coding"
                              invalid={Boolean(touched.income_source && errors.income_source)}
                            />
                            {touched.income_source && errors.income_source && (
                              <FormFeedback>{errors.income_source}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="monthly_income-signup">Monthly Income*</Label>
                            <Input
                              id="monthly_income-signup"
                              type="number"
                              value={values.monthly_income}
                              name="monthly_income"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="500000"
                              invalid={Boolean(touched.monthly_income && errors.monthly_income)}
                            />
                            {touched.monthly_income && errors.monthly_income && (
                              <FormFeedback>{errors.monthly_income}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="additional_income-signup">Additional Income*</Label>
                            <Input
                              id="additional_income-signup"
                              type="number"
                              value={values.additional_income}
                              name="additional_income"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="3000000"
                              invalid={Boolean(touched.additional_income && errors.additional_income)}
                            />
                            {touched.additional_income && errors.additional_income && (
                              <FormFeedback>{errors.additional_income}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      {err && (
                        <FormFeedback style={{ margin: "20px" }} error>
                          {err}
                        </FormFeedback>
                      )}
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ width: "100%", marginTop: "20px" }}
                      >
                        Edit
                      </Button>
                    </Form>
                  )}
                </Formik>
              </ModalBody>
            </Modal>
          </Box>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ProfileFormScreen;