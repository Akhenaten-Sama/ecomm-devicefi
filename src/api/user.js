export default class User {
    constructor(client) {
      this.client = client;
    }
  
    createUser(payload) {
      return this.client.post('/onboarding/in-store/register', payload);
    }
  
    updateUser(payload) {
      const id = payload.user_id;
      delete payload.user_id;
      delete payload.created_at
      delete payload.updated_at
      delete payload.update_date
      //delete payload.password;
      return this.client.put(`/onboarding/in-store/register/${id}`, payload);
    }
  
    deleteUser(email) {
      return this.client.delete(`/user/${email}`);
    }
  
    loginUser(payload) {
      return this.client.post('/user/login', payload);
    }
  
    initiateOTP(payload) {
      return this.client.post('/user/otp/initiate',payload);
    }
    
    updateProfile(payload) {
      delete payload.email
      return this.client.put('/user/profile', payload)
    }

    updateProfile(payload) {
      delete payload.email
      return this.client.put('/user/profile', payload)
    }

    checkUserExists(phone){
           return this.client.get(`/user/admin/phone-number?phone_number=${phone}`)
    }

    fetchProfile() {
      return this.client.get('/user/profile') 
    }
    verifyOTP(payload) {
      return this.client.post('/user/otp/verify', payload);
    }
    getAllUsers(page, pageSize) {
      return this.client.get(`/User?page=${1}&limit=${30}`);
    }
  
    getSingleUser(email) {
      return this.client.get(`/user/${email}`);
    }
  }