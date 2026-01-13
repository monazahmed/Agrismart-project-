export async function getCropRecommendations(prompt: string) {
  // Check which API to use
  const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (openaiKey) {
    return getCropRecommendationsOpenAI(prompt, openaiKey);
  } else if (geminiKey) {
    return getCropRecommendationsGemini(prompt, geminiKey);
  } else {
    throw new Error(
      "No API key configured. Please set either NEXT_PUBLIC_OPENAI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in your environment variables."
    );
  }
}

async function getCropRecommendationsOpenAI(prompt: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an agricultural expert AI providing crop recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error?.message || "Failed to fetch ChatGPT response.";

    // Handle quota/billing errors
    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("insufficient")
    ) {
      throw new Error(
        "API quota exceeded or insufficient credits. Please check your OpenAI billing at https://platform.openai.com/billing/overview"
      );
    }

    // Handle rate limit errors
    if (errorMessage.includes("rate limit") || response.status === 429) {
      throw new Error(
        "Too many requests. Please wait a moment and try again."
      );
    }

    throw new Error(errorMessage);
  }

  return (
    data.choices?.[0]?.message?.content || "No response from ChatGPT."
  );
}

async function getCropRecommendationsGemini(prompt: string, apiKey: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error?.message || "Failed to fetch Gemini response.";

    // Handle quota exceeded errors
    if (errorMessage.includes("Quota exceeded") || errorMessage.includes("quota")) {
      throw new Error(
        "API quota exceeded. The free tier limit has been reached. Please upgrade to a paid plan at https://aistudio.google.com/apikey to continue using this feature."
      );
    }

    // Handle rate limit errors
    if (errorMessage.includes("rate limit") || response.status === 429) {
      throw new Error(
        "Too many requests. Please wait a moment and try again. If this persists, consider upgrading to a paid plan."
      );
    }

    throw new Error(errorMessage);
  }

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from Gemini."
  );
}
