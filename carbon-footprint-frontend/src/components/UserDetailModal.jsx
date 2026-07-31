import React from 'react';
import { X, User, MapPin, FileCheck, Calendar, Phone, Mail, CheckCircle2, XCircle } from 'lucide-react';

const UserDetailModal = ({ user, onClose, onApprove, onReject }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {user.firstName} {user.middleName || ''} {user.lastName}
              </h3>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                user.status === 'APPROVED'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : user.status === 'REJECTED'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Personal Info */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <span className="text-slate-200 font-medium break-all">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mobile Number</span>
                <span className="text-slate-200 font-medium">{user.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Alternate Mobile</span>
                <span className="text-slate-200 font-medium">{user.alternateMobile || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Age & Gender</span>
                <span className="text-slate-200 font-medium">{user.age} yrs • {user.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date of Birth</span>
                <span className="text-slate-200 font-medium">{user.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Username</span>
                <span className="text-emerald-400 font-mono font-medium">{user.username || 'Generated on approval'}</span>
              </div>
            </div>
          </div>

          {/* Address Details */}
          {user.address && (
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address Details
              </h4>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 text-xs space-y-2">
                <p className="text-slate-200 font-medium">
                  {user.address.houseNumber}, {user.address.street}, {user.address.area}
                </p>
                {user.address.landmark && (
                  <p className="text-slate-400">Landmark: {user.address.landmark}</p>
                )}
                <p className="text-slate-400">
                  {user.address.city}, {user.address.state}, {user.address.country} - <span className="text-emerald-400 font-mono">{user.address.pinCode}</span>
                </p>
              </div>
            </div>
          )}

          {/* Government ID Verification */}
          {user.governmentId && (
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Government Identity Verification
              </h4>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Document Type</span>
                  <span className="text-white font-bold text-sm">{user.governmentId.idType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Document ID Number</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm tracking-wider">{user.governmentId.idNumber}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
          >
            Close
          </button>
          
          {user.status === 'PENDING' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onReject(user.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/60 transition-all"
              >
                <XCircle className="w-4 h-4" /> Reject User
              </button>
              <button
                onClick={() => onApprove(user.id)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Send Credentials
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDetailModal;
