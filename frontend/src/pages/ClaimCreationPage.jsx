import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CollapsibleNavbar } from '../components/layout/CollapsibleNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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
import { BillFormDialog } from '../components/claims/BillFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { ArrowLeft, Plus, ChevronDown, ChevronRight, Pencil, Trash2, Paperclip } from 'lucide-react';
import { toast } from 'sonner';

export const ClaimCreationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [claimTitle, setClaimTitle] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [claimType, setClaimType] = useState('General');
  const [bills, setBills] = useState([]);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [isClaimInfoOpen, setIsClaimInfoOpen] = useState(true);
  const [isBillsOpen, setIsBillsOpen] = useState(true);

  if (!user) return null;

  const handleAddBill = () => {
    setEditingBill(null);
    setIsBillDialogOpen(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setIsBillDialogOpen(true);
  };

  const handleSaveBill = (billData) => {

    if (editingBill) {
      // Update existing bill
      setBills(bills.map(b => b.id === editingBill.id ? { ...b, ...billData } : b));
      toast.success('Bill updated successfully');
    } else {
      // Add new bill
      const { id, ...billDataWithoutId } = billData;
      const newBill = {
        id: `bill-${Date.now()}`,
        ...billDataWithoutId,
      };
      setBills([...bills, newBill]);
      toast.success('Bill added successfully');
    }
  };

  const handleDeleteBill = (bill) => {
    setBillToDelete(bill);
  };

  const confirmDeleteBill = () => {
    if (billToDelete) {
      setBills(bills.filter(b => b.id !== billToDelete.id));
      toast.success('Bill deleted successfully');
      setBillToDelete(null);
    }
  };

  const handleSaveDraft = () => {
    if (!claimTitle.trim()) {
      toast.error('Please enter a claim title');
      return;
    }
    toast.success('Claim saved as draft');
    navigate('/');
  };

  const handleSubmit = () => {
    if (!claimTitle.trim()) {
      toast.error('Please enter a claim title');
      return;
    }
    if (bills.length === 0) {
      toast.error('Please add at least one bill');
      return;
    }
    // Navigate to declaration page
    navigate('/claims/declaration', {
      state: {
        claimTitle,
        claimDescription,
        claimType,
        bills,
      },
    });
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalVAT = bills.reduce((sum, bill) => sum + bill.vat, 0);
  const grandTotal = totalAmount + totalVAT;

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
            <h1 className="text-gray-900 mb-1">
              {isEditing ? 'Edit Claim' : 'Create New Claim'}
            </h1>
            <p className="text-gray-600">
              Fill in the details to submit your expense claim
            </p>
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
              <CardHeader className="cursor-pointer transition-colors py-5 bg-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-700">Claim Information</CardTitle>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="claimTitle">Claim Title *</Label>
                    <Input
                      id="claimTitle"
                      value={claimTitle}
                      onChange={(e) => setClaimTitle(e.target.value)}
                      placeholder="Text"
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="claimType">Claim Type *</Label>
                    <Select
                      value={claimType}
                      onValueChange={(value) => setClaimType(value)}
                    >
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Mileage">Mileage</SelectItem>
                        <SelectItem value="Cumulative Mileage">Cumulative Mileage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimDescription">Claim Description</Label>
                  <Textarea
                    id="claimDescription"
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    placeholder="Text"
                    rows={4}
                    className="bg-gray-50"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Bills - Collapsible */}
        <Collapsible
          open={isBillsOpen}
          onOpenChange={setIsBillsOpen}
          className="mb-6"
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer transition-colors py-5 bg-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-700">Bills</CardTitle>
                  {isBillsOpen ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2">
                {/* Add Bill Button */}
                <div className="mb-4 flex justify-end">
                  <Button
                    onClick={handleAddBill}
                    className="bg-black hover:bg-gray-800 px-4 py-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bill
                  </Button>
                </div>
                {bills.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No bills added yet. Click "Add Bill" to get started.</p>
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
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">VAT</TableHead>
                          <TableHead>Business Justification</TableHead>
                          <TableHead className="text-center">Attachments</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bills.map((bill) => (
                          <TableRow key={bill.id}>
                            <TableCell className="text-gray-900">{bill.expenseName}</TableCell>
                            <TableCell className="text-gray-600">{bill.expenseType}</TableCell>
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
                            <TableCell className="text-right text-gray-900">
                              ${bill.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right text-gray-600">
                              ${bill.vat.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-gray-600 max-w-xs truncate">
                              {bill.businessJustification}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Paperclip className="h-4 w-4 mr-1" />
                                {bill.attachments?.length || 0}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditBill(bill)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteBill(bill)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Totals Section */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                      <div className="flex justify-end gap-12">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total Amount:</p>
                          <p className="text-gray-900">${totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total VAT:</p>
                          <p className="text-gray-900">${totalVAT.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Grand Total:</p>
                          <p className="text-gray-900">${grandTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={!claimTitle.trim()}
              className="gap-2"
            >
              Save Draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!claimTitle.trim() || bills.length === 0}
              className="bg-black hover:bg-gray-800 gap-2"
            >
              Submit Claim
            </Button>
          </div>
        </div>

        {/* Bill Form Dialog */}
        <BillFormDialog
          open={isBillDialogOpen}
          onClose={() => setIsBillDialogOpen(false)}
          onSave={handleSaveBill}
          bill={editingBill}
        />

        {/* Delete Bill Confirmation */}
        <AlertDialog open={!!billToDelete} onOpenChange={() => setBillToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this bill? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteBill} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
