import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SignatureV4 } from "https://deno.land/x/aws_sign_v4@1.0.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, systemPrompt, conversationHistory } = await req.json();
    
    // Get AWS credentials from Supabase secrets
    const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID");
    const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    const AWS_REGION = Deno.env.get("AWS_REGION") || "us-east-1";
    
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS credentials not configured");
    }
    
    // Build messages
    const messages = [
      ...(conversationHistory || []).slice(-10).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];
    
    // Call Bedrock
    const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
    const endpoint = `https://bedrock-runtime.${AWS_REGION}.amazonaws.com/model/${modelId}/invoke`;
    
    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      system: systemPrompt || "You are Veya, a mystical AI astrologer.",
      messages,
    });
    
    // Sign request with AWS Signature V4
    const signer = new SignatureV4({
      service: "bedrock",
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
    
    const signedRequest = await signer.sign({
      method: "POST",
      url: endpoint,
      headers: { "Content-Type": "application/json" },
      body,
    });
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: signedRequest.headers,
      body,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bedrock error: ${error}`);
    }
    
    const data = await response.json();
    const aiResponse = data.content?.[0]?.text || "The stars are contemplating...";
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
