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
