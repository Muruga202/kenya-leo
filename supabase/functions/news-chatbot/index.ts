import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, category } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    // Fetch published articles (filter by category if provided)
    let query = supabase
      .from('articles')
      .select('id, title, excerpt, content, category, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: articles, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      throw new Error('Failed to fetch articles');
    }

    // Prepare context for AI
    const articlesContext = articles?.map(article => 
      `Title: ${article.title}\nCategory: ${article.category}\nExcerpt: ${article.excerpt}\nContent: ${article.content.substring(0, 500)}...\n`
    ).join('\n---\n');

    const systemPrompt = `You are a helpful news assistant for Kenya Leo Media, a Kenyan news platform. Your role is to:
1. Answer questions about published news articles
2. Provide summaries of news by category (Politics, Sports, Lifestyle, Business, Technology, Entertainment)
3. Help readers discover relevant content
4. Provide accurate information based only on the articles provided

Available articles:
${articlesContext}

Guidelines:
- Only reference information from the provided articles
- Be concise and informative
- When asked about a specific category, focus on those articles
- Suggest related articles when relevant
- If asked about something not in the articles, politely say you don't have that information
- Use a friendly, professional tone`;

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in news-chatbot:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
