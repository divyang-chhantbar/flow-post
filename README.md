# 🚀 Flow-Post

Flow-Post is a broadcast email service designed to help users send emails efficiently by categorizing recipients into groups. Users can compose emails and send them to entire categories, avoiding repetitive email writing.

## ✨ Features

- **User Authentication** 🔐
  - ✅ Sign up and email verification
  - 🔜 (Future) Two-factor authentication (2FA)
  - 🔜 (Future) Role-based access control (User/Admin)
  - 🔜 (Future) Admins can send unlimited emails via Stripe subscription

- **Recipient & Category Management** 📂
  - 🏷️ Create categories to organize recipients
  - 📋 Add recipients (name, email, category assignment)
  - 📢 Categories function like WhatsApp broadcast lists

- **Email Composition & Sending** ✉️
  - 📩 Select categories to send emails to all recipients within them
  - 📤 Emails are sent via Gmail SMTP with OAuth authentication
  - 👤 Each user sends emails from their own Gmail account

- **Dashboard UI** 🖥️
  - 📑 Sidebar with categories & recipients, inbox, and sent emails
  - 📝 Email composer for drafting and sending emails
  - 📬 Sent Emails & Inbox (Upcoming feature)

## 🛠️ Tech Stack

### Frontend:
- ⚛️ **Next.js** - Framework for React-based UI development
- 🎨 **ShadCN & Aceternity UI** - For styling and UI components
- 🔐 **NextAuth.js** - Authentication & session management
- 🔄 **Axios** - API requests

### Backend:
- 🏗️ **Node.js & Express** - Backend framework
- 🗄️ **MongoDB** - Database for storing users, categories, and recipients
- 📧 **Nodemailer** - SMTP email delivery
- 📩 **SendGrid** - Alternative email delivery option

## 📌 Installation

### Prerequisites ⚙️
- Node.js (v18+)
- MongoDB (local or cloud-based like MongoDB Atlas)
- Gmail Developer OAuth Credentials (for SMTP authentication)

### Steps 📥
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flow-post.git
   cd flow-post
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```env
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your_mongo_db_connection
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your_gmail_address
   SMTP_PASS=your_gmail_app_password
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Frontend 🌍
- Deploy on **Vercel**
  ```bash
  vercel deploy
  ```

### Backend 🖥️
- Deploy on **Railway, Render, or DigitalOcean**
  ```bash
  npm run start
  ```

## 🔮 Future Roadmap
- 🔜 Role-based authentication (User/Admin)
- 🔜 Two-factor authentication (2FA)
- 🔜 Stripe subscription for unlimited emails
- 🔜 Inbox feature for receiving replies
- 🔜 Enhanced email tracking (open/click analytics)
- 🔜 AI-powered email generation

## 🤝 Contributing
Contributions are welcome! Feel free to open issues and pull requests.

## 📜 License
MIT License
