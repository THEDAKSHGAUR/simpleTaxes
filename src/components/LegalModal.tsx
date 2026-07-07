import { X } from 'lucide-react';
import { PrivacyContent, TermsContent } from './LegalContent';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="px-6 py-6 text-sm text-gray-700 space-y-2">
          {type === 'privacy' ? <PrivacyContent /> : <TermsContent />}
        </div>
      </div>
    </div>
  );
}