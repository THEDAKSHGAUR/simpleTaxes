import { useState } from 'react';
import { Home, Calculator, Info } from 'lucide-react';
import { calculateHRAExemption, formatCurrency } from '../lib/tax-utils';

export default function HRACalculator() {
  const [hraReceived, setHraReceived] = useState(0);
  const [rentPaid, setRentPaid] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);
  const [cityType, setCityType] = useState<'metro' | 'non-metro'>('metro');

  const exemption = calculateHRAExemption({
    hraReceived,
    rentPaid,
    basicSalary,
    cityType,
  });

  const conditions = [
    {
      label: 'Actual HRA Received',
      value: hraReceived,
      isMet: true,
    },
    {
      label: 'Rent Paid minus 10% of Basic Salary',
      value: Math.max(0, rentPaid - 0.1 * basicSalary),
      isMet: rentPaid > 0.1 * basicSalary,
    },
    {
      label: cityType === 'metro' ? '50% of Basic Salary (Metro)' : '40% of Basic Salary (Non-Metro)',
      value: cityType === 'metro' ? 0.5 * basicSalary : 0.4 * basicSalary,
      isMet: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">HRA Exemption Calculator</h2>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About HRA Exemption</p>
            <p>
              House Rent Allowance (HRA) exemption is calculated as the minimum of:
              1) Actual HRA received, 2) Rent paid minus 10% of basic salary, 3) 50% of basic salary for metro cities or 40% for non-metro cities.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter Your Salary Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (Annual) (₹)</label>
            <input
              type="number"
              value={basicSalary || ''}
              onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
              placeholder="Enter basic salary"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HRA Received (Annual) (₹)</label>
            <input
              type="number"
              value={hraReceived || ''}
              onChange={(e) => setHraReceived(parseFloat(e.target.value) || 0)}
              placeholder="Enter HRA received"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rent Paid (Annual) (₹)</label>
            <input
              type="number"
              value={rentPaid || ''}
              onChange={(e) => setRentPaid(parseFloat(e.target.value) || 0)}
              placeholder="Enter total rent paid"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City Type</label>
            <select
              value={cityType}
              onChange={(e) => setCityType(e.target.value as 'metro' | 'non-metro')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="metro">Metro City (50% limit)</option>
              <option value="non-metro">Non-Metro City (40% limit)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {basicSalary > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">HRA Exemption Calculation</h3>
            
            <div className="space-y-4">
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${condition.isMet ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Calculator className={`w-5 h-5 ${condition.isMet ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <span className="text-gray-700">{condition.label}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(condition.value)}</span>
                </div>
              ))}

              <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home className="w-6 h-6 mr-2" />
                    <span className="font-medium">Total HRA Exemption</span>
                  </div>
                  <span className="text-2xl font-bold">{formatCurrency(exemption)}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxable HRA</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(Math.max(0, hraReceived - exemption))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips to Maximize HRA Exemption</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Pay rent to your parents and get a rent receipt to claim HRA</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">If you live in a metro city, ensure you claim 50% of basic salary as exemption</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Keep rent receipts and rent agreement as proof for IT department</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">If rent exceeds ₹1 lakh annually, provide landlord's PAN to employer</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">HRA exemption is not available if you live in your own house</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
