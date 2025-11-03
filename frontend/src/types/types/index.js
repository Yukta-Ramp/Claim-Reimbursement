// Type definitions for the Claim Reimbursement Application (converted to JS)

// User roles
const UserRole = ['User', 'Supervisor', 'Finance Approver', 'Super Admin'];

// Claim statuses
const ClaimStatus = [
  'Drafted',
  'Submitted',
  'Supervisor Approved',
  'Finance Approved',
  'Paid',
  'Rejected',
  'Cancelled',
];

// Claim types
const ClaimType = [
  'General',
  'Travel',
  'Mileage',
  'Cumulative Mileage',
];

// Expense types
const ExpenseType = ['Generic', 'Airfare', 'Mileage'];

// Airfare types
const AirfareType = ['Economy', 'Business', 'First Class'];

// Car types
const CarType = ['Personal', 'Company', 'Rental'];

// Fuel types
const FuelType = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

// User object example
// See mockData.js for actual usage

// Bill object example
// See mockData.js for actual usage

// Claim object example
// See mockData.js for actual usage

// MileageRate object example
// See mockData.js for actual usage

// Entity object example
// See mockData.js for actual usage

// Declaration object example
// See mockData.js for actual usage

module.exports = {
  UserRole,
  ClaimStatus,
  ClaimType,
  ExpenseType,
  AirfareType,
  CarType,
  FuelType,
};
