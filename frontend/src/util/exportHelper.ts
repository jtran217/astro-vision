import * as XLSX from "xlsx";
import { sumActions } from "./helper";

interface Event {
  videoId: string;
  id: number;
  timestamp: number;
  eventType: string;
  player: string;
  outcome: string;
  time: string;
}

export const exportCurrentVideoToExcel = (videoId: string, events: Event[]) => {
  if (!videoId) {
    throw new Error("No video loaded");
  }

  try {
    const videoData = JSON.parse(localStorage.getItem(videoId) || "{}");
    const filename = videoId.replace("video_", "").split("_")[0];

    const workbook = XLSX.utils.book_new();

    const eventsData = events.map((event) => ({
      "Event ID": event.id,
      "Timestamp (seconds)": event.timestamp,
      Time: event.time,
      "Event Type": event.eventType,
      Player: event.player,
      Outcome: event.outcome,
      "Video ID": event.videoId,
    }));

    const eventsSheet = XLSX.utils.json_to_sheet(eventsData);
    XLSX.utils.book_append_sheet(workbook, eventsSheet, "Events");

    const aggregatedStats = sumActions(events);
    const playerStatsData = [];

    for (const player in aggregatedStats) {
      for (const eventType in aggregatedStats[player]) {
        const stats = aggregatedStats[player][eventType];
        playerStatsData.push({
          Player: player,
          Action: eventType,
          "Total Attempts": stats.total,
          Successful: stats.successful,
          Failed: stats.failure,
          "Success Rate (%)": ((stats.successful / stats.total) * 100).toFixed(
            1
          ),
        });
      }
    }

    const statsSheet = XLSX.utils.json_to_sheet(playerStatsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Player Statistics");

    // Sheet 3: Summary
    const eventTypeCounts = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summaryData = [
      { Metric: "Video File", Value: filename },
      { Metric: "Total Events", Value: events.length },
      { Metric: "Export Date", Value: new Date().toLocaleDateString() },
      { Metric: "", Value: "" }, // Empty row
      { Metric: "Event Type Breakdown", Value: "" },
      ...Object.entries(eventTypeCounts).map(([type, count]) => ({
        Metric: type,
        Value: count,
      })),
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    return { workbook, filename };
  } catch (error) {
    console.error("Error creating Excel export:", error);
    throw error;
  }
};

export const downloadCurrentVideoExcelExport = (
  videoId: string,
  events: Event[]
) => {
  try {
    const { workbook, filename } = exportCurrentVideoToExcel(videoId, events);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-analysis-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Excel file exported for ${filename}`);
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    alert("Error exporting Excel file. Please try again.");
  }
};
