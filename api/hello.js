export default function handler(req, res) {
  res.status(200).json({
    message: "Zombie Bypass: API is alive at /api/hello.",
    timestamp: new Date().toISOString()
  });
}
