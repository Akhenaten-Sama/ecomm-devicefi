export const calculateInterest = (tenure) => { 
    if (!tenure || !tenure.amount) {
      return;
    }
    const interest = tenure.amount * (tenure.tenure_rate_type_value / 100);
    const TotalPayable = Math.ceil(interest + tenure.amount);
    const totalMonthlyPayment = `${Math.ceil(TotalPayable / tenure.tenure_type_value)} / ${tenure.tenure_type}`.replace('s', '');
  console.log(tenure)
    return { interest, TotalPayable, totalMonthlyPayment };
  };
  export default {
    calculateInterest
  }