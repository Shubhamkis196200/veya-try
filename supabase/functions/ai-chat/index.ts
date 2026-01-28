/**
 * AI Chat Edge Function - Simple Version
 * Calls AWS Bedrock Claude
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AWS credentials from environment
const AWS_ACCESS_KEY = Deno.env.get('AWS_ACCESS_KEY_ID') || '';
const AWS_SECRET_KEY = Deno.env.get('AWS_SECRET_ACCESS_KEY') || '';
const AWS_REGION = 'us-east-1';

async function signAWSRequest(
  method: string,
  url: string,
  body: string,
  service: string
): Promise<Record<string, string>> {
  const encoder = new TextEncoder();
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  
  const parsedUrl = new URL(url);
  const host = parsedUrl.host;
  const path = parsedUrl.pathname;
  
  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';
  
  const payloadHash = await crypto.subtle.digest('SHA-256', encoder.encode(body));
  const payloadHashHex = Array.from(new Uint8Array(payloadHash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  
  const canonicalRequest = [method, path, '', canonicalHeaders, signedHeaders, payloadHashHex].join('\n');
  
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${AWS_REGION}/${service}/aws4_request`;
  
  const canonicalRequestHash = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest));
  const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  
  const stringToSign = [algorithm, amzDate, credentialScope, canonicalRequestHashHex].join('\n');
  
  async function hmacSha256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    return await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  }
  
  const kDate = await hmacSha256(encoder.encode(`AWS4${AWS_SECRET_KEY}`), dateStamp);
  const kRegion = await hmacSha256(kDate, AWS_REGION);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  
  const signature = await hmacSha256(kSigning, stringToSign);
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  
  const authHeader = `${algorithm} Credential=${AWS_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;
  
  return {
    'Authorization': authHeader,
    'X-Amz-Date': amzDate,
    'Content-Type': 'application/json',
  };
}

async function callBedrock(message: string, userData: any): Promise<string> {
  const systemPrompt = `You are Veya, a mystical AI astrologer. You speak with warmth and cosmic wisdom.
The user's name is ${userData?.name || 'friend'} and their sun sign is ${userData?.sunSign || 'unknown'}.
Keep responses concise (2-3 sentences) and sprinkle in astrological insights.`;

  const requestBody = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: 'user', content: message }],
  });

  const modelId = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
  const url = `https://bedrock-runtime.${AWS_REGION}.amazonaws.com/model/${modelId}/invoke`;

  const headers = await signAWSRequest('POST', url, requestBody, 'bedrock');

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Bedrock error:', errorText);
    throw new Error(`Bedrock API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'The stars are quiet...';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userData } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await callBedrock(message, userData);

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request', response: 'The cosmos is resting. Try again soon.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
