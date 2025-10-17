import React, { useState, useEffect } from 'react';
import { Bill, ExpenseType, AirfareType, CarType, FuelType } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface BillFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (bill: Partial<Bill>) => void;
  bill?: Bill | null;
}

export const BillFormDialog: React.FC<BillFormDialogProps> = ({
  open,
  onClose,
  onSave,
  bill,
}) => {
  const [formData, setFormData] = useState<Partial<Bill>>({
    expenseName: '',
    expenseType: 'Generic',
    fromDate: '',
    toDate: '',
    amount: 0,
    vat: 0,
    businessJustification: '',
    merchantName: '',
    invoiceNumber: '',
    attachments: [],
  });

  useEffect(() => {
    if (bill) {
      setFormData({ ...bill, attachments: bill.attachments || [] });
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
        attachments: [],
      });
    }
  }, [bill, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

  };

  // Handle file input change for attachments
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Convert FileList to array of File objects
    const fileArray = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      attachments: fileArray,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              onValueChange={(value) => handleChange('expenseType', value as ExpenseType)}
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
                onValueChange={(value) => handleChange('airfareType', value as AirfareType)}
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
                    onValueChange={(value) => handleChange('carType', value as CarType)}
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
                    onValueChange={(value) => handleChange('fuelType', value as FuelType)}
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
          {/* Attachments Section */}
            <div className="space-y-2">
              <Label className="block font-medium mb-1">Attachments</Label>
              <div
                className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-gray-100 hover:bg-black-100 transition-colors"
                onClick={() => document.getElementById('fileInput')?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (!files) return;
                  const fileArray = Array.from(files);
                  setFormData(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), ...fileArray],
                  }));
                }}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 10-5.656-5.656l-6.586 6.586a6 6 0 108.486 8.486" /></svg>
                  <span className="font-medium text-black-700">Upload Attachments</span>
                  <span className="text-xs text-gray-500">(Images, PDFs, Docs, etc.)</span>
                </div>
              </div>
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                style={{ opacity: 0, position: 'absolute', width: '1px', height: '1px', pointerEvents: 'none' }}
                tabIndex={-1}
                onChange={handleAttachmentChange}
              />
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="text-sm text-gray-600 pt-2">
                  <div className="font-semibold mb-1">Uploaded Attachments:</div>
                  <ul className="space-y-1">
                    {formData.attachments.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={typeof file === 'string' ? file : URL.createObjectURL(file as File)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black-600 underline hover:text-black-800"
                        >
                          {typeof file === 'string' ? file.split('/').pop() : (file as File).name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
};
