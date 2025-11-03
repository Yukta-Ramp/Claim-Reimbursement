import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockClaims } from '../lib/mockData';
import { CollapsibleNavbar } from '../components/layout/CollapsibleNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

export const ClaimDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isClaimInfoOpen, setIsClaimInfoOpen] = useState(true);
  const [isBillsOpen, setIsBillsOpen] = useState(true);

  // Find claim by ID
  const claim = mockClaims.find(c => c.id === id);

  if (!claim) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-600 mb-4">No claims match your search.</p>
          <Button onClick={() => navigate('/')}> <ArrowLeft className="h-4 w-4 mr-2" /> Back </Button>
        </div>
      </div>
    );
  }

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

  const totalVAT = claim.bills.reduce((sum, bill) => sum + bill.vat, 0);

  return (

    <div className="flex">
      <CollapsibleNavbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-gray-900 mb-1">Claim Details</h1>
          <p className="text-gray-600">{claim.claimNo}</p>
        </div>
      </div>

      {/* Claim Information - Collapsible */}
      <Collapsible
        open={isClaimInfoOpen}
        onOpenChange={setIsClaimInfoOpen}
        className="mb-6"
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-700">Claim Info</CardTitle>
                {isClaimInfoOpen ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                {/* Row 1 */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Claim Number</p>
                  <p className="text-gray-900">{claim.claimNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted By</p>
                  <p className="text-gray-900">{claim.userName}</p>
                </div>

                {/* Row 2 */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Claim Title</p>
                  <p className="text-gray-900">{claim.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Claim Type</p>
                  <p className="text-gray-900">{claim.claimType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Entity</p>
                  <p className="text-gray-900">{claim.entity}</p>
                </div>

                {/* Row 3 */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted Date</p>
                  <p className="text-gray-900">
                    {claim.submittedDate 
                      ? new Date(claim.submittedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-gray-900">${claim.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">VAT</p>
                  <p className="text-gray-900">${totalVAT.toFixed(2)}</p>
                </div>

                {/* Description - Full Width */}
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {claim.description || 'No description available.'}
                  </p>
                </div>

                {/* Additional dates if available */}
                {claim.supervisorApprovedDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Supervisor Approval</p>
                    <p className="text-gray-900">
                      {new Date(claim.supervisorApprovedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {claim.financeApprovedDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Finance Approval</p>
                    <p className="text-gray-900">
                      {new Date(claim.financeApprovedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {claim.paidDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment</p>
                    <p className="text-gray-900">
                      {new Date(claim.paidDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              {claim.rejectionReason && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-900 mb-1">Rejection Reason</p>
                  <p className="text-red-700">{claim.rejectionReason}</p>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Bills - Collapsible */}
      <Collapsible
        open={isBillsOpen}
        onOpenChange={setIsBillsOpen}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-700">
                  Bills ({claim.bills.length})
                </CardTitle>
                {isBillsOpen ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-6">
              {claim.bills.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No bills available.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Expense Name</TableHead>
                        <TableHead>Expense Type</TableHead>
                        <TableHead>From Date</TableHead>
                        <TableHead>To Date</TableHead>
                        <TableHead>Merchant Name</TableHead>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">VAT</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claim.bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>
                            <div>
                              <p className="text-gray-900">{bill.expenseName}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {bill.businessJustification}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{bill.expenseType}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(bill.fromDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(bill.toDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {bill.merchantName || '-'}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {bill.invoiceNumber || '-'}
                          </TableCell>
                          <TableCell className="text-right text-gray-900">
                            ${bill.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            ${bill.vat.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-gray-900">
                            ${(bill.amount + bill.vat).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Total Row */}
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={6} className="text-right text-gray-700">
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          <strong>
                            ${claim.bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                          </strong>
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          <strong>${totalVAT.toFixed(2)}</strong>
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          <strong>${claim.totalAmount.toFixed(2)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      </div>
    </div>
  );
};
