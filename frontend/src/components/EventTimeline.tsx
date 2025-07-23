import React from "react";
import { Clock, User, Target, Trash2 } from "lucide-react";

interface Event {
  id: number;
  timestamp: number;
  eventType: string;
  player: string;
  outcome: string;
  time: string;
}

interface EventTimelineProps {
  events: Event[];
  onEventClick: (timestamp: number) => void;
  onDeleteClick: (id: number) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onEventClick,
  onDeleteClick,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Clock size={20} />
        <span>Event Log / Timeline</span>
      </h3>

      <div className="text-sm text-gray-400 mb-4">
        Click on any event to jump to that moment
      </div>

      {events.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No events tagged yet. Start tagging events to see them here.
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event.timestamp)}
              className="flex items-center space-x-4 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-blue-400 font-mono text-sm">
                    {event.time}
                  </span>

                  <span className="text-white font-medium capitalize">
                    {event.eventType}
                  </span>

                  <div className="flex items-center space-x-1 text-gray-300">
                    <User size={14} />
                    <span className="text-sm">{event.player}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-400 capitalize">
                      {event.outcome}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">#{index + 1}</div>
                </div>
                <button
                  onClick={() => onDeleteClick(event.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
