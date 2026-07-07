import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface IncomeSourceData {
  id: string;
  type: 'salary' | 'business' | 'rental' | 'interest' | 'capital_gains' | 'other';
  name: string;
  amount: number;
  details?: any;
}

export interface DeductionEntry {
  id: string;
  section: string;
  name: string;
  amount: number;
  description: string;
}

export interface HRAData {
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  isMetroCity: boolean;
}

export interface CapitalGainEntry {
  id: string;
  type: 'STCG' | 'LTCG' | 'STCG_debt' | 'LTCG_debt';
  amount: number;
}

export interface Profile {
  full_name: string;
  email: string;
  profile_photo_url?: string;
  phone?: string;
  pan?: string;
  aadhaar_last4?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  preferred_regime?: 'new' | 'old';
  bank_name?: string;
  account_last4?: string;
  ifsc_code?: string;
}

export interface TaxData {
  income_sources: IncomeSourceData[];
  deductions: DeductionEntry[];
  hra: HRAData;
  capital_gains: CapitalGainEntry[];
  regime: 'new' | 'old';
  is_salaried: boolean;
  itr_status: string;
}

const emptyTaxData: TaxData = {
  income_sources: [],
  deductions: [],
  hra: { basicSalary: 0, hraReceived: 0, rentPaid: 0, isMetroCity: true },
  capital_gains: [],
  regime: 'new',
  is_salaried: true,
  itr_status: 'not_filed',
};

interface TaxDataContextValue {
  session: Session | null;
  profile: Profile | null;
  taxData: TaxData;
  loading: boolean;
  saving: boolean;
  saveError: string | null;
  clearSaveError: () => void;
  updateTaxData: (patch: Partial<TaxData>) => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const TaxDataContext = createContext<TaxDataContextValue | undefined>(undefined);

export function TaxDataProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [taxData, setTaxData] = useState<TaxData>(emptyTaxData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Watch auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Load data whenever the logged-in user changes
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setTaxData(emptyTaxData);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const userId = session.user.id;

      const [{ data: profileRow }, { data: taxRow }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('tax_data').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      if (cancelled) return;

      if (profileRow) {
        setProfile({
          full_name: profileRow.full_name || '',
          email: profileRow.email || session.user.email || '',
          profile_photo_url: profileRow.profile_photo_url || undefined,
          phone: profileRow.phone || undefined,
          pan: profileRow.pan || undefined,
          aadhaar_last4: profileRow.aadhaar_last4 || undefined,
          date_of_birth: profileRow.date_of_birth || undefined,
          gender: profileRow.gender || undefined,
          address: profileRow.address || undefined,
          city: profileRow.city || undefined,
          state: profileRow.state || undefined,
          pincode: profileRow.pincode || undefined,
          preferred_regime: profileRow.preferred_regime || undefined,
          bank_name: profileRow.bank_name || undefined,
          account_last4: profileRow.account_last4 || undefined,
          ifsc_code: profileRow.ifsc_code || undefined,
        });
      }

      if (taxRow) {
        setTaxData({
          income_sources: taxRow.income_sources || [],
          deductions: Array.isArray(taxRow.deductions) ? taxRow.deductions : [],
          hra: { ...emptyTaxData.hra, ...(taxRow.hra || {}) },
          capital_gains: taxRow.capital_gains || [],
          regime: taxRow.regime || 'new',
          is_salaried: taxRow.is_salaried ?? true,
          itr_status: taxRow.itr_status || 'not_filed',
        });
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const updateTaxData = useCallback(
    async (patch: Partial<TaxData>) => {
      if (!session?.user) return;
      const previous = taxData;
      const merged = { ...taxData, ...patch };
      setTaxData(merged);
      setSaving(true);
      const { error } = await supabase
        .from('tax_data')
        .upsert({ user_id: session.user.id, ...merged, updated_at: new Date().toISOString() });
      setSaving(false);
      if (error) {
        console.error('Failed to save tax data:', error.message);
        setTaxData(previous);
        setSaveError("Your change couldn't be saved. Please check your connection and try again.");
      } else {
        setSaveError(null);
      }
    },
    [session, taxData]
  );

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!session?.user) return;
      const previous = profile;
      const merged = { ...profile, ...patch } as Profile;
      setProfile(merged);
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: session.user.id, ...merged, updated_at: new Date().toISOString() });
      setSaving(false);
      if (error) {
        console.error('Failed to save profile:', error.message);
        setProfile(previous);
        setSaveError("Your change couldn't be saved. Please check your connection and try again.");
      } else {
        setSaveError(null);
      }
    },
    [session, profile]
  );

  const clearSaveError = useCallback(() => setSaveError(null), []);

  return (
    <TaxDataContext.Provider
      value={{ session, profile, taxData, loading, saving, saveError, clearSaveError, updateTaxData, updateProfile }}
    >
      {children}
    </TaxDataContext.Provider>
  );
}
export function useTaxData() {
  const ctx = useContext(TaxDataContext);
  if (!ctx) throw new Error('useTaxData must be used within a TaxDataProvider');
  return ctx;
  
}
