import React, { useState } from 'react';
import { mockUsers, mockEntities } from '../../lib/mockData.js';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Card, CardContent } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.jsx';
import { Label } from '../ui/label.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import { Checkbox } from '../ui/checkbox.jsx';
import { Edit, Plus, Search, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const UserManagementPanel = () => {


  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'User',
    entity: '',
    currency: 'USD',
    costCenter: '',
    department: '',
    supervisorId: '',
    hasReportAccess: false,
  });

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'User',
      entity: mockEntities[0].name,
      currency: mockEntities[0].currency,
      costCenter: '',
      department: '',
      supervisorId: '',
      hasReportAccess: false,
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-update currency when entity changes
    if (field === 'entity') {
      const entity = mockEntities.find(e => e.name === value);
      if (entity) {
        setFormData(prev => ({ ...prev, currency: entity.currency }));
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.entity) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (editingUser) {
      toast.success('User updated successfully');
    } else {
      toast.success('User created successfully');
    }
    setIsDialogOpen(false);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'default';
      case 'Finance Approver':
        return 'secondary';
      case 'Supervisor':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900">{user.firstName} {user.lastName}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entity</span>
                  <span className="text-gray-900">{user.entity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="text-gray-900">{user.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cost Center</span>
                  <span className="text-gray-900">{user.costCenter}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              Fill in the user details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity">Entity *</Label>
                <Select
                  value={formData.entity}
                  onValueChange={(value) => handleChange('entity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEntities.map(entity => (
                      <SelectItem key={entity.id} value={entity.name}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costCenter">Cost Center *</Label>
                <Input
                  id="costCenter"
                  value={formData.costCenter}
                  onChange={(e) => handleChange('costCenter', e.target.value)}
                  placeholder="e.g., CC-1001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Finance Approver">Finance Approver</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorId">Supervisor</Label>
                <Select
                  value={formData.supervisorId}
                  onValueChange={(value) => handleChange('supervisorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(u => u.role === 'Supervisor' && u.id !== editingUser?.id)
                      .map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.firstName} {supervisor.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasReportAccess"
                checked={formData.hasReportAccess || false}
                onCheckedChange={(checked) => handleChange('hasReportAccess', checked)}
              />
              <Label htmlFor="hasReportAccess" className="cursor-pointer">
                Access to Reports
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
