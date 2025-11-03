import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.jsx';
import { Badge } from '../ui/badge.jsx';
import { BillCard } from './BillCard.jsx';
import { ScrollArea } from '../ui/scroll-area.jsx';
import { Separator } from '../ui/separator.jsx';

export function ClaimDetailsDialog({ open, onClose, claim }) {
  if (!claim) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Drafted':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Submitted':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Supervisor Approved':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Finance Approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Paid':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{claim.claimNo}</DialogTitle>
            <Badge className={getStatusColor(claim.status)}>
              {claim.status}
            </Badge>
          </div>
          <DialogDescription>{claim.title}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Claim Information */}
            <div>
              <h4 className="text-gray-900 mb-3">Claim Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Employee</p>
                  <p className="text-gray-900">{claim.userName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Claim Type</p>
                  <p className="text-gray-900">{claim.claimType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Entity</p>
                  <p className="text-gray-900">{claim.entity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="text-gray-900">${claim.totalAmount.toFixed(2)}</p>
                </div>
                {claim.submittedDate && (
                  <div>
                    <p className="text-gray-500">Submitted Date</p>
                    <p className="text-gray-900">
                      {new Date(claim.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {claim.supervisorApprovedDate && (
                  <div>
                    <p className="text-gray-500">Supervisor Approved</p>
                    <p className="text-gray-900">
                      {new Date(claim.supervisorApprovedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {claim.financeApprovedDate && (
                  <div>
                    <p className="text-gray-500">Finance Approved</p>
                    <p className="text-gray-900">
                      {new Date(claim.financeApprovedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {claim.paidDate && (
                  <div>
                    <p className="text-gray-500">Paid Date</p>
                    <p className="text-gray-900">
                      {new Date(claim.paidDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-sm">Description</p>
                <p className="text-gray-900">{claim.description}</p>
              </div>
            </div>

            <Separator />

            {/* Bills */}
            <div>
              <h4 className="text-gray-900 mb-3">
                Bills ({claim.bills.length})
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {claim.bills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} readOnly />
                ))}
              </div>
            </div>

            {claim.rejectionReason && (
              <>
                <Separator />
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="text-red-900 mb-2">Rejection Reason</h4>
                  <p className="text-red-700">{claim.rejectionReason}</p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
