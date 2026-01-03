import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const json = await req.json();
  const { imageBase64 } = json;

  if (!imageBase64) {
    return new Response(JSON.stringify({ error: 'Image data missing' }), { status: 400 });
  }

  try {
    const { object } = await generateObject({
      // 'gemini-1.5-flash' is the fastest vision model, ideal for this pre-scan
      model: google('gemini-2.5-flash'), 
      schema: z.object({
        label: z.string().describe("Short 2-3 word label for the item, e.g., 'Protein Bar'"),
        context: z.string().describe("Inferred user persona or context, e.g., 'Gym/Fitness Enthusiast', 'Vegan Shopper', 'Parent'"),
        confidence: z.number().describe("Confidence score 0-100")
      }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: "Identify this food item and infer the user's likely context/persona based on it. Be concise." },
            { type: 'image', image: imageBase64 } // Vercel AI SDK handles base64 cleaning automatically
          ],
        },
      ],
    });

    return Response.json(object);
    
  } catch (error) {
    console.error("Identify Route Error:", error);
    // Fallback response so the UI doesn't crash if AI fails
    return Response.json({ 
      label: "Food Item", 
      context: "General", 
      confidence: 0 
    });
  }
}