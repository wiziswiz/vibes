import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, createModifyPrompt } from '@/lib/claude/prompts';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function generateWithGemini(
  prompt: string,
  currentCode?: string,
  isModification?: boolean,
  referenceImage?: string
): Promise<ReadableStream> {
  // Try flash-lite first (separate quota pool), fall back to flash
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const userMessage = isModification && currentCode
    ? createModifyPrompt(currentCode, prompt)
    : prompt;

  // Build content parts - can include both text and images
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Add reference image if provided
  if (referenceImage) {
    const matches = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
      parts.push({
        text: `${SYSTEM_PROMPT}\n\nUse this reference image as inspiration for the visual style, colors, or characters in the creation. User request: ${userMessage}`,
      });
    } else {
      parts.push({ text: `${SYSTEM_PROMPT}\n\nUser request: ${userMessage}` });
    }
  } else {
    parts.push({ text: `${SYSTEM_PROMPT}\n\nUser request: ${userMessage}` });
  }

  const result = await model.generateContentStream(parts);

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('Gemini streaming error:', error);
        controller.error(error);
      }
    },
  });
}
