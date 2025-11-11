# Firebase Integration Guide for TapSurv Website

## Overview

This guide explains how to integrate Firebase with the TapSurv website for form submissions and future content management.

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name: "TapSurv"
4. Enable Google Analytics (optional for now)
5. Create project

### 2. Set Up Firestore Database

1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location (europe-west2 for UK)
5. Click "Enable"

### 3. Create Firestore Collections

Create these collections:
- `demo-requests` - For demo request form submissions
- `contact-forms` - For general contact inquiries
- `newsletter-signups` - For newsletter subscriptions

### 4. Set Up Cloud Functions

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
cd c:\Users\roman\Documents\tapsurv\site
firebase init
```

Select:
- Functions (for Cloud Functions)
- Firestore (for database)
- Hosting (optional, if not using Vercel)

4. Create the function file `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transport (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Use App Password, not regular password
  }
});

// Demo Request Form Handler
exports.submitDemoRequest = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.company) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Save to Firestore
    const docRef = await admin.firestore().collection('demo-requests').add({
      ...formData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'new'
    });

    // Send notification email to TapSurv team
    const mailOptions = {
      from: 'noreply@tapsurv.com',
      to: 'info@tapsurv.com',
      subject: `New Demo Request from ${formData.company}`,
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Company:</strong> ${formData.company}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${formData.message || 'No message'}</p>
        <p><strong>Newsletter:</strong> ${formData.newsletter ? 'Yes' : 'No'}</p>
        <p><strong>Submitted:</strong> ${formData.timestamp}</p>
        <hr>
        <p><small>Request ID: ${docRef.id}</small></p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationEmail = {
      from: 'info@tapsurv.com',
      to: formData.email,
      subject: 'Thank You for Your Interest in TapSurv',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="https://tapsurv.com/images/logo.png" alt="TapSurv" style="height: 60px; margin: 20px 0;">
          <h2>Thank You, ${formData.firstName}!</h2>
          <p>We've received your demo request and will get back to you within 24 hours.</p>
          <p>In the meantime, feel free to explore more about TapSurv on our website.</p>
          <hr>
          <p><strong>Your Request Details:</strong></p>
          <p>Company: ${formData.company}<br>
          Email: ${formData.email}<br>
          ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            TapSurv - Mobile Signal Surveys Made Easy<br>
            <a href="https://tapsurv.com">tapsurv.com</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(confirmationEmail);

    res.status(200).json({ 
      success: true, 
      message: 'Demo request submitted successfully',
      id: docRef.id 
    });

  } catch (error) {
    console.error('Error processing demo request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Newsletter Signup Handler
exports.subscribeNewsletter = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    await admin.firestore().collection('newsletter-signups').add({
      email,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'website'
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

5. Install dependencies:
```bash
cd functions
npm install nodemailer
```

6. Deploy functions:
```bash
firebase deploy --only functions
```

### 5. Update Website JavaScript

After deploying, you'll get URLs like:
- `https://us-central1-tapsurv.cloudfunctions.net/submitDemoRequest`

Update `js/main.js` line ~38:

```javascript
const response = await fetch('https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/submitDemoRequest', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
});

if (!response.ok) {
    throw new Error('Submission failed');
}

const result = await response.json();
```

### 6. Security Rules (Firestore)

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow Cloud Functions to write
    match /demo-requests/{request} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if false; // Only functions can write
    }
    
    match /newsletter-signups/{signup} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if false; // Only functions can write
    }
  }
}
```

## Email Configuration

### Option 1: Gmail

1. Enable 2-Step Verification in Google Account
2. Generate App Password: Account → Security → App Passwords
3. Use App Password in Cloud Function

### Option 2: SendGrid (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com)
2. Get API key
3. Update Cloud Function:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send(mailOptions);
```

### Option 3: Firebase Extensions

Use the "Trigger Email" extension:
```bash
firebase ext:install firebase/firestore-send-email
```

## Environment Variables

Set environment variables for sensitive data:

```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set sendgrid.key="YOUR-SENDGRID-KEY"
```

Access in functions:
```javascript
const emailConfig = functions.config().email;
```

## Testing

Test the endpoint locally:

```bash
cd functions
firebase emulators:start
```

Then update the fetch URL in main.js to:
```
http://localhost:5001/tapsurv/us-central1/submitDemoRequest
```

## Monitoring

View logs in Firebase Console:
- Functions → Logs
- Firestore → Data

## Cost Estimates

Firebase Free Tier (Spark Plan):
- Cloud Functions: 2M invocations/month
- Firestore: 50K reads, 20K writes/day
- Storage: 1GB

This should be more than enough for the initial launch.

## Next Steps

1. ✅ Create Firebase project
2. ✅ Set up Firestore
3. ✅ Deploy Cloud Functions
4. ✅ Configure email sending
5. ✅ Update website URLs
6. ✅ Test form submissions
7. ✅ Set up monitoring

## Support

Firebase Documentation: https://firebase.google.com/docs
