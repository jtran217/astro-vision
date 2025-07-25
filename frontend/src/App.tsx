import { useEffect, useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";
import { VideoPlayer } from "./components/VideoPlayer";
import { eventType, teamPlayer, outcome } from "./data/volleyballData";
import TagPanel from "./components/TagPanel";
import { EventTimeline } from "./components/EventTimeline";
import {
  cleanupExpiredVideos,
  generateVideoKey,
  sumActions,
} from "./util/helper";
import Export from "./components/Export";

interface Event {
  videoId: string;
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
  const [videoId, setVideoId] = useState<string>("");

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const videoId = generateVideoKey(file);
    setVideoId(videoId);
    setVideoSrc(url);
    if (localStorage.getItem(videoId)) {
      const videoData = JSON.parse(localStorage.getItem(videoId) || "{}");
      setEvents(videoData.events);
    } else {
      setEvents([]);
    }
  };
  const handleExportJson = () => {
    const sumObject = sumActions(events);
    console.log(sumObject);
  };
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };
  const handleAddTag = (tag: Event) => {
    const newEvents = [...events, tag].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    setEvents(newEvents);
    const videoData = {
      events: newEvents,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
    };
    localStorage.setItem(videoId, JSON.stringify(videoData));
  };
  const handleDeleteTag = (id: number) => {
    const newEvents = events.filter((event) => event.id != id);
    setEvents(newEvents);
    const videoData = {
      events: newEvents,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
    };
    localStorage.setItem(videoId, JSON.stringify(videoData));
  };
  const handleEventClick = (timestamp: number) => {
    setSeekTo(timestamp);
    setTimeout(() => setSeekTo(null), 100);
  };

  useEffect(() => {
    cleanupExpiredVideos();
  }, []);

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
              videoId={videoId}
              currentTime={currentTime}
              onAddTag={handleAddTag}
            />
          </div>
          <div onClick={() => console.log(events)} className="col-span-12 mt-6">
            <EventTimeline
              events={events}
              onEventClick={handleEventClick}
              onDeleteClick={handleDeleteTag}
            />
          </div>
          <div className="col-span-4">
            <Export exportJson={handleExportJson} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
