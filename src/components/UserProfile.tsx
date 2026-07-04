import { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Building2, Camera, Save, Edit2, Check, X } from 'lucide-react';

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  preferredRegime: 'new' | 'old';
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  profilePhoto: string | null;
}

interface UserProfileProps {
  onProfileUpdate?: (user: { email: string; name: string; profilePhoto?: string }) => void;
}

export default function UserProfile({ onProfileUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    pan: 'ABCDE1234F',
    aadhaar: '****-****-1234',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    address: '123, Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    preferredRegime: 'new',
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    profilePhoto: null,
  });

  const [tempData, setTempData] = useState<UserProfileData>(profileData);

  const handleEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    if (onProfileUpdate) {
      onProfileUpdate({
        email: tempData.email,
        name: tempData.name,
        profilePhoto: tempData.profilePhoto || undefined,
      });
    }
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempData({ ...tempData, profilePhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setTempData({ ...tempData, profilePhoto: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
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

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {tempData.profilePhoto ? (
              <div className="relative">
                <img
                  src={tempData.profilePhoto}
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
                {tempData.name.charAt(0)}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{tempData.name}</h3>
            <p className="text-gray-600">{tempData.email}</p>
            <p className="text-sm text-gray-500 mt-1">PAN: {tempData.pan}</p>
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
                value={tempData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profileData.name}</p>
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
                {profileData.email}
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
                {profileData.phone}
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
              <p className="text-gray-800">{profileData.pan}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.aadhaar}
                onChange={(e) => handleChange('aadhaar', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profileData.aadhaar}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                value={tempData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profileData.dateOfBirth}</p>
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
              <p className="text-gray-800 capitalize">{profileData.gender}</p>
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
              <p className="text-gray-800">{profileData.address}</p>
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
              <p className="text-gray-800">{profileData.city}</p>
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
              <p className="text-gray-800">{profileData.state}</p>
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
              <p className="text-gray-800">{profileData.pincode}</p>
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
              value={tempData.preferredRegime}
              onChange={(e) => handleChange('preferredRegime', e.target.value as 'new' | 'old')}
              className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="new">New Regime (Lower rates, fewer deductions)</option>
              <option value="old">Old Regime (Higher rates, more deductions)</option>
            </select>
          ) : (
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profileData.preferredRegime === 'new'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {profileData.preferredRegime === 'new' ? 'New Regime' : 'Old Regime'}
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
                value={tempData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profileData.bankName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">••••••••{profileData.accountNumber.slice(-4)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
              />
            ) : (
              <p className="text-gray-800">{profileData.ifscCode}</p>
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
