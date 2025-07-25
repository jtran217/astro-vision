import { Code, FileSpreadsheet } from "lucide-react";

const Export = ({
  exportToMl,
  exportToExcel,
}: {
  exportToMl: () => void;
  exportToExcel: () => void;
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex space-x-3">
      <button
        onClick={exportToExcel}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        <FileSpreadsheet size={16} />
        <span>Export as Excel</span>
      </button>
      <button
        onClick={exportToMl}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        <Code size={16} />
        <span>Export as JSON</span>
      </button>
    </div>
  );
};

export default Export;
