import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import serverless from 'serverless-http'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Email Transporter (Configure with your Gmail credentials later)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
})

// Endpoint to send registration email to mentor
app.post('/api/notify-mentor', async (req, res) => {
  const { studentName, studentEmail, branch } = req.body

  const mentorEmail = process.env.MENTOR_EMAIL || 'sankar.bhima@gmail.com'
  const appUrl = process.env.APP_URL || 'http://localhost:5173'

  // The approve/reject links will redirect to the mentor dashboard where they can take action
  const approveLink = `${appUrl}/mentor-dashboard?action=approve&email=${encodeURIComponent(studentEmail)}`
  const rejectLink = `${appUrl}/mentor-dashboard?action=reject&email=${encodeURIComponent(studentEmail)}`

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: mentorEmail,
    subject: `New NEXT_LEVEL Student Registration: ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2563eb, #8b5cf6); padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">New Student Registration</h2>
        </div>
        <div style="padding: 20px; background: #f8fafc;">
          <p style="font-size: 16px; color: #1e293b;">Hello Bhima Sankar Sir,</p>
          <p style="font-size: 15px; color: #475569;">A new student has registered for NEXT_LEVEL mentorship and is waiting for your approval.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${studentName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${studentEmail}</p>
            <p style="margin: 5px 0;"><strong>Branch:</strong> ${branch}</p>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <a href="${approveLink}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">✅ Approve Student</a>
            <a href="${rejectLink}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-left: 10px;">❌ Reject Request</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 13px; color: #64748b;">* Clicking these links will take you to the Mentor Dashboard to confirm the action.</p>
        </div>
      </div>
    `
  }

  try {
    // Only send if real credentials are provided, otherwise simulate success for dev
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${mentorEmail} for student ${studentEmail}`)
    } else {
      console.log(`[SIMULATED] Email would be sent to ${mentorEmail} with approve/reject links.`)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    res.status(200).json({ success: true, message: 'Notification sent' })
  } catch (error) {
    console.error('Email error:', error)
    // Even if it fails, we still return 200 so the frontend signup doesn't break
    res.status(200).json({ success: false, error: 'Failed to send notification, simulated success' })
  }
})

// Export serverless handler for Vercel
export default serverless(app)

// Local development: start the server only when run directly
const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`))
}
