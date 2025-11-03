import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CollapsibleNavbar } from '../components/layout/CollapsibleNavbar';
import { UserManagementPanel } from '../components/admin/UserManagementPanel';
import { MileageRatesPanel } from '../components/admin/MileageRatesPanel';
import { ReportsPanel } from '../components/admin/ReportsPanel';
import { Users, DollarSign, FileText } from 'lucide-react';

export const AdminPage = () => {
  const { user } = useAuth();

  if (!user || (user.role !== 'Finance Approver' && user.role !== 'Super Admin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex">
      <CollapsibleNavbar />
      <div className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-600">
          Manage users, mileage rates, and generate reports
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="mileage" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Mileage Rates
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagementPanel />
        </TabsContent>

        <TabsContent value="mileage">
          <MileageRatesPanel />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsPanel />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};
