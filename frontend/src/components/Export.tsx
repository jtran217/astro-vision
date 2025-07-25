import { Code, FileSpreadsheet } from "lucide-react";

const Export = ({ exportJson }: { exportJson: () => void }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex space-x-3">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
        <FileSpreadsheet size={16} />
        <span>Export as Excel</span>
      </button>
      <button
        onClick={exportJson}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        <Code size={16} />
        <span>Export as JSON</span>
      </button>
    </div>
  );
};

export default Export;
