export default function Habits() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Habit Tracker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-2">Daily Habits</h3>
          <p className="text-gray-500 text-sm">Drink Water, Exercise, Read...</p>
        </div>
      </div>
    </div>
  );
}