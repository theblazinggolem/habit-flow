export default function UpcomingTab() {
  const events = [
    { id: 1, title: "Team Meeting", time: "10:00 AM", color: "bg-blue-500" },
    { id: 2, title: "Gym", time: "6:00 PM", color: "bg-orange-500" },
    { id: 3, title: "Read Book", time: "8:30 PM", color: "bg-green-500" },
  ];

  return (
    <div className="w-full">
      <h3 className="font-semibold text-gray-700 mb-3">Upcoming</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100">
            <div className={`w-2 h-2 rounded-full ${event.color}`} />
            <div>
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-500">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}