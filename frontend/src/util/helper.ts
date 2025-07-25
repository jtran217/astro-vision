export const generateVideoKey = (file: File) => {
  return `video_${file.name}_${file.size}_${file.lastModified}`;
};

export const cleanupExpiredVideos = (maxAgeInDays = 7) => {
  const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("video_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.createdAt && now - data.createdAt > maxAge) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
  }
};

interface Event {
  videoId: string;
  id: number;
  timestamp: number;
  eventType: string;
  player: string;
  outcome: string;
  time: string;
}

export const sumActions = (events: Event[]) => {
  const result: Record<string, any> = {};

  for (let item of events) {
    if (!(item.player in result)) {
      result[item.player] = {};
    }

    if (!(item.eventType in result[item.player])) {
      result[item.player][item.eventType] = {
        total: 0,
        successful: 0,
        failure: 0,
      };
    }

    result[item.player][item.eventType].total++;

    const outcome = item.outcome.toLowerCase();
    if (outcome.includes("success")) {
      result[item.player][item.eventType].successful++;
    } else {
      result[item.player][item.eventType].failure++;
    }
  }
  return result;
};

export const exportCurrentVideoToML = (videoId: string, events: Event[]) => {
  if (!videoId) {
    throw new Error("No video loaded");
  }

  try {
    // Get current video data from localStorage
    const videoData = JSON.parse(localStorage.getItem(videoId) || "{}");
    const filename = videoId.replace("video_", "").split("_")[0];

    // Get unique event types and outcomes from current video events
    const eventTypes = [...new Set(events.map((e) => e.eventType))];
    const outcomes = [...new Set(events.map((e) => e.outcome))];

    // Generate aggregated stats for current video only
    const aggregatedStats = sumActions(events);

    const mlExport = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        videoId: videoId,
        filename: filename,
        totalEvents: events.length,
        eventTypes: eventTypes,
        outcomes: outcomes,
      },
      video: {
        videoId: videoId,
        videoMetadata: {
          filename: filename,
          createdAt: videoData.createdAt,
          lastAccessed: videoData.lastAccessed,
        },
        events: events,
      },
      aggregatedStats: aggregatedStats,
    };

    return mlExport;
  } catch (error) {
    console.error("Error creating ML export:", error);
    throw error;
  }
};

export const downloadCurrentVideoMLExport = (
  videoId: string,
  events: Event[]
) => {
  try {
    const data = exportCurrentVideoToML(videoId, events);
    const filename = data.metadata.filename;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-ml-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`ML data exported for ${filename}`);
  } catch (error) {
    alert("Error exporting data. Please try again.");
  }
};
