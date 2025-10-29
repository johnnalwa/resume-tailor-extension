# 🔑 Gemini API Setup Guide

## ✅ What Changed

Your extension now uses **Google's Gemini API** as a fallback instead of OpenAI!

### Why Gemini?
- ✅ **Free tier** - 60 requests per minute
- ✅ **No credit card required**
- ✅ **Easy setup** - Get API key in 30 seconds
- ✅ **Powerful** - Gemini Pro model
- ✅ **Same company** - Google (like Chrome Built-in AI)

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Free Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** (or use existing)
4. Copy the API key (starts with `AIza...`)

### Step 2: Add to Extension

1. Open the Resume Tailor extension
2. Go to **Setup** tab
3. Scroll to **"Advanced Settings (Optional)"**
4. Paste your Gemini API key
5. Done! ✅

---

## 🎯 How It Works

### Primary: Chrome Built-in AI (Gemini Nano)
```
User clicks "Generate"
    ↓
Try Chrome Built-in AI first
    ↓
✅ Success → Use result
```

### Fallback: Gemini API (Gemini Pro)
```
Chrome Built-in AI unavailable
    ↓
Check for Gemini API key
    ↓
If key exists → Use Gemini API
    ↓
✅ Success → Use result
```

### No API Key
```
Chrome Built-in AI unavailable
    ↓
No API key found
    ↓
❌ Show error: "Please add Gemini API key"
```

---

## 📊 Gemini API vs Chrome Built-in AI

| Feature | Chrome Built-in AI | Gemini API |
|---------|-------------------|------------|
| **Model** | Gemini Nano | Gemini Pro |
| **Location** | On-device | Cloud |
| **Privacy** | 100% local | Sent to Google |
| **Speed** | Instant | 2-5 seconds |
| **Offline** | ✅ Yes | ❌ No |
| **Cost** | Free | Free (with limits) |
| **Setup** | Chrome flags | API key |
| **Availability** | Chrome 120+ | Always |

---

## 🔧 Technical Details

### API Endpoint:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Request Format:
```javascript
{
  contents: [{
    parts: [{
      text: "Your prompt here..."
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
    topP: 0.8,
    topK: 40
  }
}
```

### Response Format:
```javascript
{
  candidates: [{
    content: {
      parts: [{
        text: "Generated cover letter..."
      }]
    }
  }]
}
```

---

## 💰 Gemini API Pricing

### Free Tier:
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

### For This Extension:
- Average cover letter = ~1,000 tokens
- **You can generate ~1,000 cover letters per month for FREE**
- More than enough for job searching!

---

## 🔒 Privacy & Security

### API Key Storage:
- Stored in **browser's local storage**
- **Never sent to our servers** (we don't have any!)
- Only sent to Google's Gemini API

### Data Transmission:
- Resume and job description sent to Google
- Only when using Gemini API fallback
- **Not sent** when using Chrome Built-in AI

### Recommendation:
- Use Chrome Built-in AI when possible (100% private)
- Use Gemini API only as fallback

---

## 🎨 UI Changes

### Before (OpenAI):
```
OpenAI API Key [Optional Fallback]
sk-... (only if Chrome AI unavailable)
```

### After (Gemini):
```
Gemini API Key [Optional Fallback]
AIza... (only if Chrome AI unavailable)
Get your free API key from Google AI Studio
```

---

## 🧪 Testing

### Test Chrome Built-in AI:
1. Enable Chrome flags (see INSTALLATION.md)
2. Don't add API key
3. Generate cover letter
4. Should use Chrome Built-in AI ✅

### Test Gemini API Fallback:
1. Disable Chrome Built-in AI flags
2. Add Gemini API key
3. Generate cover letter
4. Should use Gemini API ✅

### Test Error Handling:
1. Disable Chrome Built-in AI
2. Don't add API key
3. Try to generate
4. Should show error message ✅

---

## 📝 Code Changes

### 1. **New Gemini API Function** (`service-worker.js`)
```javascript
async function generateWithGemini({ jobDescription, resume, tone, apiKey }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    }
  );
  
  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
}
```

### 2. **Automatic Fallback** (`service-worker.js`)
```javascript
try {
  // Try Chrome Built-in AI first
  coverLetter = await generateWithBuiltInAI({...});
} catch (builtInError) {
  // Fallback to Gemini API if available
  if (apiKey) {
    coverLetter = await generateWithGemini({...});
  } else {
    throw new Error('Please add a Gemini API key');
  }
}
```

### 3. **Updated UI** (`Popup.jsx`)
```jsx
<label htmlFor="api-key">
  Gemini API Key 
  <span className="optional-badge">Optional Fallback</span>
</label>
<input
  placeholder="AIza... (only if Chrome AI unavailable)"
/>
<small>
  Get your free API key from 
  <a href="https://makersuite.google.com/app/apikey">
    Google AI Studio
  </a>
</small>
```

---

## ❓ FAQ

### Q: Do I need an API key?
**A:** No! If Chrome Built-in AI is working, you don't need an API key. It's only a fallback.

### Q: Is Gemini API free?
**A:** Yes! Free tier includes 60 requests/minute and 1,500 requests/day.

### Q: Do I need a credit card?
**A:** No! Gemini API free tier doesn't require payment info.

### Q: Which is better - Built-in AI or Gemini API?
**A:** Chrome Built-in AI (Gemini Nano) is better for privacy and speed. Gemini API (Gemini Pro) is more powerful and always available.

### Q: Can I use both?
**A:** Yes! The extension automatically uses Built-in AI first, then falls back to Gemini API if needed.

### Q: What about OpenAI?
**A:** We switched to Gemini because it's free, doesn't require a credit card, and is from the same company as Chrome Built-in AI.

---

## 🚀 Next Steps

1. **Get API Key**: https://makersuite.google.com/app/apikey
2. **Add to Extension**: Setup tab → Advanced Settings
3. **Test It**: Try generating a cover letter
4. **Enjoy**: Unlimited cover letters! 🎉

---

## 📚 Resources

- **Get API Key**: https://makersuite.google.com/app/apikey
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Rate Limits**: https://ai.google.dev/docs/rate_limits

---

**Your extension now has a powerful, free fallback option!** 🎉
