import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Edit, Trash2, Calendar, DollarSign, FileText, Paperclip } from 'lucide-react';

export function BillCard({ bill, onEdit, onDelete, readOnly = false }) {
  const getExpenseTypeColor = (type) => {
    switch (type) {
      case 'Airfare':
        return 'bg-blue-100 text-blue-700';
      case 'Mileage':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

   return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-gray-900">{bill.expenseName}</h4>
              <Badge className={getExpenseTypeColor(bill.expenseType)}>
                {bill.expenseType}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{bill.businessJustification}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-gray-700">
                {new Date(bill.fromDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">To</p>
              <p className="text-gray-700">
                {new Date(bill.toDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm pt-2">
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-gray-900">${bill.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">VAT</p>
            <p className="text-gray-900">${bill.vat.toFixed(2)}</p>
          </div>
        </div>

        {bill.merchantName && (
          <div className="text-sm pt-2">
            <p className="text-xs text-gray-500">Merchant</p>
            <p className="text-gray-700">{bill.merchantName}</p>
          </div>
        )}

        {bill.invoiceNumber && (
          <div className="text-sm">
            <p className="text-xs text-gray-500">Invoice Number</p>
            <p className="text-gray-700">{bill.invoiceNumber}</p>
          </div>
        )}

        {/* Airfare specific */}
        {bill.expenseType === 'Airfare' && bill.airfareType && (
          <div className="text-sm">
            <p className="text-xs text-gray-500">Class</p>
            <p className="text-gray-700">{bill.airfareType}</p>
          </div>
        )}

        {/* Mileage specific */}
        {bill.expenseType === 'Mileage' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-gray-700">{bill.distance} km</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Car Type</p>
              <p className="text-gray-700">{bill.carType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fuel Type</p>
              <p className="text-gray-700">{bill.fuelType}</p>
            </div>
            {bill.engineCC && (
              <div>
                <p className="text-xs text-gray-500">Engine CC</p>
                <p className="text-gray-700">{bill.engineCC}cc</p>
              </div>
            )}
          </div>
        )}

        {bill.attachments && bill.attachments.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
            <Paperclip className="h-4 w-4" />
            <span>{bill.attachments.length} attachment(s)</span>
          </div>
        )}

        {!readOnly && (
          <div className="flex gap-2 pt-3 border-t mt-3">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(bill)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(bill)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
