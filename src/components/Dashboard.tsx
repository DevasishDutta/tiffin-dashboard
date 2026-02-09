'use client';

import { useState, useEffect } from 'react';
import { api, clearAPIToken } from '@/lib/api';
import * as XLSX from 'xlsx';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState<'Lunch' | 'Dinner'>('Lunch');
  const [skipOrders, setSkipOrders] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Set today's date as default
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setDate(`${dd}/${mm}/${yyyy}`);

    // Load dashboard stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleGenerateList = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const skipOrdersArray = skipOrders
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await api.generateKitchenList(date, mealType, skipOrdersArray);

      if (response.success) {
        setResult(response.data);
      } else {
        throw new Error(response.error || 'Failed to generate kitchen list');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAPIToken();
    onLogout();
  };

  const handleDownloadExcel = () => {
  if (!result || !result.orders) {
    alert('No data to download');
    return;
  }

  // Prepare data for Excel
  const excelData = result.orders.map((order: any) => ({
    'Order Number': order[0],
    'Customer Name': order[1],
    'Phone': order[2],
    'Address': order[3],
    'Meal Type': order[4],
    'Food Preference': order[5],
    'Meal Size': order[6],
    'Plan Type': order[7],
    'Payment Status': order[8],
    'Notes': order[9] || ''
  }));

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kitchen Order List');

  // Set column widths
  const colWidths = [
    { wch: 20 }, // Order Number
    { wch: 20 }, // Customer Name
    { wch: 15 }, // Phone
    { wch: 35 }, // Address
    { wch: 12 }, // Meal Type
    { wch: 15 }, // Food Preference
    { wch: 12 }, // Meal Size
    { wch: 20 }, // Plan Type
    { wch: 15 }, // Payment Status
    { wch: 25 }, // Notes
  ];
  ws['!cols'] = colWidths;

  // Generate filename with date and meal type
  const dateStr = date.replace(/\//g, '-');
  const filename = `Kitchen_List_${dateStr}_${mealType}.xlsx`;

  // Download
  XLSX.writeFile(wb, filename);
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">🍱 Tiffin Manager</h1>
            <p className="text-sm text-gray-600">Kitchen Order List Generator</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Active Orders</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Today's Meals</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalMealsToday}</p>
            </div>
          </div>
        )}

        {/* Generate Kitchen List Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Kitchen Order List</h2>

          <form onSubmit={handleGenerateList} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: DD/MM/YYYY (e.g., 09/02/2026)</p>
              </div>

              <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  id="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as 'Lunch' | 'Dinner')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="skipOrders" className="block text-sm font-medium text-gray-700 mb-2">
                Skip Orders (Optional)
              </label>
              <input
                id="skipOrders"
                type="text"
                value={skipOrders}
                onChange={(e) => setSkipOrders(e.target.value)}
                placeholder="ORD20260209-0001, ORD20260209-0005"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter order numbers to skip, separated by commas
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : '📋 Generate Kitchen List'}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Kitchen Order List Generated</h2>
              <button
                onClick={handleDownloadExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                📥 Download Excel
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Date</p>
                <p className="text-lg font-semibold">{result.summary?.date}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Meal Type</p>
                <p className="text-lg font-semibold">{result.summary?.mealType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Total Orders</p>
                <p className="text-lg font-semibold">{result.summary?.totalOrders}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Updated</p>
                <p className="text-lg font-semibold">{result.summary?.updatedCount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-blue-800">Lunch Orders</p>
                <p className="text-2xl font-bold text-blue-900">{result.summary?.lunchCount || 0}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-xs text-orange-800">Dinner Orders</p>
                <p className="text-2xl font-bold text-orange-900">{result.summary?.dinnerCount || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-xs text-purple-800">Both Meals</p>
                <p className="text-2xl font-bold text-purple-900">{result.summary?.bothCount || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-xs text-green-800">Veg</p>
                <p className="text-2xl font-bold text-green-900">{result.summary?.vegCount || 0}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-xs text-red-800">Non-Veg</p>
                <p className="text-2xl font-bold text-red-900">{result.summary?.nonVegCount || 0}</p>
              </div>
              {result.summary?.skippedCount > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-800">Skipped</p>
                  <p className="text-2xl font-bold text-gray-900">{result.summary.skippedCount}</p>
                </div>
              )}
            </div>

            {result.completedOrders && result.completedOrders.length > 0 && (
              <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  🎉 Completed Orders ({result.completedOrders.length})
                </p>
                <p className="text-sm text-green-700">{result.completedOrders.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
