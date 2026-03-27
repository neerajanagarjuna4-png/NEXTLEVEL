import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendMentorNotification = async (studentData) => {
  const appUrl = process.env.APP_URL || 'https://nextlevel-snowy.vercel.app';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MENTOR_EMAIL || 'sankar.bhima@gmail.com',
    subject: `New Student Mentorship Request – NEXT_LEVEL: ${studentData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #667eea;">New Student Registration</h2>
        <p>A new student has registered and is awaiting approval:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${studentData.name}</p>
          <p><strong>Email:</strong> ${studentData.email}</p>
          <p><strong>Branch:</strong> ${studentData.branch}</p>
        </div>
        <a href="${appUrl}/mentor-dashboard"
           style="background: #667eea; color: white; padding: 10px 20px;
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Mentor Dashboard
        </a>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log('Notification email sent to mentor');
    } else {
      console.log('[SIMULATED] Mentor notification email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendApprovalEmail = async (studentEmail, studentName) => {
  const appUrl = process.env.APP_URL || 'https://nextlevel-snowy.vercel.app';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: 'Your NEXT_LEVEL Mentorship Request has been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #667eea;">Welcome to NEXT_LEVEL!</h2>
        <p>Dear ${studentName},</p>
        <p>Your mentorship request has been approved by Bhima Sankar Sir.</p>
        <a href="${appUrl}/dashboard"
           style="background: #667eea; color: white; padding: 10px 20px;
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Your Dashboard
        </a>
        <p style="margin-top: 30px; color: #666;">
          "Consistency today becomes confidence on exam day." — Bhima Sankar Sir
        </p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log('Approval email sent to student');
    } else {
      console.log('[SIMULATED] Approval email to student');
    }
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const appUrl = process.env.APP_URL || 'https://nextlevel-snowy.vercel.app';
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'NEXT_LEVEL – Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #667eea;">Password Reset</h2>
        <p>You requested a password reset. Click the link below (valid for 1 hour):</p>
        <a href="${resetLink}"
           style="background: #667eea; color: white; padding: 10px 20px;
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p style="margin-top: 20px; color: #666;">If you didn't request this, ignore this email.</p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log('Reset email sent');
    } else {
      console.log(`[SIMULATED] Reset link: ${resetLink}`);
    }
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

export const sendQueryAnswerEmail = async (studentEmail, studentName, question, answer) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: 'Your Query Has Been Answered – NEXT_LEVEL',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #667eea;">Query Answered!</h2>
        <p>Dear ${studentName},</p>
        <p>Bhima Sankar Sir has replied to your query:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Your Question:</strong> ${question}</p>
          <p><strong>Answer:</strong> ${answer}</p>
        </div>
        <p>— NEXT_LEVEL Team</p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('[SIMULATED] Query answer email');
    }
  } catch (error) {
    console.error('Error sending query answer email:', error);
  }
};