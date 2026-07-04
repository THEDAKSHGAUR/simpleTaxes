import { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, ArrowRight, Info } from 'lucide-react';

interface ITRForm {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  whoShouldFile: string[];
  documents: string[];
}

const ITR_FORMS: ITRForm[] = [
  {
    id: 'ITR-1',
    name: 'ITR-1 (Sahaj)',
    description: 'For individuals with income from salary, one house property, and other sources',
    eligibility: [
      'Resident Individual',
      'Income from Salary/Pension',
      'Income from One House Property',
      'Income from Other Sources (interest, dividends)',
      'Total income up to ₹50 lakh',
    ],
    whoShouldFile: [
      'Salaried employees',
      'Pensioners',
      'Individuals with rental income from one property',
      'Individuals with interest/dividend income',
    ],
    documents: [
      'Form 16',
      'PAN card',
      'Aadhaar card',
      'Bank account details',
      'Interest certificates from banks',
    ],
  },
  {
    id: 'ITR-2',
    name: 'ITR-2',
    description: 'For individuals and HUFs not having income from business/profession',
    eligibility: [
      'Resident/Non-Resident Individual',
      'Income from Salary/Pension',
      'Income from House Property (more than one)',
      'Income from Capital Gains',
      'Income from Other Sources',
      'No income from business/profession',
    ],
    whoShouldFile: [
      'Individuals with capital gains (stocks, mutual funds)',
      'Individuals with multiple house properties',
      'Individuals with foreign income',
      'Directors of companies',
    ],
    documents: [
      'Form 16',
      'PAN card',
      'Aadhaar card',
      'Bank account details',
      'Capital gains statements',
      'Property details',
    ],
  },
  {
    id: 'ITR-3',
    name: 'ITR-3',
    description: 'For individuals and HUFs having income from business/profession',
    eligibility: [
      'Resident/Non-Resident Individual',
      'Income from Business/Profession',
      'Income from Salary/Pension',
      'Income from House Property',
      'Income from Capital Gains',
      'Income from Other Sources',
    ],
    whoShouldFile: [
      'Self-employed professionals',
      'Business owners',
      'Partners in firms',
      'Individuals with presumptive business income',
    ],
    documents: [
      'PAN card',
      'Aadhaar card',
      'Bank account details',
      'Business financial statements',
      'GST returns (if applicable)',
      'Audit reports (if applicable)',
    ],
  },
  {
    id: 'ITR-4',
    name: 'ITR-4 (Sugam)',
    description: 'For individuals, HUFs, and firms with presumptive income',
    eligibility: [
      'Resident Individual/HUF/Firm',
      'Presumptive business income (Section 44AD/44AE)',
      'Income from Salary/Pension (up to ₹50 lakh)',
      'Income from House Property',
      'Income from Other Sources',
    ],
    whoShouldFile: [
      'Small business owners (turnover up to ₹2 crore)',
      'Professionals with presumptive income (up to ₹50 lakh)',
      'Freelancers opting for presumptive taxation',
    ],
    documents: [
      'PAN card',
      'Aadhaar card',
      'Bank account details',
      'Business turnover details',
      'GST registration (if applicable)',
    ],
  },
];

export default function ITRFiling() {
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    pan: '',
    aadhaar: '',
    name: '',
    dob: '',
    address: '',
    income: 0,
    deductions: 0,
  });

  const steps = ['Select ITR Form', 'Personal Information', 'Income Details', 'Review & Submit'];

  const selectedITR = ITR_FORMS.find(form => form.id === selectedForm);

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">ITR Filing</h2>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    index <= currentStep ? 'text-indigo-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-2 ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 0 && <FormSelection onSelect={handleFormSelect} />}
      {currentStep === 1 && <PersonalInfo formData={formData} setFormData={setFormData} />}
      {currentStep === 2 && <IncomeDetails formData={formData} setFormData={setFormData} />}
      {currentStep === 3 && selectedITR && <ReviewSubmit formData={formData} itrForm={selectedITR} />}

      {/* Navigation Buttons */}
      {currentStep > 0 && currentStep < 3 && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}

function FormSelection({ onSelect }: { onSelect: (formId: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Select the Right ITR Form</p>
            <p>Choose the ITR form that matches your income sources. Filing under the wrong form may lead to processing delays or notices.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ITR_FORMS.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500"
            onClick={() => onSelect(form.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{form.name}</h3>
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-gray-600 mb-4">{form.description}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Eligibility:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {form.eligibility.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalInfo({ formData, setFormData }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            value={formData.pan}
            onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
            placeholder="ABCDE1234F"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
          <input
            type="text"
            value={formData.aadhaar}
            onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
            placeholder="1234-5678-9012"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="As per PAN"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Complete address"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function IncomeDetails({ formData, setFormData }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gross Income (₹)</label>
          <input
            type="number"
            value={formData.income || ''}
            onChange={(e) => setFormData({ ...formData, income: parseFloat(e.target.value) || 0 })}
            placeholder="Total income from all sources"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Deductions (₹)</label>
          <input
            type="number"
            value={formData.deductions || ''}
            onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
            placeholder="Total deductions claimed"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Taxable Income</span>
          <span className="text-xl font-bold text-gray-800">
            ₹{((formData.income || 0) - (formData.deductions || 0)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewSubmit({ formData, itrForm }: { formData: any; itrForm: ITRForm }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Your ITR Details</h3>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-800 mb-2">Selected ITR Form</h4>
            <p className="text-indigo-600 font-semibold">{itrForm.name}</p>
            <p className="text-sm text-gray-600">{itrForm.description}</p>
          </div>

          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-800 mb-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">PAN:</span>
              <span className="text-gray-800">{formData.pan || 'Not provided'}</span>
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-800">{formData.name || 'Not provided'}</span>
              <span className="text-gray-600">Aadhaar:</span>
              <span className="text-gray-800">{formData.aadhaar || 'Not provided'}</span>
            </div>
          </div>

          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-800 mb-2">Income Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Gross Income:</span>
              <span className="text-gray-800">₹{(formData.income || 0).toLocaleString('en-IN')}</span>
              <span className="text-gray-600">Deductions:</span>
              <span className="text-gray-800">₹{(formData.deductions || 0).toLocaleString('en-IN')}</span>
              <span className="text-gray-600 font-medium">Taxable Income:</span>
              <span className="text-gray-800 font-semibold">₹{((formData.income || 0) - (formData.deductions || 0)).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">Required Documents</h4>
            <ul className="space-y-2">
              {itrForm.documents.map((doc, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Notes</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure all information matches your PAN and Aadhaar records</li>
              <li>Keep all documents ready before filing</li>
              <li>Verify your bank account details for refund</li>
              <li>E-file using Aadhaar OTP or Digital Signature</li>
            </ul>
          </div>
        </div>
      </div>

      <button className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg">
        Submit ITR
      </button>
    </div>
  );
}
