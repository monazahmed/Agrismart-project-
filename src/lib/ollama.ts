/**
 * Ollama integration for local AI inference
 * Crop Recommendation using local LLM models
 */

export async function getCropRecommendationsOllama(prompt: string) {
    const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";
    const ollamaModel = process.env.NEXT_PUBLIC_OLLAMA_MODEL || "phi";

    try {
        console.log(`[Ollama] Using model: ${ollamaModel} at ${ollamaUrl}`);

        // Create abort controller with 60 second timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(`${ollamaUrl}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: ollamaModel,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                stream: false,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await response.json();

        console.log(`[Ollama] Response status: ${response.status}`);
        console.log(`[Ollama] Response data:`, data);

        if (!response.ok) {
            const errorMsg = data?.error || `Ollama API returned ${response.status}`;
            throw new Error(
                `Ollama Error (${response.status}): ${errorMsg}\n\nTroubleshooting:\n1. Make sure Ollama is running\n2. Model "${ollamaModel}" must be installed\n3. Check system memory`
            );
        }

        if (!data.message?.content) {
            throw new Error("No response from Ollama model.");
        }

        return data.message.content;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new Error(
                    "Request timed out. The model is taking too long. Try: ollama pull phi (smallest model)"
                );
            }
            if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
                throw new Error(
                    `Cannot connect to Ollama at ${ollamaUrl}.\n\nFix:\n1. Open Command Prompt\n2. Run: ollama serve\n3. Wait for "Listening on 127.0.0.1:11434"\n4. Retry`
                );
            }
            throw error;
        }
        throw new Error("Unknown error with Ollama");
    }
}
