const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMentorNotification = async (studentData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'sankar.bhima@gmail.com',
    subject: 'New Student Mentorship Request – NEXT_LEVEL',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #667eea;">New Student Registration</h2>
        <p>A new student has registered and is awaiting approval:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Student Name:</strong> ${studentData.name}</p>
          <p><strong>Student Email:</strong> ${studentData.email}</p>
          <p><strong>Branch:</strong> ${studentData.branch}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <p>Please login to the mentor dashboard to approve or reject this request.</p>
        
        <a href="${process.env.APP_URL}/mentor-dashboard" 
           style="background: #667eea; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Mentor Dashboard
        </a>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent to mentor');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendApprovalEmail = async (studentEmail, studentName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: 'Your NEXT_LEVEL Mentorship Request has been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #667eea;">Welcome to NEXT_LEVEL!</h2>
        <p>Dear ${studentName},</p>
        <p>Your mentorship request has been approved by Bhima Sankar Sir. You can now access all features of the platform.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">What you can do now:</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin: 10px 0;">✓ Track your daily study progress</li>
            <li style="margin: 10px 0;">✓ Complete GATE syllabus checklist</li>
            <li style="margin: 10px 0;">✓ Submit daily study reports</li>
            <li style="margin: 10px 0;">✓ View leaderboard rankings</li>
            <li style="margin: 10px 0;">✓ Get motivational quotes from mentor</li>
          </ul>
        </div>
        
        <a href="${process.env.APP_URL}/dashboard" 
           style="background: #667eea; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Your Dashboard
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Remember: "Consistency today becomes confidence on exam day."
        </p>
        <p>— Bhima Sankar Sir | NEXT_LEVEL</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent to student');
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};

module.exports = { sendMentorNotification, sendApprovalEmail };