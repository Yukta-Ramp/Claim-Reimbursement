import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Textarea } from '../ui/textarea.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import { Checkbox } from '../ui/checkbox.jsx';

export function BillFormDialog({ open, onClose, onSave, bill }) {
  const [formData, setFormData] = useState({
    expenseName: '',
    expenseType: 'Generic',
    fromDate: '',
    toDate: '',
    amount: 0,
    vat: 0,
    businessJustification: '',
    merchantName: '',
    invoiceNumber: '',
  });

  useEffect(() => {
    if (bill) {
      setFormData(bill);
    } else {
      setFormData({
        expenseName: '',
        expenseType: 'Generic',
        fromDate: '',
        toDate: '',
        amount: 0,
        vat: 0,
        businessJustification: '',
        merchantName: '',
        invoiceNumber: '',
      });
    }
  }, [bill, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

   return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bill ? 'Edit Bill' : 'Add New Bill'}</DialogTitle>
          <DialogDescription>
            Fill in the expense details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Expense Name */}
          <div className="space-y-2">
            <Label htmlFor="expenseName">Expense Name *</Label>
            <Input
              id="expenseName"
              value={formData.expenseName}
              onChange={(e) => handleChange('expenseName', e.target.value)}
              placeholder="e.g., Flight to NYC"
            />
          </div>

          {/* Expense Type */}
          <div className="space-y-2">
            <Label htmlFor="expenseType">Expense Type *</Label>
            <Select
              value={formData.expenseType}
              onValueChange={(value) => handleChange('expenseType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Generic">Generic</SelectItem>
                <SelectItem value="Airfare">Airfare</SelectItem>
                <SelectItem value="Mileage">Mileage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date *</Label>
              <Input
                id="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleChange('fromDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date *</Label>
              <Input
                id="toDate"
                type="date"
                value={formData.toDate}
                onChange={(e) => handleChange('toDate', e.target.value)}
              />
            </div>
          </div>

          {/* Amount and VAT */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vat">VAT</Label>
              <Input
                id="vat"
                type="number"
                step="0.01"
                value={formData.vat}
                onChange={(e) => handleChange('vat', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Business Justification */}
          <div className="space-y-2">
            <Label htmlFor="businessJustification">Business Justification *</Label>
            <Textarea
              id="businessJustification"
              value={formData.businessJustification}
              onChange={(e) => handleChange('businessJustification', e.target.value)}
              placeholder="Explain the business purpose of this expense"
              rows={3}
            />
          </div>

          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="merchantName">Merchant Name</Label>
            <Input
              id="merchantName"
              value={formData.merchantName}
              onChange={(e) => handleChange('merchantName', e.target.value)}
              placeholder="e.g., Delta Airlines"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              placeholder="e.g., INV-12345"
            />
          </div>

          {/* Airfare Specific Fields */}
          {formData.expenseType === 'Airfare' && (
            <div className="space-y-2">
              <Label htmlFor="airfareType">Airfare Class *</Label>
              <Select
                value={formData.airfareType}
                onValueChange={(value) => handleChange('airfareType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mileage Specific Fields */}
          {formData.expenseType === 'Mileage' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carType">Car Type *</Label>
                  <Select
                    value={formData.carType}
                    onValueChange={(value) => handleChange('carType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Rental">Rental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => handleChange('fuelType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km) *</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={formData.distance || ''}
                    onChange={(e) => handleChange('distance', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineCC">Engine CC</Label>
                  <Input
                    id="engineCC"
                    type="number"
                    value={formData.engineCC || ''}
                    onChange={(e) => handleChange('engineCC', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 2000"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reducedRate"
                  checked={formData.reducedRate || false}
                  onCheckedChange={(checked) => handleChange('reducedRate', checked)}
                />
                <Label htmlFor="reducedRate" className="cursor-pointer">
                  Apply Reduced Rate
                </Label>
              </div>
            </>
          )}

          {/* Attachments Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            <p>Note: File attachments would be handled through file upload in production.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {bill ? 'Update Bill' : 'Add Bill'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
