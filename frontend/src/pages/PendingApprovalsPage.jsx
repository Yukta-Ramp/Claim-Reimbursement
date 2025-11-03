import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { mockClaims } from '../lib/mockData';
import { CollapsibleNavbar } from '../components/layout/CollapsibleNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Check, 
  X, 
  Eye, 
  Search, 
  Calculator,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

export const PendingApprovalsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rejectingClaim, setRejectingClaim] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  if (!user || (user.role !== 'Supervisor' && user.role !== 'Finance Approver')) {

    return null;
  }

  // Get claims pending approval based on user role
  const getPendingClaims = () => {
    if (user.role === 'Supervisor') {
      return mockClaims.filter(claim => claim.status === 'Submitted');
    } else if (user.role === 'Finance Approver') {
      return mockClaims.filter(claim => claim.status === 'Supervisor Approved');
    }
    return [];
  };

  // Get approved claims
  const getApprovedClaims = () => {
    if (user.role === 'Supervisor') {
      return mockClaims.filter(claim => 
        claim.status === 'Supervisor Approved' || 
        claim.status === 'Finance Approved' ||
        claim.status === 'Paid'
      );
    } else if (user.role === 'Finance Approver') {
      return mockClaims.filter(claim => 
        claim.status === 'Finance Approved' ||
        claim.status === 'Paid'
      );
    }
    return [];
  };

  const filterClaims = (claims) => {
    return claims.filter(claim => {
      const matchesSearch = searchTerm === '' || 
        claim.claimNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmployee = employeeFilter === '' ||
        claim.userName.toLowerCase().includes(employeeFilter.toLowerCase());
      return matchesSearch && matchesEmployee;
    });
  };

  const handleApproveClaim = (claim) => {
    const action = user.role === 'Supervisor' ? 'Supervisor approval' : 'Finance approval';
    toast.success(`Claim ${claim.claimNo} approved (${action})`);
  };

  const handleRejectClaim = (claim) => {
    setRejectingClaim(claim);
    setRejectionReason('');
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    toast.success(`Claim ${rejectingClaim?.claimNo} rejected`);
    setRejectingClaim(null);
    setRejectionReason('');
  };

  const handleRecalculate = (claim) => {
    toast.success(`Mileage recalculated for claim ${claim.claimNo}`);
  };

  const pendingClaims = filterClaims(getPendingClaims());
  const approvedClaims = filterClaims(getApprovedClaims());

  const ClaimsTable = ({ claims, showActions = true }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Claim No</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Claim Type</TableHead>
          <TableHead>Submitted Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-8">
              No claims found
            </TableCell>
          </TableRow>
        ) : (
          claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="text-blue-600">{claim.claimNo}</TableCell>
              <TableCell>{claim.userName}</TableCell>
              <TableCell>{claim.claimType}</TableCell>
              <TableCell>
                {claim.submittedDate 
                  ? new Date(claim.submittedDate).toLocaleDateString()
                  : '-'}
              </TableCell>
              <TableCell>${claim.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline">{claim.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/claims/${claim.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {showActions && (
                    <>
                      {claim.claimType === 'Cumulative Mileage' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRecalculate(claim)}
                          title="Recalculate Mileage"
                        >
                          <Calculator className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApproveClaim(claim)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRejectClaim(claim)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex">
      <CollapsibleNavbar />
      <div className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Approvals</h1>
        <p className="text-gray-600">
          Review and approve pending reimbursement claims
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by claim number or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-64 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by employee..."
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending Approvals
            <Badge variant="secondary">{pendingClaims.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            Approved Claims
            <Badge variant="secondary">{approvedClaims.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="border rounded-lg bg-white">
            <ClaimsTable claims={pendingClaims} showActions={true} />
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="border rounded-lg bg-white">
            <ClaimsTable claims={approvedClaims} showActions={false} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={!!rejectingClaim} onOpenChange={() => setRejectingClaim(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Claim</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting claim {rejectingClaim?.claimNo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingClaim(null)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
            >
              Reject Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};
