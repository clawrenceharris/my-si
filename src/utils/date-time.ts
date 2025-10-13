export const getFormattedCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getFormattedCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};
