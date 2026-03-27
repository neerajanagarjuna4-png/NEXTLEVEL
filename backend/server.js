import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import serverless from 'serverless-http'

// Route imports
import authRoutes from './routes/auth.js'
import studentRoutes from './routes/student.js'
import mentorRoutes from './routes/mentor.js'
import queryRoutes from './routes/queries.js'
import storyRoutes from './routes/stories.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// ——————————————————————————————————————————————
// MongoDB Connection
// ——————————————————————————————————————————————
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextlevel'

let isConnected = false

const connectDB = async () => {
  if (isConnected) return
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message)
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1)
    }
  }
}

// Connect on startup
connectDB()

// Ensure DB connection for each request in serverless
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB()
  }
  next()
})

// ——————————————————————————————————————————————
// API Routes
// ——————————————————————————————————————————————
app.use('/api/auth', authRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/mentor', mentorRoutes)
app.use('/api/queries', queryRoutes)
app.use('/api/stories', storyRoutes)

// Legacy: Keep the notify-mentor endpoint for backward compatibility
app.post('/api/notify-mentor', async (req, res) => {
  const { sendMentorNotification } = await import('./services/emailService.js')
  const { studentName, studentEmail, branch } = req.body
  try {
    await sendMentorNotification({ name: studentName, email: studentEmail, branch })
    res.status(200).json({ success: true, message: 'Notification sent' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(200).json({ success: false, error: 'Failed to send notification' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dbConnected: isConnected,
    timestamp: new Date().toISOString()
  })
})

// ——————————————————————————————————————————————
// Export & Local Dev
// ——————————————————————————————————————————————
export default serverless(app)

const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`))
}
