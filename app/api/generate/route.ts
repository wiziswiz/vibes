import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, createModifyPrompt } from '@/lib/claude/prompts';
import { generateWithGemini } from '@/lib/gemini/client';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type AIProvider = 'claude' | 'gemini';

// Generate a unique error reference code
function generateErrorRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VB-${timestamp}-${random}`;
}

// Error logging with reference codes
function logError(errorRef: string, context: {
  provider?: string;
  prompt?: string;
  error: unknown;
}) {
  const errorMessage = context.error instanceof Error ? context.error.message : String(context.error);
  const errorStack = context.error instanceof Error ? context.error.stack : undefined;

  console.error(`\n========== ERROR ${errorRef} ==========`);
  console.error(`Time: ${new Date().toISOString()}`);
  console.error(`Provider: ${context.provider || 'unknown'}`);
  console.error(`Prompt: ${context.prompt?.substring(0, 100)}...`);
  console.error(`Message: ${errorMessage}`);
  if (errorStack) {
    console.error(`Stack: ${errorStack}`);
  }
  console.error(`========================================\n`);
}

async function generateWithClaude(
  prompt: string,
  currentCode?: string,
  isModification?: boolean,
  referenceImage?: string
): Promise<ReadableStream> {
  const userMessage = isModification && currentCode
    ? createModifyPrompt(currentCode, prompt)
    : prompt;

  // Build content array - can include both text and images
  const content: Array<{ type: 'text'; text: string } | { type: 'image'; source: { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string } }> = [];

  // Add reference image if provided
  if (referenceImage) {
    // Extract base64 data and media type from data URL
    const matches = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      const mediaType = matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
      const base64Data = matches[2];
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data,
        },
      });
      content.push({
        type: 'text',
        text: `Use this reference image as inspiration for the visual style, colors, or characters in the creation. User request: ${userMessage}`,
      });
    } else {
      content.push({ type: 'text', text: userMessage });
    }
  } else {
    content.push({ type: 'text', text: userMessage });
  }

  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const text = event.delta.text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }

          if (event.type === 'message_stop') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          }
        }
        controller.close();
      } catch (error) {
        console.error('Claude streaming error:', error);
        controller.error(error);
      }
    },
  });
}

export async function POST(request: Request) {
  let requestPrompt: string | undefined;

  try {
    const { prompt, currentCode, isModification, provider, referenceImage } = await request.json();
    requestPrompt = prompt;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine which provider to use
    let selectedProvider: AIProvider = provider || 'claude';

    // Check if API keys are available
    const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY;
    const hasGeminiKey = !!process.env.GOOGLE_AI_API_KEY;

    // If requested provider isn't available, try the other
    if (selectedProvider === 'claude' && !hasClaudeKey && hasGeminiKey) {
      selectedProvider = 'gemini';
    } else if (selectedProvider === 'gemini' && !hasGeminiKey && hasClaudeKey) {
      selectedProvider = 'claude';
    }

    let readable: ReadableStream;

    try {
      if (selectedProvider === 'gemini' && hasGeminiKey) {
        console.log('Using Gemini for generation');
        readable = await generateWithGemini(prompt, currentCode, isModification, referenceImage);
      } else if (hasClaudeKey) {
        console.log('Using Claude for generation');
        readable = await generateWithClaude(prompt, currentCode, isModification, referenceImage);
      } else {
        throw new Error('No AI provider configured. Please add ANTHROPIC_API_KEY or GOOGLE_AI_API_KEY to your .env.local file.');
      }
    } catch (error: unknown) {
      // If Claude fails (e.g., out of credits), try Gemini as fallback
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (selectedProvider === 'claude' && hasGeminiKey &&
          (errorMessage.includes('credit') || errorMessage.includes('rate') || errorMessage.includes('quota'))) {
        console.log('Claude failed, falling back to Gemini:', errorMessage);
        readable = await generateWithGemini(prompt, currentCode, isModification, referenceImage);
      } else {
        throw error;
      }
    }

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-AI-Provider': selectedProvider,
      },
    });
  } catch (error) {
    const errorRef = generateErrorRef();
    logError(errorRef, { prompt: requestPrompt, error });

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate code';

    // Create user-friendly error message
    let userMessage = 'Something went wrong while creating your masterpiece.';
    if (errorMessage.includes('credit') || errorMessage.includes('quota')) {
      userMessage = 'Our AI helpers are taking a break. Please try again in a moment!';
    } else if (errorMessage.includes('rate')) {
      userMessage = 'Whoa, too many requests! Give our AI wizards a few seconds to catch up.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userMessage = 'Having trouble connecting to our magic servers. Check your internet!';
    }

    return new Response(
      JSON.stringify({
        error: userMessage,
        errorRef,
        technicalError: errorMessage,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
