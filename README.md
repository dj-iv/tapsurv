# TapSurv Website

Professional marketing website for TapSurv - Mobile Signal Surveys Made Easy

## Overview

TapSurv is a cost-effective solution for conducting in-building mobile network surveys. This website showcases the app's features and capabilities to potential customers in the UK market.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **Hosting**: Vercel
- **Backend**: Firebase (for form submissions and future CMS)
- **Analytics**: Google Analytics (ready to activate)

## Features

- ✅ Responsive single-page design
- ✅ Modern, professional UI with TapSurv branding
- ✅ Interactive navigation and smooth scrolling
- ✅ Demo request form
- ✅ Contact form
- ✅ Newsletter signup
- ✅ Case study section
- ✅ Feature showcase
- ✅ Integration highlights (Siretta, CEL-FI Compass)

## Project Structure

```
site/
├── index.html          # Main website file
├── js/
│   └── main.js        # JavaScript functionality
├── images/
│   ├── logo.png       # TapSurv logo
│   ├── mainscreen.png # App interface screenshot
│   └── surveyscreen.png # Survey heat map screenshot
├── vercel.json        # Vercel deployment config
└── README.md          # This file
```

## Local Development

1. Simply open `index.html` in your browser
2. Or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

## Deployment to Vercel

### First Time Setup:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd site
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: tapsurv
   - Directory: ./
   - Override settings: No

### Subsequent Deployments:

```bash
vercel --prod
```

## Firebase Integration

The form submission is ready for Firebase integration. To connect:

1. Create a Firebase project at https://console.firebase.google.com
2. Set up Cloud Functions for form handling
3. Update the `YOUR_FIREBASE_FUNCTION_URL` in `js/main.js`

Example Firebase Function:
```javascript
exports.submitDemoRequest = functions.https.onRequest(async (req, res) => {
  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'POST') {
    const formData = req.body;
    
    // Save to Firestore
    await admin.firestore().collection('demo-requests').add(formData);
    
    // Send email notification (optional)
    // ... your email logic
    
    res.status(200).json({ success: true });
  }
});
```

## Custom Domain Setup (tapsurv.com)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add `tapsurv.com` and `www.tapsurv.com`
4. Update your domain's DNS settings:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

## Google Analytics Setup

When ready to activate analytics:

1. Create a Google Analytics 4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. In `index.html`, uncomment the GA code at the bottom
4. Replace `YOUR-GA-ID` with your actual Measurement ID

## Content Updates

### To Update via Custom App:

The HTML is structured with clear section IDs for easy programmatic updates:
- `#features` - Feature cards
- `#case-study` - Testimonials and case studies
- `#contact` - Contact information

### Manual Updates:

Simply edit `index.html` and redeploy with `vercel --prod`

## Brand Colors

- **Primary (Teal)**: #3B9CA5
- **Primary Dark**: #2E7D85
- **Primary Light**: #4FB1BB
- **Secondary (Navy)**: #1E3A5F
- **Accent (Lime Green)**: #B4D93C
- **Accent Dark**: #9BC234

## Images Needed

The website references these images (you'll need to add the actual files):
- `images/logo.png` - ✅ Already present
- `images/mainscreen.png` - 📸 Add your Signal Info screenshot
- `images/surveyscreen.png` - 📸 Add your Survey heat map screenshot

### Compressing the Hero Video

If you want to compress the raw high-resolution `SurveyVideo.mp4`, the repository includes a helper script that uses ffmpeg to create web-optimized files (`SurveyVideo-small.mp4`, `SurveyVideo-mobile.mp4`, and `SurveyVideo-small.webm`).

1. Install dependencies:

```powershell
cd site
npm install
```

2. Compress the video (this looks for `images/SurveyVideo.mp4` and produces compressed files):

```powershell
npm run compress-video
```

3. The compressed files are stored in `images/` and can be used as the hero video in the site. The site already references the compressed `SurveyVideo-small` and `SurveyVideo-mobile` files.

If the environment doesn't have Node or npm available, you can use `ffmpeg` directly with the following suggested commands:

```powershell
# Desktop optimized H.264
ffmpeg -i images/SurveyVideo.mp4 -c:v libx264 -crf 28 -preset medium -movflags +faststart -c:a aac -b:a 96k -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" images/SurveyVideo-small.mp4

# Mobile optimized H.264
ffmpeg -i images/SurveyVideo.mp4 -c:v libx264 -crf 30 -preset fast -movflags +faststart -c:a aac -b:a 64k -vf "scale=640:-2" images/SurveyVideo-mobile.mp4

# WebM (VP9) for very small size
ffmpeg -i images/SurveyVideo.mp4 -c:v libvpx-vp9 -b:v 0 -crf 35 -deadline good -c:a libopus -b:a 64k -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" images/SurveyVideo-small.webm
```


## TODO for Launch

- [ ] Add actual app screenshots to images folder
- [ ] Set up Firebase project and connect form submission
- [ ] Configure custom domain (tapsurv.com)
- [ ] Add Google Analytics when ready
- [ ] Update contact phone number and email
- [ ] Add Privacy Policy page
- [ ] Add Terms of Service page
- [ ] Test form submissions
- [ ] Test on multiple devices and browsers

## Support

For questions or issues, contact: info@tapsurv.com

---

Built with ❤️ for TapSurv
