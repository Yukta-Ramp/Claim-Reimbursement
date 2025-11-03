import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Edit, Eye, Trash2, Calendar, DollarSign, FileText, User } from 'lucide-react';

export function ClaimCard({ claim, onView, onEdit, onDelete, showUserName = false }) {
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

  const canEdit = claim.status === 'Drafted';
  const canDelete = claim.status === 'Drafted';

   return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-blue-600">{claim.claimNo}</h3>
              <Badge className={getStatusColor(claim.status)}>
                {claim.status}
              </Badge>
            </div>
            <p className="text-gray-900">{claim.title}</p>
            <p className="text-sm text-gray-500 mt-1">{claim.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {showUserName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{claim.userName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{claim.claimType}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            {claim.submittedDate 
              ? new Date(claim.submittedDate).toLocaleDateString()
              : 'Not submitted'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900">
            ${claim.totalAmount.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            ({claim.bills.length} {claim.bills.length === 1 ? 'bill' : 'bills'})
          </span>
        </div>

        {claim.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
            <p className="text-xs text-red-700">
              <span>Rejection Reason: </span>
              {claim.rejectionReason}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(claim)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        
        {canEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(claim)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        {canDelete && onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(claim)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
