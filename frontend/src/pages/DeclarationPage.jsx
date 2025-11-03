import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockDeclarations } from '../lib/mockData';
import { CollapsibleNavbar } from '../components/layout/CollapsibleNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

export const DeclarationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [acceptedDeclarations, setAcceptedDeclarations] = useState({});

  if (!state) {
    navigate('/');
    return null;
  }

  const declarations = mockDeclarations[state.claimType] || [];

  const handleToggleDeclaration = (declarationId) => {
    setAcceptedDeclarations(prev => ({
      ...prev,
      [declarationId]: !prev[declarationId],
    }));
  };

  const allDeclarationsAccepted = declarations.every(
    declaration => acceptedDeclarations[declaration.id]
  );

  const handleSubmit = () => {
    if (!allDeclarationsAccepted) {
      toast.error('Error submitting declaration.');
      return;
    }
    toast.success('Declaration submitted successfully.');
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const totalAmount = state.bills.reduce((sum, bill) => sum + bill.amount + bill.vat, 0);

  return (

    <div className="flex">
      <CollapsibleNavbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-gray-900">Declaration</h1>
          <p className="text-gray-600">
            Please review and confirm your claim details below.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Claim Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Claim Title</p>
                <p className="text-gray-900">{state.claimTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Claim Type</p>
                <p className="text-gray-900">{state.claimType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bills</p>
                <p className="text-gray-900">{state.bills.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Declarations */}
        <Card>
          <CardHeader>
            <CardTitle>Declarations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {declarations.map(declaration => (
              <div key={declaration.id} className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox
                  id={declaration.id}
                  checked={acceptedDeclarations[declaration.id] || false}
                  onCheckedChange={() => handleToggleDeclaration(declaration.id)}
                />
                <Label
                  htmlFor={declaration.id}
                  className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                >
                  {declaration.text}
                </Label>
              </div>
            ))}
            {!allDeclarationsAccepted && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Accept all declarations
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allDeclarationsAccepted}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Claim
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};
