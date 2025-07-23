import { Plus } from "lucide-react";
import { useState } from "react";

interface TagPanelProp {
  eventType: string[];
  players: string[];
  outcome: string[];
  currentTime: number;
  onAddTag: (tag: any) => void;
}

const TagPanel: React.FC<TagPanelProp> = ({
  eventType,
  players,
  outcome,
  currentTime,
  onAddTag,
}) => {
  const [selectedEventType, setSelectedEventType] = useState(
    eventType ? eventType[0] : ""
  );
  const [selectedPlayer, setSelectedPlayer] = useState(
    players ? players[0] : ""
  );
  const [selectedOutcome, setSelectedOutcome] = useState(
    outcome ? outcome[0] : ""
  );

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAddTag = () => {
    const tag = {
      id: Date.now(),
      timestamp: currentTime,
      eventType: selectedEventType,
      player: selectedPlayer,
      outcome: selectedOutcome,
      time: formatTime(currentTime),
    };
    onAddTag(tag);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Tagging Panel</h3>
        <div className="space-y-4 mt-5">
          <label>Event Type</label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {eventType.map((type) => (
              <option>{type}</option>
            ))}
          </select>
        </div>
        <div className="space-y-4 mt-5">
          <label>Player</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {players.map((player) => (
              <option>{player}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 mt-5">
          <label>Outcome</label>
          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {outcome.map((outcome) => (
              <option>{outcome}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <h4>Current time {formatTime(currentTime)}</h4>
        <div className="flex space-x-3">
          <button
            onClick={handleAddTag}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Tag</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagPanel;
