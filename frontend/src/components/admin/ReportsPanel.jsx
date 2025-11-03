import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { mockClaims, mockEntities } from '../../lib/mockData.js';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Checkbox } from '../ui/checkbox.jsx';
import { Badge } from '../ui/badge.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Download, DollarSign, Search, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const ReportsPanel = () => {
  // ...existing code...
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by claim no or employee..."
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {mockEntities.map(entity => (
              <SelectItem key={entity.id} value={entity.name}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Drafted">Drafted</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Supervisor Approved">Supervisor Approved</SelectItem>
            <SelectItem value="Finance Approved">Finance Approved</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {selectedClaims.size} claim(s) selected
          </p>
          {selectedClaims.size > 0 && (
            <p className="text-sm">
              <span className="text-gray-600">Total: </span>
              <span className="text-gray-900">${totalSelected.toFixed(2)}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={selectedClaims.size === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          {user.role === 'Finance Approver' && (
            <Button
              onClick={handleMarkAsPaid}
              disabled={selectedClaims.size === 0}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Claims Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedClaims.size === filteredClaims.length && filteredClaims.length > 0}
                  onCheckedChange={handleToggleAll}
                />
              </TableHead>
              <TableHead>Claim No</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Expense Type</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClaims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  No claims found matching the filters
                </TableCell>
              </TableRow>
            ) : (
              filteredClaims.map(claim => (
                <TableRow key={claim.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedClaims.has(claim.id)}
                      onCheckedChange={() => handleToggleClaim(claim.id)}
                    />
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {claim.claimNo}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {claim.userName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {claim.claimType}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {claim.entity}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {claim.submittedDate 
                      ? new Date(claim.submittedDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${claim.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(claim.status)}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500 mb-1">Total Claims</p>
          <p className="text-gray-900">{filteredClaims.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-gray-900">
            ${filteredClaims.reduce((sum, claim) => sum + claim.totalAmount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
          <p className="text-gray-900">
            {filteredClaims.filter(c => c.status === 'Submitted' || c.status === 'Supervisor Approved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500 mb-1">Paid</p>
          <p className="text-gray-900">
            {filteredClaims.filter(c => c.status === 'Paid').length}
          </p>
        </div>
      </div>
    </div>
  );
}
