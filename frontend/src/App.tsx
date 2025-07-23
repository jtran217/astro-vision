import { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";

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
  return (
    <div className="min-h-screen  bg-gray-900 text-white">
      <Header />
      <div className="m-4">
        <FileUpload onFileUpload={handleFileUpload} hasVideo={!!videoSrc} />
      </div>
    </div>
  );
}

export default App;
