import React, { useEffect } from 'react';
import Logo from "../../assets/blackLogo.png"
import Placeholder from "../../assets/empty-user.png"
const cardStyle = {
  backgroundColor: '#F5F9FF',
  borderRadius: '12px',
  boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)', // Reduced elevation
  padding: '10px',
  margin: '5px 0', // Reduced gap between cards
};

const containerStyle = {
  fontFamily: 'Inter, sans-serif',
  padding: '20px',
  borderRadius: '12px',
  
  display:"flex",
  justifyContent:"center",
  
  flexDirection:"column",
  height: '100vh', // Ensure everything is visible within 100vh
  overflowY: 'hidden', // Add scroll if content overflows
};

const headingStyle = {
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

const ProfileCard = ({check}) => {
 const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
 
 console.log(check, 'ydiuwdhiowdodd')
 useEffect(() => { 

    console.log(user)
 }, [user]);
 
 return user? (
    <div style={containerStyle}>

      <p style={subHeadingStyle}>Customer Details</p>
      <div style={cardStyle}>
        <div style={headingStyle}>
          <div style={profileImageStyle}>{user?.first_name.slice(0,1)}{user?.last_name.slice(0,1)}</div>
          <span>{user?.first_name} {user?.last_name}</span>
        </div>
        <div style={subHeadingStyle}>Contact Info</div>
        <div style={textStyle}>{user?.email}</div>
        <div style={textStyle}>{user?.phone_number}</div>
      </div>

      <div style={cardStyle}>
        <div style={subHeadingStyle}>Address 1</div>
        <div style={textStyle}>Street: {user?.address}</div>
        <div style={textStyle}>City:{user?.city}</div>
        <div style={textStyle}>State/province/area:{user?.state}, {user?.country}</div>
      </div>

     {user?.credit_approved && <div style={cardStyle}>
        <div style={subHeadingStyle}>Verification</div>
        <div>
          <span style={textStyle}>
            Type: <span style={verifiedStyle}>National ID Card</span>
          </span>
          <span style={{ marginLeft: '8px', color: '#28a745' }}>✔</span>
        </div>
      </div>}

      {user?.credit_approved && <div style={cardStyle}>
        <div style={subHeadingStyle}>Credit Check</div>
        <div style={{ ...textStyle, fontWeight: '500' }}>
          Status: <span style={{ color: '#28a745' }}>{user?.credit_approved?"Eligible":"Not Eligible"}</span>
        </div>
      </div>}

      {user?.credit_approved && <div style={cardStyle}>
        <div style={subHeadingStyle}>Credit Qualify Amount</div>
        <div style={{ ...textStyle, fontWeight: '600' }}>Amount: R{user?.credit_limit}</div>
      </div>}
    </div>
  ): (<div style={containerStyle}>

     {check!==1? <div style={{display:"flex", alignItems:"center", justifyContent:"center", width:"100%"}}>
        <img width="150px"  src={Logo} />
      </div>:<div style={{display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",width:"100%"}}>
        
        <img style={{justifySelf:"center", }}src={Placeholder} width='200px'/>
        <h6 style={{marginTop:"20px"}}>No Customer Details
       </h6>
        <h6> Collected yet</h6>
        </div>}
  </div>)
};

export default ProfileCard;
