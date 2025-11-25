import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are Moo, a friendly and knowledgeable cattle expert assistant. You help users understand:
- Different cattle breeds and their characteristics
- Farming practices and livestock management
- How the AI cattle breed classification system works
- Agricultural insights and best practices

Always be helpful, concise, and add a friendly "Moo!" or cattle emoji 🐄 occasionally to keep the conversation fun. 
Focus on providing accurate, educational information about cattle and agriculture.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI Gateway error:", response.status, error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Moo?";

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in moo-chat function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Moo! Something went wrong. Please try again later.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
