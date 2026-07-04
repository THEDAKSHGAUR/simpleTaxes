# SimpleTaxes - Indian Tax Filing Made Easy

A comprehensive tax planning and filing application designed for Indian taxpayers. This application helps individuals minimize their income tax through various deductions, exemptions, and investment options, while also providing tools for ITR filing.

## Features

### 📊 Dashboard
- Overview of total income, tax saved, and estimated tax liability
- Quick access to all tax planning tools
- Tax-saving tips and recommendations

### 💰 Income Sources
- Track multiple income sources (salary, business, rental, interest, capital gains)
- Detailed breakdown options for salary and rental income
- Real-time total income calculation

### 🛡️ Deductions & Exemptions
- Comprehensive deduction calculator for all major sections:
  - Section 80C (₹1.5 lakh limit)
  - Section 80D (Health insurance)
  - Section 80CCD(1B) (NPS additional ₹50,000)
  - And 10+ more deduction sections
- Section-wise tracking with limit monitoring
- Visual progress indicators for each section

### 🧮 Tax Calculator
- Calculate tax under both New and Old regimes
- Regime comparison to find optimal choice
- Current tax slabs (FY 2024-25 / AY 2025-26)
- Detailed tax breakdown including cess

### 🏠 HRA Exemption Calculator
- Calculate HRA exemption based on:
  - Actual HRA received
  - Rent paid minus 10% of basic salary
  - 50% (metro) or 40% (non-metro) of basic salary
- Tips to maximize HRA exemption

### 📈 Capital Gains Tax Calculator
- Support for equity and debt instruments
- Short-term and Long-term capital gains
- Automatic exemption limit application
- Tax-saving strategies for investors

### 🎯 Tax Optimization
- Personalized recommendations based on financial profile
- Actionable tips to reduce tax liability
- Priority-based suggestions
- Potential savings calculator

### 📄 ITR Filing
- ITR form selection guide (ITR-1, ITR-2, ITR-3, ITR-4)
- Step-by-step filing process
- Document checklist
- Form eligibility information

### 💼 Investment Suggestions
- Tax-saving investment options (PPF, ELSS, NPS, etc.)
- Risk profile-based recommendations
- Detailed pros/cons for each option
- Investment calculator

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
simpleTaxes/
├── src/
│   ├── components/          # React components
│   │   ├── IncomeSources.tsx
│   │   ├── Deductions.tsx
│   │   ├── TaxCalculator.tsx
│   │   ├── HRACalculator.tsx
│   │   ├── CapitalGainsCalculator.tsx
│   │   ├── TaxOptimization.tsx
│   │   ├── ITRFiling.tsx
│   │   └── InvestmentSuggestions.tsx
│   ├── lib/
│   │   └── tax-utils.ts      # Tax calculation utilities
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Tax Calculation Features

### Supported Tax Regimes
- **New Regime** (FY 2024-25): Lower rates, fewer deductions
- **Old Regime** (FY 2024-25): Higher rates, more deductions

### Tax Slabs (New Regime)
- ₹0 - ₹3 lakh: 0%
- ₹3 lakh - ₹7 lakh: 5%
- ₹7 lakh - ₹10 lakh: 10%
- ₹10 lakh - ₹12 lakh: 15%
- ₹12 lakh - ₹15 lakh: 20%
- Above ₹15 lakh: 30%

### Tax Slabs (Old Regime)
- ₹0 - ₹2.5 lakh: 0%
- ₹2.5 lakh - ₹5 lakh: 5%
- ₹5 lakh - ₹10 lakh: 20%
- Above ₹10 lakh: 30%

### Deduction Sections Supported
- Section 80C (₹1.5 lakh)
- Section 80CCC
- Section 80CCD(1)
- Section 80CCD(1B) (₹50,000)
- Section 80D (₹75,000)
- Section 80DD (₹75,000)
- Section 80DDB (₹1 lakh)
- Section 80E (Education loan interest)
- Section 80EE (₹50,000)
- Section 80EEA (₹1.5 lakh)
- Section 80G (Donations)
- Section 80TTA (₹10,000)
- Section 80TTB (₹50,000)
- Section 80U (₹75,000)

## Future Enhancements

- [ ] User authentication and profile management
- [ ] Document upload and management system
- [ ] Tax calendar with deadline reminders
- [ ] Report generation and export features
- [ ] Integration with income tax department API
- [ ] Multi-language support
- [ ] Mobile app version

## Disclaimer

This application is for educational and planning purposes only. Always consult with a qualified Chartered Accountant or tax professional for actual tax filing and financial advice. Tax laws are subject to change, and this application may not reflect the most current regulations.

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on the repository.
