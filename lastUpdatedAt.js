export const generateLastUpdated = () => {
  const lastUpdatedAt = new Date().toLocaleDateString("en-GB");
  return {
    lastUpdatedAt
  }
};