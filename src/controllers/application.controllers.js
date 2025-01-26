
const submitLoanApplication = (req, res) => {
    const { loanType, subcategory, amount, duration } = req.body;
  
    if (!loanType || !subcategory || !amount || !duration) {
      return res.status(400).json({ error: "All fields are required!" });
    }
  
    const loanApplication = {
      id: Date.now(),
      loanType,
      subcategory,
      amount,
      duration,
    };
  
    console.log("Loan Application Submitted:", loanApplication);
  
    // Respond with success
    res.status(201).json({
      message: "Loan application submitted successfully!",
      data: loanApplication,
    });
  };
  
  export  {submitLoanApplication}
  