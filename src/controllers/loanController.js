import Loan from "../models/loanModel.js"

const getLoanCategories = async (req, res) => {
  const categories = [
    {
      category: 'Wedding Loans',
      subcategories: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
      maxLoan: 500000,
      loanPeriod: 3,
    },
    {
      category: 'Home Construction Loans',
      subcategories: ['Structure', 'Finishing'],
      maxLoan: 1000000,
      loanPeriod: 5,
    },
    {
      category: 'Business Startup Loans',
      subcategories: ['Buy Stall', 'Advance Rent', 'Shop Assets'],
      maxLoan: 1000000,
      loanPeriod: 5,
    },
    {
      category: 'Education Loans',
      subcategories: ['University Fees', 'Child Fees'],
      maxLoan: 'Based on Requirement',
      loanPeriod: 4,
    },
  ];

  res.status(200).json({ success: true, data: categories });
};


export default getLoanCategories