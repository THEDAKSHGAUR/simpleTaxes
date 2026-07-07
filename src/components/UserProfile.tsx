import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Building2, Camera, Save, Edit2, Check, X } from 'lucide-react';
import { useTaxData } from '../contexts/TaxDataContext';

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaarInput: string; // full value while typing; only last 4 digits are ever saved
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  preferred_regime: 'new' | 'old';
  bank_name: string;
  accountInput: string; // full value while typing; only last 4 digits are ever saved
  ifsc_code: string;
  profile_photo_url: string | null;
}

const blankForm: FormState = {
  full_name: '',
  email: '',
  phone: '',
  pan: '',
  aadhaarInput: '',
  date_of_birth: '',
  gender: 'male',
  address: '',
  city: '',
  state: '',
  pincode: '',
  preferred_regime: 'new',
  bank_name: '',
  accountInput: '',
  ifsc_code: '',
  profile_photo_url: null,
};

export default function UserProfile() {
  const { profile, updateProfile, saving } = useTaxData();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<FormState>(blankForm);

  // Whenever the underlying profile loads/changes and we're not mid-edit, sync the form.
  useEffect(() => {
    if (!isEditing) {
      setTempData({
        full_name: profile?.full_name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        pan: profile?.pan || '',
        aadhaarInput: '',
        date_of_birth: profile?.date_of_birth || '',
        gender: profile?.gender || 'male',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
        preferred_regime: profile?.preferred_regime || 'new',
        bank_name: profile?.bank_name || '',
        accountInput: '',
        ifsc_code: profile?.ifsc_code || '',
        profile_photo_url: profile?.profile_photo_url || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, isEditing]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      pan: profile?.pan || '',
      aadhaarInput: '',
      date_of_birth: profile?.date_of_birth || '',
      gender: profile?.gender || 'male',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      pincode: profile?.pincode || '',
      preferred_regime: profile?.preferred_regime || 'new',
      bank_name: profile?.bank_name || '',
      accountInput: '',
      ifsc_code: profile?.ifsc_code || '',
      profile_photo_url: profile?.profile_photo_url || null,
    });
  };

  const handleSave = async () => {
    const aadhaarLast4 = tempData.aadhaarInput
      ? tempData.aadhaarInput.replace(/\D/g, '').slice(-4)
      : profile?.aadhaar_last4 || undefined;
    const accountLast4 = tempData.accountInput
      ? tempData.accountInput.replace(/\D/g, '').slice(-4)
      : profile?.account_last4 || undefined;

    await updateProfile({
      full_name: tempData.full_name,
      email: tempData.email,
      phone: tempData.phone || undefined,
      pan: tempData.pan || undefined,
      aadhaar_last4: aadhaarLast4,
      date_of_birth: tempData.date_of_birth || undefined,
      gender: tempData.gender,
      address: tempData.address || undefined,
      city: tempData.city || undefined,
      state: tempData.state || undefined,
      pincode: tempData.pincode || undefined,
      preferred_regime: tempData.preferred_regime,
      bank_name: tempData.bank_name || undefined,
      account_last4: accountLast4,
      ifsc_code: tempData.ifsc_code || undefined,
      profile_photo_url: tempData.profile_photo_url || undefined,
    });
    setIsEditing(false);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, profile_photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setTempData({ ...tempData, profile_photo_url: null });
  };

  const displayName = isEditing ? tempData.full_name : profile?.full_name || 'Your Name';
  const displayEmail = isEditing ? tempData.email : profile?.email || '';
  const displayPan = isEditing ? tempData.pan : profile?.pan || 'Not set';
  const displayAadhaar = profile?.aadhaar_last4 ? `••••-••••-${profile.aadhaar_last4}` : 'Not set';
  const displayAccount = profile?.account_last4 ? `••••••••${profile.account_last4}` : 'Not set';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-gray-400">Saving...</span>}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {tempData.profile_photo_url ? (
              <div className="relative">
                <img
                  src={tempData.profile_photo_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
                />
                {isEditing && (
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{displayName}</h3>
            <p className="text-gray-600">{displayEmail}</p>
            <p className="text-sm text-gray-500 mt-1">PAN: {displayPan}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-indigo-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.full_name || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {profile?.email || 'Not set'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={tempData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {profile?.phone || 'Not set'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.pan}
                onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
              />
            ) : (
              <p className="text-gray-800">{displayPan}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.aadhaarInput}
                onChange={(e) => handleChange('aadhaarInput', e.target.value)}
                placeholder={profile?.aadhaar_last4 ? `Currently ending in ${profile.aadhaar_last4} — enter to change` : 'Enter Aadhaar number'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{displayAadhaar}</p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1">Only the last 4 digits are stored — the rest is never saved.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                value={tempData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.date_of_birth || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {isEditing ? (
              <select
                value={tempData.gender}
                onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female' | 'other')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-800 capitalize">{profile?.gender || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <textarea
                value={tempData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.address || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.city || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.state || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.pincode || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tax Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
          Tax Preferences
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tax Regime</label>
          {isEditing ? (
            <select
              value={tempData.preferred_regime}
              onChange={(e) => handleChange('preferred_regime', e.target.value as 'new' | 'old')}
              className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="new">New Regime (Lower rates, fewer deductions)</option>
              <option value="old">Old Regime (Higher rates, more deductions)</option>
            </select>
          ) : (
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                (profile?.preferred_regime || 'new') === 'new'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {(profile?.preferred_regime || 'new') === 'new' ? 'New Regime' : 'Old Regime'}
              </span>
              <span className="text-xs text-gray-400 ml-3">
                (This is just a saved preference — the Dashboard toggle controls the actual calculation)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
          Bank Details (for Refunds)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.bank_name}
                onChange={(e) => handleChange('bank_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile?.bank_name || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.accountInput}
                onChange={(e) => handleChange('accountInput', e.target.value)}
                placeholder={profile?.account_last4 ? `Currently ending in ${profile.account_last4} — enter to change` : 'Enter account number'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{displayAccount}</p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1">Only the last 4 digits are stored.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.ifsc_code}
                onChange={(e) => handleChange('ifsc_code', e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
              />
            ) : (
              <p className="text-gray-800">{profile?.ifsc_code || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Check className="w-8 h-8" />
            <div>
              <p className="font-semibold text-lg">Profile Status: Active</p>
              <p className="text-sm opacity-90">Your profile is complete and ready for tax filing</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Last Updated</p>
            <p className="font-medium">{new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}