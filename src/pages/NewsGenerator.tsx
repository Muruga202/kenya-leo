import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  source_reference: string;
}

const NewsGenerator = () => {
  const [tweetContent, setTweetContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!tweetContent.trim()) {
      toast({
        title: "Content required",
        description: "Please paste tweet content to generate news",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedArticle(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-news', {
        body: { tweetContent: tweetContent.trim() }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success && data?.article) {
        setGeneratedArticle(data.article);
        toast({
          title: "Article generated!",
          description: "Review the generated content below",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!generatedArticle) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save articles",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }

      const { error } = await supabase.from('articles').insert([{
        title: generatedArticle.title,
        excerpt: generatedArticle.excerpt,
        content: generatedArticle.content,
        category: generatedArticle.category as any,
        source_url: sourceUrl.trim() || null,
        source_reference: generatedArticle.source_reference,
        author_id: user.id,
        published: false,
      }]);

      if (error) throw error;

      toast({
        title: "Article saved!",
        description: "You can edit and publish it from the admin dashboard",
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save article",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      breaking: "bg-breaking text-white",
      politics: "bg-primary text-white",
      sports: "bg-secondary text-white",
      entertainment: "bg-accent text-black",
      technology: "bg-blue-600 text-white",
      business: "bg-green-600 text-white",
      lifestyle: "bg-purple-600 text-white",
      trending: "bg-trending text-white",
    };
    return colors[category] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-accent" />
            AI News Generator
          </h1>
          <p className="text-muted-foreground">
            Convert tweets into professional news articles with AI-powered analysis and categorization
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Source Content</CardTitle>
              <CardDescription>
                Paste tweet content or text from trusted sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sourceUrl">Source URL (Optional)</Label>
                <Textarea
                  id="sourceUrl"
                  placeholder="https://twitter.com/..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="mt-2"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="tweetContent">Tweet Content *</Label>
                <Textarea
                  id="tweetContent"
                  placeholder="Paste the tweet text here..."
                  value={tweetContent}
                  onChange={(e) => setTweetContent(e.target.value)}
                  className="mt-2 min-h-[200px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !tweetContent.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Article...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate News Article
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Article Preview */}
          {generatedArticle && (
            <Card className="border-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Generated Article
                    </CardTitle>
                    <CardDescription>
                      Review and save to publish later
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryColor(generatedArticle.category)}>
                    {generatedArticle.category.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Headline */}
                <div>
                  <Label className="text-sm text-muted-foreground">Headline</Label>
                  <h2 className="text-2xl font-bold mt-2 leading-tight">
                    {generatedArticle.title}
                  </h2>
                </div>

                {/* Excerpt */}
                <div>
                  <Label className="text-sm text-muted-foreground">Summary</Label>
                  <p className="text-lg text-muted-foreground mt-2 leading-relaxed">
                    {generatedArticle.excerpt}
                  </p>
                </div>

                {/* Content */}
                <div>
                  <Label className="text-sm text-muted-foreground">Full Article</Label>
                  <div className="prose prose-lg max-w-none mt-2 text-foreground">
                    {generatedArticle.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <AlertCircle className="h-4 w-4" />
                  <span>Source: {generatedArticle.source_reference}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveArticle}
                    disabled={isSaving}
                    size="lg"
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Article'
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setGeneratedArticle(null);
                      setTweetContent("");
                      setSourceUrl("");
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Generate Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsGenerator;
