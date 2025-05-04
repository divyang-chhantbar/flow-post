import transporter from "@/lib/smtpTransporter";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<Response> {
  try {
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Flow-Post Verification</title>
          <style>
            :root {
              --brand-color: #3b82f6;
              --text-dark: #1f2937;
              --text-light: #6b7280;
              --bg: #ffffff;
              --code-bg: #f3f4f6;
            }

            @media (prefers-color-scheme: dark) {
              :root {
                --brand-color: #60a5fa;
                --text-dark: #f3f4f6;
                --text-light: #9ca3af;
                --bg: #111827;
                --code-bg: #1f2937;
              }
            }

            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: var(--bg);
              color: var(--text-dark);
              margin: 0;
              padding: 2rem;
              text-align: center;
            }

            .container {
              max-width: 500px;
              margin: auto;
              background: var(--bg);
              border-radius: 12px;
              box-shadow: 0 10px 20px rgba(0,0,0,0.07);
              overflow: hidden;
            }

            .header-img {
              width: 100%;
              max-height: 300px;
              object-fit: cover;
              border-bottom: 1px solid #e5e7eb;
            }

            .title {
              font-size: 1.5rem;
              color: var(--brand-color);
              margin-top: 1rem;
              margin-bottom: 0.5rem;
            }

            .subtitle {
              font-size: 0.95rem;
              color: var(--text-light);
              margin-bottom: 1.5rem;
            }

            .code-box {
              display: inline-block;
              background: var(--code-bg);
              color: var(--brand-color);
              font-size: 1.25rem;
              font-weight: bold;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              letter-spacing: 2px;
              margin-bottom: 1.5rem;
            }

            .cta-button {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              font-size: 0.95rem;
              background-color: var(--brand-color);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin-bottom: 2rem;
              box-shadow: 0 4px 10px rgba(59, 130, 246, 0.25);
            }

            .footer {
              font-size: 0.85rem;
              color: var(--text-light);
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="https://res.cloudinary.com/dzfthaaun/image/upload/v1746359547/ChatGPT_Image_May_4_2025_04_25_43_PM_uhust5.png" alt="Welcome to Flow-Post" class="header-img" />
            <h1 class="title">Welcome to Flow-Post, ${username}!</h1>
            <p class="subtitle">We’re glad you’re here. ✉️<br/>Here’s your verification code:</p>
            <div class="code-box">${verifyCode}</div>
            <br/>
            <p class="footer">
              Please use this code to complete your signup and start sending beautiful broadcasts effortlessly.
              <br/><br/>
              — The Flow-Post Team 💌
            </p>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "✨ Verify Your Flow-Post Account",
      html: emailHTML,
    });

    console.log("Message sent: %s", info.messageId);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification email sent successfully.",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error sending verification email.",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
