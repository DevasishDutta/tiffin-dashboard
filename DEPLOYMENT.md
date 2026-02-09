# 🚀 Complete Deployment Guide

## Phase 2: Web Dashboard Setup

### Part A: Google Apps Script Deployment

#### Step 1: Update Your Google Sheet Script

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Replace ALL existing code with the new API-enabled script (provided separately)
4. Click **Save** (disk icon)

#### Step 2: Deploy as Web App

1. In Apps Script editor, click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Tiffin Service API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [Your Project]**
9. Click **Allow**
10. **COPY THE WEB APP URL** - you'll need this!
    - Example: `https://script.google.com/macros/s/ABC123.../exec`

#### Step 3: Get Your API Token

1. Back in your Google Sheet
2. Menu: **🍱 Tiffin Service > 🔑 Show API Token**
3. **COPY THE TOKEN** - keep this secret!
4. Save both URL and Token in a safe place

---

### Part B: Frontend Dashboard Deployment

You have 3 deployment options:

---

## Option 1: Vercel (Recommended - Easiest & Free)

### Step 1: Prepare Your Code

```bash
# Navigate to the dashboard folder
cd tiffin-dashboard

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub

1. Go to [github.com](https://github.com)
2. Click **New repository**
3. Name: `tiffin-dashboard`
4. Click **Create repository**
5. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/tiffin-dashboard.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** (use GitHub)
3. Click **Add New > Project**
4. Import your `tiffin-dashboard` repository
5. Click **Deploy**
6. Wait 2-3 minutes
7. Click **Visit** to see your live dashboard!

### Step 4: Use Your Dashboard

1. Open the Vercel URL (e.g., `https://tiffin-dashboard.vercel.app`)
2. Enter your **Web App URL** from Step A
3. Enter your **API Token** from Step A
4. Click **Login**
5. Done! 🎉

---

## Option 2: Netlify (Alternative Free Option)

### Step 1: Prepare Code (same as Vercel)

```bash
cd tiffin-dashboard
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub (same as Vercel)

### Step 3: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **Sign Up** (use GitHub)
3. Click **Add new site > Import an existing project**
4. Choose **GitHub**
5. Select your repository
6. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
7. Click **Deploy site**
8. Wait 3-5 minutes
9. Your site is live!

---

## Option 3: Local/Self-Hosted

### For Testing Locally

```bash
cd tiffin-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### For Production (Your Own Server)

```bash
# Build the app
npm run build

# Start production server
npm start
```

The app runs on port 3000.

---

## Testing Your Setup

### 1. Test API Connection

Open Google Apps Script:

```javascript
function testAPI() {
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  const token = configSheet.getRange('B2').getValue();
  
  Logger.log('Your API Token: ' + token);
  Logger.log('Test this in your dashboard!');
}
```

Run the function and check the token.

### 2. Test Dashboard Login

1. Open your deployed dashboard URL
2. Enter Web App URL
3. Enter API Token
4. Click Login
5. You should see the dashboard with stats

### 3. Test Kitchen List Generation

1. Select today's date
2. Choose "Lunch"
3. Click "Generate Kitchen List"
4. Check that:
   - Stats appear
   - Order count is correct
   - Download button works

---

## Troubleshooting

### "Invalid authentication token"

- Check that you copied the token correctly
- Make sure there are no extra spaces
- Regenerate token if needed (run `step1_setupSheets` again)

### "Failed to connect"

- Verify Web App URL is correct
- Check that deployment is set to "Anyone" access
- Try redeploying the Apps Script

### "CORS error"

- This is normal for Google Apps Script
- The app should still work
- If not, check browser console for details

### Dashboard shows no stats

- Check that "Order Database" sheet has data
- Verify API token is correct
- Check Apps Script execution logs

---

## Security Best Practices

1. **Never share your API Token** publicly
2. **Use HTTPS** for your dashboard (Vercel/Netlify do this automatically)
3. **Regenerate tokens** if compromised
4. **Keep backups** of your Google Sheet
5. **Test thoroughly** before giving to clients

---

## Next Steps After Deployment

1. **Bookmark the dashboard URL**
2. **Save credentials** securely
3. **Create user documentation** for tiffin owners
4. **Test with real data**
5. **Set up client onboarding** process

---

## Client Onboarding Process

For each new tiffin service client:

1. **Create new Google Sheet** (copy template)
2. **Create new Google Form** (copy template)
3. **Connect Form to Sheet**
4. **Run setup scripts** (step1 and step2)
5. **Deploy as Web App**
6. **Get API credentials**
7. **Provide dashboard URL**
8. **Share credentials** securely
9. **Train on usage**
10. **Done!**

---

## Support

Need help? Check:
- README.md in the dashboard folder
- Google Sheet menu for API credentials
- Apps Script execution logs for errors
- Browser console for frontend errors

Good luck with your deployment! 🚀
