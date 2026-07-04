import { useState } from 'react';
import { Shield, Plus, Trash2, Info } from 'lucide-react';
import { DEDUCTION_SECTIONS, formatCurrency } from '../lib/tax-utils';

export interface DeductionEntry {
  id: string;
  section: string;
  name: string;
  amount: number;
  description: string;
}

export default function Deductions() {
  const [deductions, setDeductions] = useState<DeductionEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [newDeduction, setNewDeduction] = useState({
    name: '',
    amount: 0,
    description: '',
  });

  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

  const addDeduction = () => {
    if (selectedSection && newDeduction.name && newDeduction.amount > 0) {
      const section = DEDUCTION_SECTIONS.find(s => s.section === selectedSection);
      if (section) {
        const entry: DeductionEntry = {
          id: Date.now().toString(),
          section: selectedSection,
          name: newDeduction.name,
          amount: newDeduction.amount,
          description: newDeduction.description || section.description,
        };
        setDeductions([...deductions, entry]);
        setNewDeduction({ name: '', amount: 0, description: '' });
        setSelectedSection('');
        setShowAddForm(false);
      }
    }
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const getSectionTotal = (section: string) => {
    const sectionInfo = DEDUCTION_SECTIONS.find(s => s.section === section);
    const sectionDeductions = deductions.filter(d => d.section === section);
    const total = sectionDeductions.reduce((sum, d) => sum + d.amount, 0);
    return {
      total,
      limit: sectionInfo?.maxLimit || null,
      remaining: sectionInfo?.maxLimit ? sectionInfo.maxLimit - total : null,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Deductions & Exemptions</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Deduction</span>
        </button>
      </div>

      {/* Total Deductions Summary */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md p-6 text-white">
        <p className="text-sm opacity-90">Total Deductions Claimed</p>
        <p className="text-4xl font-bold">{formatCurrency(totalDeductions)}</p>
        <p className="text-sm opacity-90 mt-2">Under various sections</p>
      </div>

      {/* Section-wise Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Section-wise Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEDUCTION_SECTIONS.slice(0, 6).map((section) => {
            const { total, limit, remaining } = getSectionTotal(section.section);
            const percentage = limit ? (total / limit) * 100 : 0;
            return (
              <div key={section.section} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{section.section}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {limit ? formatCurrency(total) + ' / ' + formatCurrency(limit) : formatCurrency(total)}
                  </span>
                </div>
                {limit && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                )}
                {limit && remaining !== null && (
                  <p className={`text-xs mt-2 ${remaining < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {remaining < 0 ? `Over limit by ${formatCurrency(Math.abs(remaining))}` : `Remaining: ${formatCurrency(remaining)}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deduction Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Deduction</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a section</option>
                {DEDUCTION_SECTIONS.map(section => (
                  <option key={section.section} value={section.section}>
                    {section.section} - {section.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedSection && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    {DEDUCTION_SECTIONS.find(s => s.section === selectedSection)?.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment/Expense Name</label>
                  <input
                    type="text"
                    value={newDeduction.name}
                    onChange={(e) => setNewDeduction({ ...newDeduction, name: e.target.value })}
                    placeholder="e.g., PPF Contribution, LIC Premium"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={newDeduction.amount || ''}
                    onChange={(e) => setNewDeduction({ ...newDeduction, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <input
                    type="text"
                    value={newDeduction.description}
                    onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
                    placeholder="Additional details"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={addDeduction}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Deduction
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Deductions List */}
      {deductions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deductions.map((deduction) => (
                <tr key={deduction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-50 rounded-lg mr-3">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{deduction.section}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deduction.name}</p>
                      {deduction.description && (
                        <p className="text-xs text-gray-500">{deduction.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(deduction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => removeDeduction(deduction.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No deductions added yet. Click "Add Deduction" to start saving tax.</p>
        </div>
      )}

      {/* Quick Reference Guide */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Deduction Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium text-gray-800">Section 80C</h4>
            <p className="text-sm text-gray-600">Max ₹1.5L - PPF, EPF, ELSS, Life Insurance, Tuition Fees</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-gray-800">Section 80D</h4>
            <p className="text-sm text-gray-600">Max ₹75K - Health Insurance Premium (Self + Family + Parents)</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-800">Section 80CCD(1B)</h4>
            <p className="text-sm text-gray-600">Max ₹50K - Additional NPS Contribution</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium text-gray-800">Section 24(b)</h4>
            <p className="text-sm text-gray-600">Max ₹2L - Interest on Home Loan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
