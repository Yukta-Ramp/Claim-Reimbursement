# Application Architecture

## Overview
This is a comprehensive Claim Reimbursement Application with role-based access control, multi-stage approval workflows, and administrative features.

## Core Concepts

### 1. User Roles & Permissions

#### User
- Create new claims
- Edit draft claims
- Submit claims for approval
- View own claim history

#### Supervisor
- All User permissions
- View pending submitted claims
- Approve/reject submitted claims
- Access approval dashboard

#### Finance Approver
- View supervisor-approved claims
- Final approval authority
- Mark claims as paid
- Access to reports and analytics
- User management
- Mileage rate configuration

#### Super Admin
- All Finance Approver permissions
- Entity management
- System configuration

### 2. Claim Workflow

```
Draft → Submitted → Supervisor Approved → Finance Approved → Paid
   ↓         ↓              ↓                    ↓
Rejected  Rejected       Rejected            Rejected
```

### 3. Bill Types & Required Fields

#### Generic Expense
- Expense Name
- From/To Date
- Amount & VAT
- Business Justification
- Merchant Name
- Invoice Number
- Attachments

#### Airfare
- All Generic fields +
- Airfare Type (Economy/Business/First Class)

#### Mileage
- Expense Name
- From/To Date
- Amount (auto-calculated)
- Business Justification
- Car Type (Personal/Company/Rental)
- Fuel Type (Petrol/Diesel/Electric/Hybrid)
- Distance (km)
- Engine CC
- Reduced Rate flag

### 4. Data Models

#### Claim
```typescript
{
  id: string
  claimNo: string        // e.g., CLM-2025-001
  userId: string
  userName: string
  title: string
  description: string
  claimType: ClaimType
  status: ClaimStatus
  submittedDate?: string
  supervisorApprovedDate?: string
  financeApprovedDate?: string
  paidDate?: string
  totalAmount: number
  bills: Bill[]
  declarations?: string[]
  rejectionReason?: string
  entity: string
}
```

#### Bill
```typescript
{
  id: string
  expenseName: string
  expenseType: ExpenseType
  fromDate: string
  toDate: string
  amount: number
  vat: number
  businessJustification: string
  
  // Type-specific fields
  merchantName?: string
  invoiceNumber?: string
  attachments?: string[]
  airfareType?: AirfareType
  carType?: CarType
  fuelType?: FuelType
  distance?: number
  engineCC?: number
  reducedRate?: boolean
}
```

#### User
```typescript
{
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  entity: string
  currency: string
  costCenter: string
  department: string
  supervisorId?: string
  hasReportAccess: boolean
}
```

### 5. Page Flow

#### Creating a Claim
1. User clicks "Create New Claim"
2. Fills in claim details (title, description, type)
3. Adds one or more bills via dialog
4. Reviews summary
5. Can save as draft or proceed to declaration
6. Accepts all required declarations
7. Submits claim

#### Approval Process
1. Supervisor receives submitted claim
2. Views claim details and bills
3. Can recalculate mileage if needed
4. Approves or rejects with reason
5. Finance Approver receives approved claims
6. Final approval or rejection
7. Claim moves to paid status after processing

#### Administration
1. Access admin panel
2. Manage users (create/edit with role assignment)
3. Configure mileage rates per entity
4. Generate reports with filters
5. Export data to CSV
6. Mark approved claims as paid

### 6. Component Hierarchy

```
App
├── AuthProvider
│   └── Router
│       ├── Header
│       │   ├── Logo
│       │   ├── Role Switcher (demo)
│       │   └── User Menu
│       ├── Navigation
│       │   └── Role-based nav items
│       └── Pages
│           ├── LandingPage
│           │   ├── Status Tabs
│           │   └── ClaimGallery
│           │       └── ClaimCard
│           ├── ClaimCreationPage
│           │   ├── Claim Details Form
│           │   ├── Bill Gallery
│           │   │   └── BillCard
│           │   ├── BillFormDialog
│           │   └── Summary Sidebar
│           ├── DeclarationPage
│           │   ├── Claim Summary
│           │   └── Declaration Checkboxes
│           ├── PendingApprovalsPage
│           │   ├── Filters
│           │   ├── Pending Tab
│           │   ├── Approved Tab
│           │   └── ClaimsTable
│           └── AdminPage
│               ├── User Management Tab
│               ├── Mileage Rates Tab
│               └── Reports Tab
```

### 7. State Management

#### Global State (AuthContext)
- Current user
- User role
- Authentication status

#### Local State
- Form data (claim creation)
- Dialog visibility
- Filter states
- Selection states (checkboxes)
- Editing states

#### Mock Data (Development)
- Users
- Claims
- Entities
- Mileage rates
- Declarations

### 8. UI Patterns

#### Card-Based Layouts
- Claims displayed as cards
- Bills displayed as cards
- User management cards
- Entity selection cards

#### Dialog Forms
- Modal forms for data entry
- Non-blocking workflow
- Validation before submission

#### Table Views
- Approval tables
- Reports table
- Bulk actions support

#### Status Badges
- Color-coded by status
- Consistent across app
- Clear visual indicators

#### Toast Notifications
- Success messages
- Error messages
- Confirmation feedback

### 9. Navigation Structure

```
Header (Global)
  - Logo & Title
  - Role Switcher (demo)
  - User Profile Menu

Navigation Bar (Role-based)
  - My Claims (All roles)
  - Approvals (Supervisor, Finance Approver)
  - Administration (Finance Approver, Super Admin)
```

### 10. API Integration Points (Future)

```typescript
// Claims API
GET    /api/claims              // List claims
POST   /api/claims              // Create claim
GET    /api/claims/:id          // Get claim details
PUT    /api/claims/:id          // Update claim
DELETE /api/claims/:id          // Delete claim
POST   /api/claims/:id/submit   // Submit claim
POST   /api/claims/:id/approve  // Approve claim
POST   /api/claims/:id/reject   // Reject claim

// Users API
GET    /api/users               // List users
POST   /api/users               // Create user
PUT    /api/users/:id           // Update user

// Admin API
GET    /api/mileage-rates       // Get rates
PUT    /api/mileage-rates/:id   // Update rate
GET    /api/reports             // Generate reports
POST   /api/claims/mark-paid    // Mark as paid

// File Upload API
POST   /api/upload              // Upload attachment
GET    /api/files/:id           // Download file
```

### 11. Security Considerations

#### Authentication
- JWT tokens or session cookies
- Secure token storage
- Token refresh mechanism

#### Authorization
- Role-based access control (RBAC)
- Route protection
- Component-level permissions

#### Data Validation
- Frontend validation
- Backend validation
- Sanitization

#### Sensitive Data
- Encrypted storage
- Secure transmission (HTTPS)
- PII protection

### 12. Performance Optimizations

#### Code Splitting
- Route-based splitting
- Lazy loading components
- Dynamic imports

#### Data Loading
- Pagination
- Infinite scroll
- Virtual scrolling for large lists

#### Caching
- API response caching
- Local storage for user preferences
- Service workers (PWA)

### 13. Accessibility

#### Keyboard Navigation
- Tab order
- Keyboard shortcuts
- Focus indicators

#### Screen Readers
- ARIA labels
- Semantic HTML
- Alt text for images

#### Color Contrast
- WCAG AA compliance
- Color-blind friendly
- High contrast mode support

### 14. Testing Strategy

#### Unit Tests
- Component rendering
- Business logic
- Utility functions

#### Integration Tests
- User flows
- API integration
- State management

#### E2E Tests
- Critical paths
- Cross-browser testing
- Mobile testing

### 15. Deployment Considerations

#### Environment Variables
- API endpoints
- Feature flags
- Configuration

#### Build Optimization
- Minification
- Tree shaking
- Asset optimization

#### Monitoring
- Error tracking (Sentry)
- Analytics
- Performance monitoring

---

This architecture provides a solid foundation for a production-ready claim reimbursement system with clear separation of concerns, maintainable code structure, and room for growth.
