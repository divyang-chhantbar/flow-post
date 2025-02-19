import transporter from "@/lib/smtpTransporter";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<Response> {
  try {
    const emailHTML = `
      <html lang="en" dir="ltr">
        <head>
          <title>Verification Code</title>
        </head>
        <body>
          <h2>Hello ${username},</h2>
          <p>Your verification code is: <strong>${verifyCode}</strong></p>
          <p>Please use this code to verify your account.</p>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER, // Your Gmail address
      to: email,
      subject: 'Flow-Post Verification Code',
      html: emailHTML,
    });

    console.log("Message sent: %s", info.messageId);
    return new Response(JSON.stringify({
        success: true,
        message: "Verification email sent successfully."
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return new Response(JSON.stringify({
        success: false,
        message: "Error sending verification email."
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
  }
}