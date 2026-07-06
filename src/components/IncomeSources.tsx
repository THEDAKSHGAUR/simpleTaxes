import { useState } from 'react';
import { Plus, Trash2, Briefcase, TrendingUp, Building2, Landmark, Wallet } from 'lucide-react';
import { useTaxData, IncomeSourceData } from '../contexts/TaxDataContext';

export default function IncomeSources() {
  const { taxData, updateTaxData, saving } = useTaxData();
  const incomeSources = taxData.income_sources;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSource, setNewSource] = useState<Partial<IncomeSourceData>>({
    type: 'salary',
    name: '',
    amount: 0,
  });

  const incomeTypes = [
    { value: 'salary', label: 'Salary', icon: Briefcase },
    { value: 'business', label: 'Business/Professional', icon: TrendingUp },
    { value: 'rental', label: 'Rental Income', icon: Building2 },
    { value: 'interest', label: 'Interest Income', icon: Landmark },
    { value: 'capital_gains', label: 'Capital Gains', icon: Wallet },
    { value: 'other', label: 'Other Income', icon: Wallet },
  ];

  const addIncomeSource = () => {
    if (newSource.name && newSource.amount && newSource.amount > 0) {
      const source: IncomeSourceData = {
        id: Date.now().toString(),
        type: newSource.type as IncomeSourceData['type'],
        name: newSource.name,
        amount: newSource.amount,
        details: newSource.details,
      };
      updateTaxData({ income_sources: [...incomeSources, source] });
      setNewSource({ type: 'salary', name: '', amount: 0 });
      setShowAddForm(false);
    }
  };

  const removeIncomeSource = (id: string) => {
    updateTaxData({ income_sources: incomeSources.filter((source) => source.id !== id) });
  };

  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Income Sources</h2>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-gray-400">Saving...</span>}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Total Income Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <p className="text-sm opacity-90">Total Gross Income</p>
        <p className="text-4xl font-bold">₹{totalIncome.toLocaleString('en-IN')}</p>
        <p className="text-sm opacity-90 mt-2">Current Financial Year</p>
      </div>

      {/* Add Income Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Income Source</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Income Type</label>
              <select
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value as IncomeSourceData['type'] })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {incomeTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Name</label>
              <input
                type="text"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="e.g., Salary from ABC Company"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={newSource.amount || ''}
                onChange={(e) => setNewSource({ ...newSource, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {newSource.type === 'salary' && <SalaryDetailsForm onChange={(details) => setNewSource({ ...newSource, details })} />}
            {newSource.type === 'rental' && <RentalDetailsForm onChange={(details) => setNewSource({ ...newSource, details })} />}
            <div className="flex space-x-4">
              <button
                onClick={addIncomeSource}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Income Source
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Income Sources List */}
      {incomeSources.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {incomeSources.map((source) => {
                const Icon = incomeTypes.find(t => t.value === source.type)?.icon || Wallet;
                return (
                  <tr key={source.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {incomeTypes.find(t => t.value === source.type)?.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{source.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ₹{source.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => removeIncomeSource(source.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No income sources added yet. Click "Add Income" to get started.</p>
        </div>
      )}
    </div>
  );
}

function SalaryDetailsForm({ onChange }: { onChange: (details: any) => void }) {
  const [details, setDetails] = useState({
    basic: 0,
    hra: 0,
    specialAllowance: 0,
    otherAllowances: 0,
    professionalTax: 0,
    employerPF: 0,
  });

  const handleChange = (field: string, value: number) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onChange(newDetails);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
      <h4 className="font-medium text-gray-700">Salary Breakdown (Optional)</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Basic Salary</label>
          <input
            type="number"
            value={details.basic || ''}
            onChange={(e) => handleChange('basic', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">HRA</label>
          <input
            type="number"
            value={details.hra || ''}
            onChange={(e) => handleChange('hra', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Special Allowance</label>
          <input
            type="number"
            value={details.specialAllowance || ''}
            onChange={(e) => handleChange('specialAllowance', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Professional Tax</label>
          <input
            type="number"
            value={details.professionalTax || ''}
            onChange={(e) => handleChange('professionalTax', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function RentalDetailsForm({ onChange }: { onChange: (details: any) => void }) {
  const [details, setDetails] = useState({
    rentReceived: 0,
    municipalTax: 0,
    standardDeduction: 0,
    interestOnLoan: 0,
  });

  const handleChange = (field: string, value: number) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onChange(newDetails);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
      <h4 className="font-medium text-gray-700">Rental Income Details (Optional)</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Rent Received</label>
          <input
            type="number"
            value={details.rentReceived || ''}
            onChange={(e) => handleChange('rentReceived', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Municipal Tax Paid</label>
          <input
            type="number"
            value={details.municipalTax || ''}
            onChange={(e) => handleChange('municipalTax', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Interest on Home Loan</label>
          <input
            type="number"
            value={details.interestOnLoan || ''}
            onChange={(e) => handleChange('interestOnLoan', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
