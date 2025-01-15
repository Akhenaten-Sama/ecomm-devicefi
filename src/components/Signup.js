import React, { useState } from "react";
import "./Signup.css"; // External CSS file for styling
import onboardGirl from './assets/onboardgirl.png';
import { Button } from "antd";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    idType: "",
    idNumber: "",
    isIdVerified: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };

  const handleVerifyId = () => {
    // Simulate ID verification process
    setFormData({ ...formData, isIdVerified: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", formData);
    // Add submission logic here
  };

  return (
    <div className="signup-container">
      <div className="form-section">
        {currentStep === 1 && (
          <form onSubmit={handleNext}>
            <h1>Create an account</h1>
            <label>
              First Name*
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last Name*
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone Number*
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email Address*
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Address*
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password*
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Continue</button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleNext}>
            <h1>ID Verification</h1>
            <label>
              Select ID Type*
              <select
                style={{ height: "40px" }}
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                required
              >
                <option value="">Select ID Type</option>
                <option value="NIN">NIN</option>
                <option value="BVN">BVN</option>
              </select>
            </label>
            <label>
              ID Number*
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </label>
            <div style={{ display: "flex", width: "50%", justifyContent: "space-between" }}>
              <button type="button" onClick={handleVerifyId} style={{ height: "30px" }}>
                Verify ID
              </button>
              {formData.isIdVerified && <p>ID Verified Successfully!</p>}
              <button onClick={handlePrev} style={{ height: "30px" }}>
                Back
              </button>
              <button type="submit" >
                Continue
              </button>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <div>
            <h1>Congratulations!</h1>
            <p>Your account has been successfully created. You are eligible for the loan!</p>
            <Button color="primary">Explore Products</Button>
          </div>
        )}
      </div>
      <div className="image-section">
        <h2>Apply and be eligible</h2>
        <p>to receive a loan for a mobile phone today</p>
        <img
          style={{ width: "300px" }}
          src={onboardGirl}
          alt="Excited woman with a phone"
        />
      </div>
    </div>
  );
};

export default Signup;


