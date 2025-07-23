import { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";
import { VideoPlayer } from "./components/VideoPlayer";
import { eventType, teamPlayer, outcome } from "./data/volleyballData";
import TagPanel from "./components/TagPanel";
import { EventTimeline } from "./components/EventTimeline";

interface Event {
  id: number;
  timestamp: number;
  eventType: string;
  player: string;
  outcome: string;
  time: string;
}

function App() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [seekTo, setSeekTo] = useState<number | null>(null);

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setEvents([]);
  };
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };
  const handleAddTag = (tag: Event) => {
    setEvents((prev) =>
      [...prev, tag].sort((a, b) => a.timestamp - b.timestamp)
    );
  };
  const handleDeleteTag = (id: number) => {
    setEvents((prev) => prev.filter((event) => event.id != id));
  };
  const handleEventClick = (timestamp: number) => {
    setSeekTo(timestamp);
    setTimeout(() => setSeekTo(null), 100);
  };
  return (
    <div className="min-h-screen  bg-gray-900 text-white">
      <Header />
      <div className="m-4">
        <FileUpload onFileUpload={handleFileUpload} hasVideo={!!videoSrc} />
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <VideoPlayer
              videoSrc={videoSrc}
              onTimeUpdate={handleTimeUpdate}
              seekTo={seekTo}
            />
          </div>
          <div className="col-span-4">
            <TagPanel
              eventType={eventType}
              players={teamPlayer}
              outcome={outcome}
              currentTime={currentTime}
              onAddTag={handleAddTag}
            />
          </div>
          <div className="col-span-12 mt-6">
            <EventTimeline
              events={events}
              onEventClick={handleEventClick}
              onDeleteClick={handleDeleteTag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
