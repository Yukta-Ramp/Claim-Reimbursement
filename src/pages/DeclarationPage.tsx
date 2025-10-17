import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bill, ClaimType } from '../types';
import { mockDeclarations } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LocationState {
  claimTitle: string;
  claimDescription: string;
  claimType: ClaimType;
  bills: Bill[];
}

export const DeclarationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [acceptedDeclarations, setAcceptedDeclarations] = useState<Record<string, boolean>>({});

  if (!state) {
    navigate('/');
    return null;
  }

  const declarations = mockDeclarations[state.claimType] || [];

  const handleToggleDeclaration = (declarationId: string) => {
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
      toast.error('Please accept all declarations to proceed');
      return;
    }
    
    toast.success('Claim submitted successfully!');
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
            Please review and accept the following declarations
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
                <p className="text-sm text-gray-500">Number of Bills</p>
                <p className="text-gray-900">{state.bills.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
            {state.claimDescription && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-900">{state.claimDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Declarations */}
        <Card>
          <CardHeader>
            <CardTitle>Declarations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {declarations.map((declaration, index) => (
              <div key={declaration.id} className="flex items-start space-x-3">
                <Checkbox
                  id={declaration.id}
                  checked={acceptedDeclarations[declaration.id] || false}
                  onCheckedChange={() => handleToggleDeclaration(declaration.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={declaration.id}
                    className="cursor-pointer text-gray-700"
                  >
                    <span className="mr-2">{index + 1}.</span>
                    {declaration.text}
                  </Label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              By submitting this claim, you confirm that all information provided is accurate
              and complete. False claims may result in disciplinary action.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allDeclarationsAccepted}
            className="flex-1 gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Claim
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};
