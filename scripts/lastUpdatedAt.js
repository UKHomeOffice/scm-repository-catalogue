const generateLastUpdated = () => {
  const lastUpdatedAt = new Date().getTime();
  return {
    lastUpdatedAt
  }
};
module.exports = {generateLastUpdated}