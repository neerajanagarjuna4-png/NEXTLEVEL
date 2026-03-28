export default function handler(req, res) {
  res.status(200).json({
    message: "Clean Room Reset: API is alive and responsive (No Imports).",
    timestamp: new Date().toISOString(),
    node: process.version,
    env: process.env.NODE_ENV
  });
}
