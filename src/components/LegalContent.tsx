export function PrivacyContent() {
  return (
    <>
      <p className="text-xs text-gray-400">Last updated: July 2026</p>

      <h3 className="font-semibold text-gray-800 mt-4">What we collect</h3>
      <p>
        When you create an account, we collect your name and email (via email/password signup or Google
        sign-in). As you use the app, you may choose to enter income details, deduction claims, HRA figures,
        capital gains, PAN number, date of birth, address, and bank details for refund purposes. Aadhaar and
        bank account numbers are stored in masked form only — we retain the last 4 digits and discard the rest.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">How we store it</h3>
      <p>
        Your data is stored in a Supabase (PostgreSQL) database, protected by Row Level Security rules that
        restrict access to your own account only. We do not sell, rent, or share your personal or financial
        data with third parties, except as required to operate the service (e.g. our hosting and database
        providers) or by law.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">Third-party sign-in</h3>
      <p>
        If you sign in with Google, we receive your name, email, and profile photo from Google in accordance
        with Google's own privacy policy and OAuth permissions you approve.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">Your rights</h3>
      <p>
        You can edit or delete the information you've entered at any time from within the app. To request full
        account deletion, contact us using the details on our contact page (or the email you signed up with).
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">Changes to this policy</h3>
      <p>
        We may update this policy from time to time. Continued use of the app after changes constitutes
        acceptance of the revised policy.
      </p>
    </>
  );
}

export function TermsContent() {
  return (
    <>
      <p className="text-xs text-gray-400">Last updated: July 2026</p>

      <h3 className="font-semibold text-gray-800 mt-4">What this app is</h3>
      <p>
        SimpleTaxes is a tax estimation and planning tool for individual Indian taxpayers. It calculates
        estimated tax liability under the New and Old tax regimes based on figures you enter, using published
        Union Budget tax slabs and rules for the relevant assessment year.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">What this app is not</h3>
      <p>
        SimpleTaxes is <strong>not</strong> a Chartered Accountant, tax advisor, or authorized e-filing
        intermediary. It does not file your Income Tax Return with the Income Tax Department. All figures shown
        are estimates for planning purposes only and may not reflect your final tax liability, which depends on
        your complete financial situation, applicable exemptions, and current law at the time of filing.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">No guarantee of accuracy</h3>
      <p>
        While we aim to keep tax slabs, rebate thresholds, and rates current with each Union Budget, tax law
        changes and we cannot guarantee this app reflects every applicable rule for your specific situation. You
        are responsible for verifying all figures with a qualified Chartered Accountant or the official
        Income Tax Department resources before filing your return or making financial decisions.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">Your responsibility</h3>
      <p>
        You are responsible for the accuracy of the information you enter, and for your own tax filing and
        compliance obligations. Use of this app does not create any advisor-client or professional relationship.
      </p>

      <h3 className="font-semibold text-gray-800 mt-4">Limitation of liability</h3>
      <p>
        SimpleTaxes and its operators are not liable for any loss, penalty, or damages arising from reliance on
        estimates provided by this app.
      </p>
    </>
  );
}