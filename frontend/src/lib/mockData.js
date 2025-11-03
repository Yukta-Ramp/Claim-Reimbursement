// Mock data for the Claim Reimbursement Application

// Types are removed for JS conversion

export const mockEntities = [
  { id: 'e1', name: 'North America', currency: 'USD' },
  { id: 'e2', name: 'Europe', currency: 'EUR' },
  { id: 'e3', name: 'Asia Pacific', currency: 'SGD' },
];

export const mockUsers = [
  {
    id: 'u1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    role: 'User',
    entity: 'North America',
    currency: 'USD',
    costCenter: 'CC-1001',
    department: 'Engineering',
    supervisorId: 's1',
    hasReportAccess: false,
  },
  {
    id: 's1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Supervisor',
    entity: 'North America',
    currency: 'USD',
    costCenter: 'CC-1000',
    department: 'Engineering',
    hasReportAccess: true,
  },
  {
    id: 'f1',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    role: 'Finance Approver',
    entity: 'North America',
    currency: 'USD',
    costCenter: 'CC-2000',
    department: 'Finance',
    hasReportAccess: true,
  },
  {
    id: 'a1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    role: 'Super Admin',
    entity: 'North America',
    currency: 'USD',
    costCenter: 'CC-0000',
    department: 'IT',
    hasReportAccess: true,
  },
];

export const mockClaims = [
  {
    id: 'c1',
    claimNo: 'CLM-2025-001',
    userId: 'u1',
    userName: 'John Doe',
    title: 'Q1 Travel Expenses',
    description: 'Business trip to client site',
    claimType: 'Travel',
    status: 'Drafted',
    totalAmount: 1250.50,
    entity: 'North America',
    bills: [
      {
        id: 'b1',
        expenseName: 'Flight to NYC',
        expenseType: 'Airfare',
        fromDate: '2025-03-15',
        toDate: '2025-03-15',
        amount: 850.00,
        vat: 0,
        businessJustification: 'Client meeting in New York',
        merchantName: 'American Airlines',
        invoiceNumber: 'AA-12345',
        airfareType: 'Economy',
        attachments: ['ticket.pdf'],
      },
      {
        id: 'b2',
        expenseName: 'Hotel Stay',
        expenseType: 'Generic',
        fromDate: '2025-03-15',
        toDate: '2025-03-17',
        amount: 400.50,
        vat: 40.05,
        businessJustification: 'Accommodation during client visit',
        merchantName: 'Marriott NYC',
        invoiceNumber: 'HTL-67890',
        attachments: ['receipt.pdf'],
      },
    ],
  },
  {
    id: 'c2',
    claimNo: 'CLM-2025-002',
    userId: 'u1',
    userName: 'John Doe',
    title: 'Office Supplies',
    description: 'Monthly office supply reimbursement',
    claimType: 'General',
    status: 'Submitted',
    submittedDate: '2025-10-10',
    totalAmount: 125.75,
    entity: 'North America',
    bills: [
      {
        id: 'b3',
        expenseName: 'Stationery',
        expenseType: 'Generic',
        fromDate: '2025-10-01',
        toDate: '2025-10-01',
        amount: 125.75,
        vat: 12.58,
        businessJustification: 'Office supplies for team',
        merchantName: 'Office Depot',
        invoiceNumber: 'OD-11223',
        attachments: ['invoice.pdf'],
      },
    ],
  },
  // ...existing code for other claims...
];

export const mockMileageRates = [
  {
    id: 'm1',
    entityId: 'e1',
    rateType: 'Standard Petrol (up to 2000cc)',
    rateValue: 0.45,
    effectiveDate: '2025-01-01',
  },
  {
    id: 'm2',
    entityId: 'e1',
    rateType: 'Standard Petrol (over 2000cc)',
    rateValue: 0.55,
    effectiveDate: '2025-01-01',
  },
  {
    id: 'm3',
    entityId: 'e1',
    rateType: 'Standard Diesel (up to 2000cc)',
    rateValue: 0.40,
    effectiveDate: '2025-01-01',
  },
  {
    id: 'm4',
    entityId: 'e1',
    rateType: 'Standard Diesel (over 2000cc)',
    rateValue: 0.50,
    effectiveDate: '2025-01-01',
  },
  {
    id: 'm5',
    entityId: 'e1',
    rateType: 'Electric Vehicle',
    rateValue: 0.35,
    effectiveDate: '2025-01-01',
  },
];

export const mockDeclarations = {
  General: [
    {
      id: 'd1',
      text: 'I declare that the expenses claimed are wholly, exclusively and necessarily incurred in the performance of my duties.',
      required: true,
    },
    {
      id: 'd2',
      text: 'I confirm that all receipts and supporting documents are genuine and have not been claimed elsewhere.',
      required: true,
    },
  ],
  Travel: [
    {
      id: 'd3',
      text: 'I declare that all travel expenses were incurred for legitimate business purposes.',
      required: true,
    },
    {
      id: 'd4',
      text: 'I confirm that I have followed the company travel policy and obtained necessary pre-approvals.',
      required: true,
    },
  ],
  Mileage: [
    {
      id: 'd5',
      text: 'I declare that the mileage claimed is accurate and was incurred for business purposes only.',
      required: true,
    },
    {
      id: 'd6',
      text: 'I confirm that I maintain adequate insurance coverage for business use of my vehicle.',
      required: true,
    },
  ],
  'Cumulative Mileage': [
    {
      id: 'd7',
      text: 'I declare that the cumulative mileage claimed is accurate and was incurred for business purposes only.',
      required: true,
    },
    {
      id: 'd8',
      text: 'I confirm that I maintain adequate insurance coverage for business use of my vehicle.',
      required: true,
    },
    {
      id: 'd9',
      text: 'I acknowledge that mileage rates may be recalculated based on cumulative distance thresholds.',
      required: true,
    },
  ],
};
