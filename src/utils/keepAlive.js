const BACKEND_URL = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/api\/?$/, '');

export const startKeepAlive = () => {
  if (!BACKEND_URL) return;
  try {
    // ping every 14 minutes to prevent free-tier sleeping
    setInterval(async () => {
      try {
        await fetch(`${BACKEND_URL}/api/health`);
      } catch (e) {
        // swallow network errors
      }
    }, 14 * 60 * 1000);
  } catch (e) {}
};

export default startKeepAlive;
