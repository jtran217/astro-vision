import { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";
import { VideoPlayer } from "./components/VideoPlayer";

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
  const handleClearTags = () => {
    setEvents([]);
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
        </div>
      </div>
    </div>
  );
}

export default App;
