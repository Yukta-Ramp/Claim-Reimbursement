import { Input } from '../components/ui/input.jsx';
import { CollapsibleNavbar } from '../components/layout/CollapsibleNavbar';
import { Badge } from '../components/ui/badge.jsx';
import { TableHeaderFilter } from '../components/claims/TableHeaderFilter.jsx';
import { Plus } from 'lucide-react';
import { Eye } from 'lucide-react';
import { FileX } from 'lucide-react';
import { Filter } from 'lucide-react';
import { Search } from 'lucide-react';


import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { mockClaims } from '../lib/mockData';
import { translate } from '../lib/translate';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.jsx';

export const LandingPage = ({ language }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [activeStatus, setActiveStatus] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const [columnSort, setColumnSort] = useState({ column: '', direction: null });
  const [columnFilters, setColumnFilters] = useState({
    claim: '',
    description: '',
    date: '',
    amount: '',
    status: '',
  });
  const [mobileSearchValue, setMobileSearchValue] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!user) return null;

  // Filter claims based on user role
  const getUserClaims = () => {
    if (user.role === 'User' || user.role === 'Supervisor') {
      return mockClaims.filter(claim => claim.userId === user.id);
    }
    // Finance and Admin see all claims
    return mockClaims;
  };

  const getClaimsByStatus = (status) => {
    const userClaims = getUserClaims();
    if (status === 'All') return userClaims;
    return userClaims.filter(claim => claim.status === status);
  };

  const handleViewClaim = (claim) => {
    navigate(`/claims/${claim.id}`);
  };

  const handleEditClaim = (claim) => {
    navigate(`/claims/edit/${claim.id}`);
  };

  const handleDeleteClaim = (claim) => {
    setClaimToDelete(claim);
  };

  const confirmDelete = () => {
    if (claimToDelete) {
      toast.success(`Claim ${claimToDelete.claimNo} deleted successfully`);
      setClaimToDelete(null);
    }
  };

  const handleCreateClaim = () => {
    navigate('/claims/new');
  };

  // For desktop - exclude Rejected, Paid, Cancelled but include All
  const desktopStatuses = [
    'All',
    'Drafted',
    'Submitted',
    'Supervisor Approved',
    'Finance Approved',
  ];

  // For mobile - include all statuses + All option
  const mobileStatuses = [
    'All',
    'Drafted',
    'Submitted',
    'Supervisor Approved',
    'Finance Approved'
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Finance Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Submitted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Supervisor Approved':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Paid':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Drafted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  // Apply filters and sorting
  const filteredAndSortedClaims = useMemo(() => {
    let claims = getClaimsByStatus(activeStatus);

    // Mobile global search
    if (isMobile && mobileSearchValue) {
      const searchLower = mobileSearchValue.toLowerCase();
      claims = claims.filter(claim => 
        claim.claimNo.toLowerCase().includes(searchLower) ||
        claim.title.toLowerCase().includes(searchLower) ||
        claim.description.toLowerCase().includes(searchLower) ||
        claim.totalAmount.toFixed(2).includes(searchLower) ||
        claim.status.toLowerCase().includes(searchLower)
      );
    }

    // Desktop column filters
    if (!isMobile) {
      if (columnFilters.claim) {
        claims = claims.filter(claim => 
          claim.claimNo.toLowerCase().includes(columnFilters.claim.toLowerCase()) ||
          claim.title.toLowerCase().includes(columnFilters.claim.toLowerCase())
        );
      }
      if (columnFilters.description) {
        claims = claims.filter(claim => 
          claim.description.toLowerCase().includes(columnFilters.description.toLowerCase())
        );
      }
      if (columnFilters.date) {
        claims = claims.filter(claim => 
          formatDate(claim.submittedDate).toLowerCase().includes(columnFilters.date.toLowerCase())
        );
      }
      if (columnFilters.amount) {
        claims = claims.filter(claim => 
          claim.totalAmount.toFixed(2).includes(columnFilters.amount)
        );
      }
      if (columnFilters.status) {
        claims = claims.filter(claim => 
          claim.status.toLowerCase().includes(columnFilters.status.toLowerCase())
        );
      }
    }

    // Apply sorting
    if (columnSort.column && columnSort.direction) {
      claims = [...claims].sort((a, b) => {
        let aValue;
        let bValue;

        switch (columnSort.column) {
          case 'claim':
            aValue = a.claimNo;
            bValue = b.claimNo;
            break;
          case 'description':
            aValue = a.description;
            bValue = b.description;
            break;
          case 'date':
            aValue = new Date(a.submittedDate || '').getTime();
            bValue = new Date(b.submittedDate || '').getTime();
            break;
          case 'amount':
            aValue = a.totalAmount;
            bValue = b.totalAmount;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return columnSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return columnSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return claims;
  }, [activeStatus, columnFilters, columnSort, mobileSearchValue, isMobile]);

  const handleSort = (column, direction) => {
    setColumnSort({ column, direction });
  };

  const handleFilter = (column, value) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

 return (
     <div className="flex">
       <CollapsibleNavbar />
       <div className="flex-1 container mx-auto px-4 py-8 md:px-8 pb-24 md:pb-8">
         {/* Desktop Header */}
         {!isMobile && (
           <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
             <div className="flex items-center justify-between">
               <div>
                 <h1 className="text-gray-900 mb-1">{translate(language, 'appName')}</h1>
                 <p className="text-gray-500 text-sm">{translate(language, 'appSubtitle')}</p>
               </div>
               {(user.role === 'User' || user.role === 'Supervisor') && (
                 <Button onClick={handleCreateClaim} className="gap-2 bg-black hover:bg-gray-800 relative z-10">
                   <Plus className="h-4 w-4" />
                   {translate(language, 'actions.createClaim') || 'Create New Claim'}
                 </Button>
               )}
             </div>
           </div>
         )}
 
         {/* Mobile Header */}
         {isMobile && (
           <div className="mb-6 mt-6">
             <h1 className="text-gray-900 mb-1">{translate(language, 'myClaims') || 'My Claims'}</h1>
             <p className="text-gray-600 text-sm">
               {translate(language, 'myClaimsSubtitle') || 'Manage and track your reimbursement claims'}
             </p>
           </div>
         )}
 
         {/* Mobile: Status Dropdown and Inline Search */}
         {isMobile && (
           <div className="space-y-3 mb-6">
             <Select value={activeStatus} onValueChange={(value) => setActiveStatus(value)}>
               <SelectTrigger className="w-full">
                 <div className="flex items-center gap-2 w-full">
                   <Filter className="h-4 w-4" />
                   <SelectValue placeholder="Select status" />
                 </div>
               </SelectTrigger>
               <SelectContent>
                 {mobileStatuses.map((status) => {
                   const count = getClaimsByStatus(status).length;
                   const label = status === 'All' ? 'All Claims' : status;
                   return (
                     <SelectItem key={status} value={status}>
                       <div className="flex items-center justify-between w-full gap-4">
                         <span>{label}</span>
                         <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                           {count}
                         </span>
                       </div>
                     </SelectItem>
                   );
                 })}
               </SelectContent>
             </Select>
 
             {/* Inline Search Input */}
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
               <Input
                 type="text"
                 placeholder="Search claims..."
                 value={mobileSearchValue}
                 onChange={(e) => setMobileSearchValue(e.target.value)}
                 className="pl-10 pr-10"
               />
               {mobileSearchValue && (
                 <button
                   onClick={() => setMobileSearchValue('')}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                 >
                   <X className="h-4 w-4" />
                 </button>
               )}
             </div>
           </div>
         )}
 
         {/* Desktop: Status Tabs */}
         {!isMobile && (
           <div className="flex flex-wrap gap-3 mb-6">
             {desktopStatuses.map((status) => {
               const count = getClaimsByStatus(status).length;
               const isActive = activeStatus === status;
               const label = status === 'All' ? 'ALL' : status.toUpperCase();
               return (
                 <button
                   key={status}
                   type="button"
                   onClick={() => setActiveStatus(status)}
                   className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                     isActive 
                       ? 'bg-gray-200 text-gray-900' 
                       : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                   }`}
                 >
                   {label} <span className="ml-2 text-gray-500">{count}</span>
                 </button>
               );
             })}
           </div>
         )}
 
         {/* Desktop: Table View */}
         {!isMobile && (
           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
             {filteredAndSortedClaims.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                 <FileX className="h-16 w-16 mb-4" />
                 <p>{translate(language, 'noClaimsFound') || 'No claims found'}</p>
               </div>
             ) : (
               <table className="w-full">
                 <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                       <TableHeaderFilter
                         label="Claim"
                         onSort={(direction) => handleSort('claim', direction)}
                         onSearch={(value) => handleFilter('claim', value)}
                         searchPlaceholder="Search by claim no or title..."
                         currentSort={columnSort.column === 'claim' ? columnSort.direction : null}
                       />
                     </th>
                     <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                       <TableHeaderFilter
                         label="Description"
                         onSort={(direction) => handleSort('description', direction)}
                         onSearch={(value) => handleFilter('description', value)}
                         searchPlaceholder="Search description..."
                         currentSort={columnSort.column === 'description' ? columnSort.direction : null}
                       />
                     </th>
                     <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                       <TableHeaderFilter
                         label="Date"
                         onSort={(direction) => handleSort('date', direction)}
                         onSearch={(value) => handleFilter('date', value)}
                         searchPlaceholder="Search date..."
                         currentSort={columnSort.column === 'date' ? columnSort.direction : null}
                       />
                     </th>
                     <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                       <TableHeaderFilter
                         label="Amount"
                         onSort={(direction) => handleSort('amount', direction)}
                         onSearch={(value) => handleFilter('amount', value)}
                         searchPlaceholder="Search amount..."
                         currentSort={columnSort.column === 'amount' ? columnSort.direction : null}
                       />
                     </th>
                     <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                       <TableHeaderFilter
                         label="Status"
                         onSort={(direction) => handleSort('status', direction)}
                         onSearch={(value) => handleFilter('status', value)}
                         searchPlaceholder="Search status..."
                         currentSort={columnSort.column === 'status' ? columnSort.direction : null}
                       />
                     </th>
                     <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200">
                   {filteredAndSortedClaims.map((claim) => (
                     <tr key={claim.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4">
                         <div>
                           <div className="text-sm text-gray-900">{claim.claimNo}</div>
                           <div className="text-xs text-gray-500">{claim.title}</div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm text-gray-700">{claim.description}</div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm text-gray-700">{formatDate(claim.submittedDate)}</div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm text-gray-900">${claim.totalAmount.toFixed(2)}</div>
                       </td>
                       <td className="px-6 py-4">
                         <Badge 
                           variant="outline" 
                           className={`text-xs ${getStatusBadgeClass(claim.status)}`}
                         >
                           {claim.status}
                         </Badge>
                       </td>
                       <td className="px-6 py-4">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleViewClaim(claim)}
                           className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 relative z-10"
                         >
                           <Eye className="h-4 w-4 mr-1" />
                           View
                         </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
         )}
 
         {/* Mobile: Card View */}
         {isMobile && (
           <div>
             {filteredAndSortedClaims.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                 <FileX className="h-16 w-16 mb-4" />
                 <p>No claims found</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {filteredAndSortedClaims.map((claim) => (
                   <div 
                     key={claim.id}
                     className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                   >
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <div className="text-sm text-gray-900">{claim.claimNo}</div>
                         <div className="text-xs text-gray-500 mt-1">{claim.title}</div>
                       </div>
                       <Badge 
                         variant="outline" 
                         className={`text-xs ${getStatusBadgeClass(claim.status)}`}
                       >
                         {claim.status}
                       </Badge>
                     </div>
                     <div className="text-sm text-gray-700 mb-3">{claim.description}</div>
                     <div className="flex justify-between items-center">
                       <div>
                         <div className="text-xs text-gray-500">Amount</div>
                         <div className="text-sm text-gray-900">${claim.totalAmount.toFixed(2)}</div>
                       </div>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => handleViewClaim(claim)}
                         className="text-blue-600 relative z-10"
                       >
                         <Eye className="h-4 w-4 mr-1" />
                         View
                       </Button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         )}
 
         {/* Mobile: Floating Action Button (FAB) */}
         {isMobile && (user.role === 'User' || user.role === 'Supervisor') && (
           <Button
             onClick={handleCreateClaim}
             className="fixed bottom-6 right-6 z-[100] h-14 w-14 rounded-full shadow-lg bg-black hover:bg-gray-800 md:hidden pointer-events-auto"
             size="icon"
           >
             <Plus className="h-6 w-6" />
           </Button>
         )}
 
         {/* Delete Confirmation Dialog */}
         <AlertDialog open={!!claimToDelete} onOpenChange={() => setClaimToDelete(null)}>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>Delete Claim</AlertDialogTitle>
               <AlertDialogDescription>
                 Are you sure you want to delete claim {claimToDelete?.claimNo}? This action cannot be undone.
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                 Delete
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
       </div>
     </div>
   );
};
