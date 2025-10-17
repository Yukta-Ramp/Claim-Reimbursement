// Type definitions for the Claim Reimbursement Application

export type UserRole = 'User' | 'Supervisor' | 'Finance Approver' | 'Super Admin';

export type ClaimStatus = 
  | 'Drafted' 
  | 'Submitted' 
  | 'Supervisor Approved' 
  | 'Finance Approved' 
  | 'Paid'
  | 'Rejected'
  | 'Cancelled';

export type ClaimType = 
  | 'General' 
  | 'Travel' 
  | 'Mileage' 
  | 'Cumulative Mileage';

export type ExpenseType = 
  | 'Generic' 
  | 'Airfare' 
  | 'Mileage';

export type AirfareType = 'Economy' | 'Business' | 'First Class';

export type CarType = 'Personal' | 'Company' | 'Rental';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  entity: string;
  currency: string;
  costCenter: string;
  department: string;
  supervisorId?: string;
  hasReportAccess: boolean;
}

export interface Bill {
  id: string;
  expenseName: string;
  expenseType: ExpenseType;
  fromDate: string;
  toDate: string;
  amount: number;
  vat: number;
  businessJustification: string;
  
  // Generic fields
  merchantName?: string;
  invoiceNumber?: string;
  attachments?: string[];
  
  // Airfare specific
  airfareType?: AirfareType;
  
  // Mileage specific
  carType?: CarType;
  reducedRate?: boolean;
  fuelType?: FuelType;
  distance?: number;
  engineCC?: number;
}

export interface Claim {
  id: string;
  claimNo: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  claimType: ClaimType;
  status: ClaimStatus;
  submittedDate?: string;
  supervisorApprovedDate?: string;
  financeApprovedDate?: string;
  paidDate?: string;
  totalAmount: number;
  bills: Bill[];
  declarations?: string[];
  rejectionReason?: string;
  entity: string;
}

export interface MileageRate {
  id: string;
  entityId: string;
  rateType: string;
  rateValue: number;
  effectiveDate: string;
}

export interface Entity {
  id: string;
  name: string;
  currency: string;
}

export interface Declaration {
  id: string;
  text: string;
  required: boolean;
}
