import { useState } from "react";

export default function DatePicker() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full">
      <h3 className="font-semibold text-gray-700 mb-2">Calendar</h3>
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-center">
        {/* Simple Native Date Picker for now */}
        <input 
          type="date" 
          className="p-2 border rounded w-full text-gray-600"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <p className="text-xs text-indigo-600 mt-2 font-medium">
          {date.toDateString()}
        </p>
      </div>
    </div>
  );
}