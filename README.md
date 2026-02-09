# 🍱 Tiffin Manager - Web Dashboard

Simple and clean web dashboard for tiffin service owners to generate kitchen order lists.

## Features

- ✅ Secure login with API token authentication
- 📊 Dashboard with order statistics
- 📋 Kitchen order list generator
- 📥 Excel download functionality
- 🎯 Skip orders functionality
- 📱 Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Google Apps Script Web App URL (or enter it at login).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended - Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

### Option 2: Netlify (Free)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Click "Deploy"

### Option 3: Self-hosted

Build and run on your own server:

```bash
npm run build
npm start
```

## How to Use

1. **Get API Credentials**
   - Open your Google Sheet
   - Menu: 🔑 Show API Token
   - Menu: 🌐 Get Web App URL
   - Save both credentials

2. **Login**
   - Enter your Web App URL
   - Enter your API Token
   - Click "Login"

3. **Generate Kitchen List**
   - Select date (DD/MM/YYYY format)
   - Choose meal type (Lunch/Dinner)
   - Optionally skip orders
   - Click "Generate Kitchen List"
   - Download Excel file

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Google Apps Script
- **Database**: Google Sheets

## Security Notes

- API tokens are stored in browser localStorage
- Always use HTTPS in production
- Keep your API token secret
- Never commit `.env.local` to version control

## Support

For issues or questions, please check your Google Sheet's Tiffin Service menu for API credentials.
