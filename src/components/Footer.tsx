interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export default function Footer({ onOpenPrivacy, onOpenTerms }: FooterProps) {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-xs text-gray-500 text-center mb-3 max-w-3xl mx-auto">
          SimpleTaxes provides estimates for informational and planning purposes only. It is not a substitute
          for advice from a qualified Chartered Accountant, tax professional, or for official ITR filing with
          the Income Tax Department. Please verify all figures independently before making financial or filing
          decisions.
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <button onClick={onOpenPrivacy} className="text-gray-600 hover:text-indigo-600">
            Privacy Policy
          </button>
          <button onClick={onOpenTerms} className="text-gray-600 hover:text-indigo-600">
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}