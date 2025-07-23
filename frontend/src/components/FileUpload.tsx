import { Upload, Video } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

function FileUpload({
  onFileUpload,
  hasVideo,
}: {
  onFileUpload: (file: File) => void;
  hasVideo: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <button
        onClick={handleClick}
        className={` w-full p-4 border-2 border-dashed rounded-lg transition-colors flex items-center justify-center space-x-3 ${
          hasVideo
            ? "border-green-500 bg-green-500/10 text-green-400"
            : "border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
        }`}
      >
        {hasVideo ? <Video size={24} /> : <Upload size={24} />}
        <span className="font-medium">
          {hasVideo ? "Change Video" : "Upload Video"}
        </span>
      </button>
    </div>
  );
}

export default FileUpload;
