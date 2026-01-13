/**
 * Ollama integration for local AI inference
 * Crop Recommendation using local LLM models
 */

export async function getCropRecommendationsOllama(prompt: string) {
    const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";
    const ollamaModel = process.env.NEXT_PUBLIC_OLLAMA_MODEL || "mistral";

    try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: ollamaModel,
                prompt: prompt,
                stream: false,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Ollama API returned ${response.status}. Make sure Ollama is running at ${ollamaUrl}`
            );
        }

        const data = await response.json();

        if (!data.response) {
            throw new Error("No response from Ollama model");
        }

        return data.response;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("fetch")) {
                throw new Error(
                    `Cannot connect to Ollama at ${ollamaUrl}. Please make sure Ollama is running locally.\n\n📝 Setup Ollama:\n1. Download from https://ollama.ai\n2. Run: ollama serve\n3. In another terminal: ollama pull mistral (or your preferred model)\n4. Then retry`
                );
            }
            throw error;
        }
        throw new Error("Unknown error with Ollama");
    }
}
