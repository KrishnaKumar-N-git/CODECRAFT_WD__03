import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, ShieldCheck, UserCheck, UserX, Mail, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data?.users || []);
    } catch (err) {
      toast.error('Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproveOwner = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/approve`);
      toast.success(res.data.message);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, isApproved: true, isActive: true } : u))
      );
    } catch (err) {
      toast.error('Failed to approve shop owner');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      toast.success(res.data.message);
      setUsers(users.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u)));
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" />
            <span>Platform Customer & Admin Accounts</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage customer profiles, verify user accounts, and control account active/suspended access
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading user accounts...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Approval & Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{user.name}</h4>
                        <p className="text-[10px] text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'STORE_OWNER'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-mono">{user.phone || 'N/A'}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {user.role === 'STORE_OWNER' && (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            user.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {user.isApproved ? 'Approved Owner' : 'Pending Approval'}
                        </span>
                      )}
                      <div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== 'ADMIN' && (
                      <div className="flex items-center justify-end space-x-2">
                        {user.role === 'STORE_OWNER' && !user.isApproved && (
                          <button
                            onClick={() => handleApproveOwner(user._id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-colors shadow-sm flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve Owner</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold text-white transition-colors ${
                            user.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {user.isActive ? 'Block Account' : 'Unblock Account'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
