# Claim Reimbursement Application

A production-ready, role-based claim reimbursement management system built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🎭 Role-Based Access Control
- **User**: Create, edit, and submit claims
- **Supervisor**: Approve/reject submitted claims
- **Finance Approver**: Final approval and payment processing
- **Super Admin**: Full system administration

### 📄 Claim Management
- Create and edit claims with multiple bills
- Support for different claim types:
  - General expenses
  - Travel expenses
  - Mileage claims
  - Cumulative mileage
- Multi-bill support with detailed expense tracking
- Declaration and compliance workflow

### 💼 Bill Types
- **Generic**: Standard expenses with merchant and invoice details
- **Airfare**: Flight bookings with class selection
- **Mileage**: Vehicle-based claims with distance, fuel type, and engine CC

### ✅ Approval Workflow
- Multi-stage approval process
- Supervisor approval → Finance approval → Payment
- Rejection with mandatory reason
- Recalculation for cumulative mileage claims

### 👥 Administration
- User management with role assignment
- Entity-based organization structure
- Mileage rate configuration by entity
- Comprehensive reporting and analytics

### 📊 Reports & Analytics
- Filter by entity, status, employee
- Bulk export to CSV
- Mark multiple claims as paid
- Real-time statistics

## Project Structure

```
/
├── components/
│   ├── admin/
│   │   ├── UserManagementPanel.tsx
│   │   ├── MileageRatesPanel.tsx
│   │   └── ReportsPanel.tsx
│   ├── claims/
│   │   ├── ClaimCard.tsx
│   │   ├── ClaimGallery.tsx
│   │   ├── BillCard.tsx
│   │   ├── BillFormDialog.tsx
│   │   └── ClaimDetailsDialog.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   └── ui/
│       └── [shadcn components]
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── mockData.ts
│   └── utils.ts
├── pages/
│   ├── LandingPage.tsx
│   ├── ClaimCreationPage.tsx
│   ├── DeclarationPage.tsx
│   ├── PendingApprovalsPage.tsx
│   └── AdminPage.tsx
├── types/
│   └── index.ts
├── App.tsx
└── styles/
    └── globals.css
```

## Routing Structure

| Route | Component | Access |
|-------|-----------|--------|
| `/` | LandingPage | All roles |
| `/claims/new` | ClaimCreationPage | User, Supervisor |
| `/claims/edit/:id` | ClaimCreationPage | User, Supervisor |
| `/claims/:id` | ClaimDetailsPage | All roles |
| `/claims/declaration` | DeclarationPage | User, Supervisor |
| `/approvals` | PendingApprovalsPage | Supervisor, Finance Approver |
| `/admin` | AdminPage | Finance Approver, Super Admin |

## Key Components

### Landing Page
- Tabbed view by claim status (Drafted, Submitted, Approved, Paid)
- Claim cards with quick actions
- Role-based visibility

### Claim Creation
- Form with claim details
- Bill gallery with add/edit/delete
- Real-time summary
- Save as draft or submit workflow

### Declaration Page
- Claim summary review
- Type-specific declarations
- Checkbox acceptance required
- Final submission

### Approvals
- Pending and approved tabs
- Table view with filters
- Approve/reject actions
- Mileage recalculation for cumulative claims

### Administration
- **User Management**: Create/edit users with role assignment
- **Mileage Rates**: Entity-based rate configuration
- **Reports**: Advanced filtering, export, and payment marking

## State Management

### AuthContext
Provides global authentication and user state:
- Current user information
- Role-based access control
- Login/logout functionality
- Role switching (demo mode)

### Mock Data
Includes sample data for:
- Users with different roles
- Claims in various statuses
- Bills with different expense types
- Entities and mileage rates
- Declarations by claim type

## Design Patterns

### Component Composition
- Reusable UI components from shadcn/ui
- Custom business components built on top
- Clear separation of concerns

### Role-Based Rendering
```tsx
{user.role === 'Supervisor' && <SupervisorFeatures />}
```

### Dialog-Based Forms
- Modal forms for data entry
- Non-blocking user experience
- Consistent UX patterns

### Card-Based Layouts
- Gallery views for browsing
- Hover effects for interactivity
- Clear visual hierarchy

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly interfaces

### Visual Feedback
- Toast notifications for actions
- Loading states
- Color-coded status badges
- Confirmation dialogs

### Accessibility
- Semantic HTML
- Keyboard navigation
- ARIA labels
- Focus management

## Color Scheme

- **Primary**: Blue (#2563eb) - Actions and links
- **Success**: Green - Approvals and positive states
- **Warning**: Yellow - Pending states
- **Danger**: Red - Rejections and deletions
- **Neutral**: Gray - Background and text

## Next Steps for Production

### Backend Integration
Replace mock data with real API calls:
```typescript
// Example API integration
const fetchClaims = async () => {
  const response = await fetch('/api/claims');
  return response.json();
};
```

### Authentication
Integrate with:
- OAuth 2.0 / OpenID Connect
- JWT tokens
- Session management

### File Uploads
Implement attachment handling:
- Image/PDF uploads
- File validation
- Cloud storage integration

### Advanced Features
- Email notifications
- Audit logging
- Real-time updates (WebSocket)
- Advanced search
- Bulk operations
- Dashboard analytics
- Export to Excel/PDF

### Performance Optimization
- Pagination for large datasets
- Virtual scrolling
- Lazy loading
- Caching strategies

### Security
- Input validation
- XSS protection
- CSRF tokens
- Rate limiting
- Encryption for sensitive data

## Demo Mode

The app includes a "Switch Role" feature in the header to quickly test different user perspectives. In production, this should be removed and replaced with proper authentication.

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **Tailwind CSS v4**: Styling
- **shadcn/ui**: Component library
- **Lucide React**: Icons
- **Sonner**: Toast notifications

## Development

The application is designed to be modular and maintainable:
- Clear folder structure
- Typed components
- Reusable utilities
- Mock data for development
- Clean component hierarchy
