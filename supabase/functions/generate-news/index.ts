import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tweetContent } = await req.json();
    
    if (!tweetContent || tweetContent.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Tweet content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating news from tweet content...');

    // Call Lovable AI to generate structured news article
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a professional news editor for Kenya Leo Media. Your task is to convert social media posts (tweets) into verified, professional news articles.

Guidelines:
- Write in a neutral, professional journalistic tone
- Extract key facts and avoid speculation
- Create compelling but accurate headlines
- Write concise summaries (2-3 sentences, 150-200 chars)
- Write detailed content (3-4 paragraphs, professional journalism style)
- Categorize accurately: breaking, politics, entertainment, sports, technology, business, lifestyle, or trending
- Always cite the source
- Avoid sensationalism or misinformation
- Use inverted pyramid style (most important info first)
- Maintain objectivity and fact-based reporting`
          },
          {
            role: 'user',
            content: `Analyze this tweet and convert it into a professional news article:\n\n${tweetContent}\n\nProvide the response using the extract_news_article function.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_news_article',
              description: 'Extract structured news article data from tweet content',
              parameters: {
                type: 'object',
                properties: {
                  headline: {
                    type: 'string',
                    description: 'Professional, accurate news headline (60-80 characters)'
                  },
                  excerpt: {
                    type: 'string',
                    description: 'Concise summary/lead paragraph (150-200 characters)'
                  },
                  content: {
                    type: 'string',
                    description: 'Full article content in professional journalistic style (3-4 paragraphs, markdown format)'
                  },
                  category: {
                    type: 'string',
                    enum: ['breaking', 'politics', 'entertainment', 'sports', 'technology', 'business', 'lifestyle', 'trending'],
                    description: 'Article category based on content analysis'
                  },
                  source_reference: {
                    type: 'string',
                    description: 'How to reference the source (e.g., "Twitter/X", "Social Media", specific handle if known)'
                  }
                },
                required: ['headline', 'excerpt', 'content', 'category', 'source_reference'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_news_article' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please top up your workspace credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate article' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    console.log('AI Response received');

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      console.error('No tool call in response:', JSON.stringify(aiResponse));
      return new Response(
        JSON.stringify({ error: 'Failed to extract article data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const articleData = JSON.parse(toolCall.function.arguments);
    console.log('Generated article:', articleData.headline);

    return new Response(
      JSON.stringify({
        success: true,
        article: {
          title: articleData.headline,
          excerpt: articleData.excerpt,
          content: articleData.content,
          category: articleData.category,
          source_reference: articleData.source_reference
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
