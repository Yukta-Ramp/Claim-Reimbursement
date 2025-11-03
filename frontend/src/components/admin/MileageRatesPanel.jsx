import React, { useState } from 'react';
import { mockMileageRates, mockEntities } from '../../lib/mockData.js';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Badge } from '../ui/badge.jsx';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const MileageRatesPanel = () => {
  const [selectedEntity, setSelectedEntity] = useState(mockEntities[0]);
  const [rates, setRates] = useState(mockMileageRates);
  const [editingRateId, setEditingRateId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const entityRates = rates.filter(rate => {
    const entity = mockEntities.find(e => e.id === rate.entityId);
    return entity?.name === selectedEntity.name;
  });

  const handleEditRate = (rate) => {
    setEditingRateId(rate.id);
    setEditValue(rate.rateValue.toString());
  };

  const handleSaveRate = (rateId) => {
    const newValue = parseFloat(editValue);
    if (isNaN(newValue) || newValue < 0) {
      toast.error('Please enter a valid rate value');
      return;
    }
    setRates(rates.map(rate => 
      rate.id === rateId 
        ? { ...rate, rateValue: newValue }
        : rate
    ));
    setEditingRateId(null);
    toast.success('Mileage rate updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingRateId(null);
    setEditValue('');
  };


    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Entity Selection */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Entities</h3>
          {mockEntities.map(entity => (
            <Card
              key={entity.id}
              className={`cursor-pointer transition-all ${
                selectedEntity.id === entity.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => setSelectedEntity(entity)}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">{entity.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Currency: {entity.currency}
                    </p>
                  </div>
                  {selectedEntity.id === entity.id && (
                    <Badge>Selected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mileage Rates Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Mileage Rates - {selectedEntity.name}
                </CardTitle>
                <Badge variant="outline">
                  {selectedEntity.currency}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rate Type</TableHead>
                    <TableHead>Rate Value (per km)</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entityRates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        No mileage rates configured for this entity
                      </TableCell>
                    </TableRow>
                  ) : (
                    entityRates.map(rate => (
                      <TableRow key={rate.id}>
                        <TableCell className="text-gray-900">
                          {rate.rateType}
                        </TableCell>
                        <TableCell>
                          {editingRateId === rate.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-32"
                              autoFocus
                            />
                          ) : (
                            <span className="text-gray-900">
                              {selectedEntity.currency} {rate.rateValue.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(rate.effectiveDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingRateId === rate.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveRate(rate.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRate(rate)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {entityRates.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-900">
                    <span>Note: </span>
                    Changes to mileage rates will apply to future claims only. 
                    Existing claims will retain their original rate calculations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
