# Ollama Setup Guide for Crop Recommendation

This guide will help you set up Ollama for local AI-powered crop recommendations.

## 🚀 Quick Start

### Step 1: Download & Install Ollama
1. Visit [Ollama.ai](https://ollama.ai)
2. Download for your OS (Windows, Mac, or Linux)
3. Run the installer

### Step 2: Start Ollama Server
Open a terminal and run:
```bash
ollama serve
```

You should see:
```
Starting Ollama server...
Listening on 127.0.0.1:11434
```

### Step 3: Pull a Model
In a **new terminal**, download a model:

**Recommended (Fast & Accurate):**
```bash
ollama pull mistral
```

**Or alternatives:**
```bash
# Smaller & faster (less accurate)
ollama pull neural-chat

# Larger & more accurate (slower)
ollama pull llama2
```

### Step 4: Configure Environment Variables
Create or edit `.env.local` in your project root:

```env
# Ollama Configuration
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OLLAMA_MODEL=mistral
```

### Step 5: Restart Your Dev Server
```bash
npm run dev
```

## ✅ Testing

1. Go to Dashboard → Crop Recommendation
2. Fill in soil parameters
3. Click "Get Recommendations"

If it works, you should see real crop suggestions!

## 🆘 Troubleshooting

### "Cannot connect to Ollama"
- ✅ Make sure `ollama serve` is running in a terminal
- ✅ Check URL: http://localhost:11434 (default)

### "Ollama responding too slow"
- Switch to a faster model:
  ```bash
  ollama pull neural-chat
  ```
  Then update `.env.local`:
  ```env
  NEXT_PUBLIC_OLLAMA_MODEL=neural-chat
  ```

### "Model not found"
- Ensure you ran `ollama pull mistral` (or your chosen model)
- Verify with: `ollama list`

### Out of memory errors
- Use a smaller model: `ollama pull neural-chat`
- Reduce model size in Ollama settings

## 📊 Model Comparison

| Model | Speed | Accuracy | Memory | Best For |
|-------|-------|----------|--------|----------|
| neural-chat | ⚡⚡⚡ Fast | ⭐⭐ | 3GB | Quick responses |
| mistral | ⚡⚡ Medium | ⭐⭐⭐⭐ | 5GB | Balanced (recommended) |
| llama2 | ⚡ Slow | ⭐⭐⭐⭐⭐ | 7GB+ | Best quality |

## 🔄 Switching Back to Cloud APIs

If you want to use ChatGPT or Gemini again, remove the Ollama config and use this instead:

**For ChatGPT:**
```env
NEXT_PUBLIC_OPENAI_API_KEY=sk_your_key_here
```

**For Gemini:**
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

## 📝 Notes

- Ollama runs **completely offline** - no internet needed
- **Free** - no API costs
- First request takes longer (model loading)
- Subsequent requests are much faster
- Crop recommendations work best with mistral or llama2
