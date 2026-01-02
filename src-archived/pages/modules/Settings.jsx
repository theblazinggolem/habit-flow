export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Dark Mode</span>
            <button className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-700">Toggle</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email Notifications</span>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm">Enabled</button>
          </div>
        </div>
      </div>
    </div>
  );
}