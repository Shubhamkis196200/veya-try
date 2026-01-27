# Veya AI Setup with AWS Bedrock

## Architecture
```
App → Supabase Edge Function → AWS Bedrock (Claude) → Response
```

This way:
- ✅ AI works in production
- ✅ Uses your $10k AWS credits
- ✅ Secure (AWS keys stored in Supabase secrets)
- ✅ Fast (Claude Haiku model)

## Step 1: Get AWS Credentials

You need an AWS Access Key with Bedrock permissions.

1. Go to AWS IAM Console: https://console.aws.amazon.com/iam/
2. Create a new user or use existing
3. Attach policy: `AmazonBedrockFullAccess`
4. Create Access Key → Save the Key ID and Secret

## Step 2: Add Secrets to Supabase

Go to: https://supabase.com/dashboard/project/ennlryjggdoljgbqhttb/settings/functions

Add these secrets:
- `AWS_ACCESS_KEY_ID` = your-access-key-id
- `AWS_SECRET_ACCESS_KEY` = your-secret-access-key
- `AWS_REGION` = us-east-1

## Step 3: Deploy Edge Function

Install Supabase CLI:
```bash
npm install -g supabase
```

Login and link project:
```bash
supabase login
supabase link --project-ref ennlryjggdoljgbqhttb
```

Deploy the function:
```bash
cd /home/ubuntu/veya-app
supabase functions deploy generate-reading
```

## Step 4: Test It

```bash
curl -X POST 'https://ennlryjggdoljgbqhttb.supabase.co/functions/v1/generate-reading' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"type": "daily", "zodiacSign": "Aries"}'
```

## Cost Estimate

Using Claude 3 Haiku:
- ~$0.00025 per reading
- 10,000 credits = ~40,000 readings
- Very efficient for horoscopes!

## Models Available

| Model | Cost | Speed | Use Case |
|-------|------|-------|----------|
| Claude 3 Haiku | $0.25/1M tokens | Fast | Daily readings |
| Claude 3 Sonnet | $3/1M tokens | Medium | Detailed readings |
| Claude 3 Opus | $15/1M tokens | Slow | Premium features |

Recommended: Haiku for most features, Sonnet for detailed readings.
