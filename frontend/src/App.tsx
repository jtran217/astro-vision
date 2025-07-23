import "./App.css";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen  bg-gray-900 text-white">
      <Header />
      <div className="m-4">
        <FileUpload
          onFileUpload={() => console.log("CLICKED")}
          hasVideo={false}
        />
      </div>
    </div>
  );
}

export default App;
