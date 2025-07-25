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
        error: 0,
        neutral: 0,
      };
    }

    result[item.player][item.eventType].total++;

    const outcome = item.outcome.toLowerCase();
    if (outcome.includes("success")) {
      result[item.player][item.eventType].successful++;
    } else if (outcome.includes("error")) {
      result[item.player][item.eventType].error++;
    } else {
      result[item.player][item.eventType].neutral++;
    }
  }
  return result;
};
