import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters").max(500),
  content: z.string().min(100, "Content must be at least 100 characters"),
  category: z.enum(["politics", "business", "technology", "sports", "lifestyle", "entertainment"]),
  source_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  source_reference: z.string().max(200).optional(),
});

interface ArticleEditorProps {
  articleId?: string;
  onClose?: () => void;
}

export const ArticleEditor = ({ articleId, onClose }: ArticleEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "politics" as const,
    published: false,
    featured: false,
    trending: false,
    source_url: "",
    source_reference: "",
    image_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('article-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validated = articleSchema.parse(formData);
      
      let imageUrl = formData.image_url || "";
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          toast({
            title: "Image upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const articleData: any = {
        title: validated.title,
        excerpt: validated.excerpt,
        content: validated.content,
        category: validated.category,
        source_url: validated.source_url || null,
        source_reference: validated.source_reference || null,
        image_url: imageUrl || null,
        author_id: user?.id,
        published: formData.published,
        featured: formData.featured,
        trending: formData.trending,
      };

      if (articleId) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId);

        if (error) throw error;

        toast({
          title: "Article updated",
          description: "Your article has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;

        toast({
          title: "Article created",
          description: "Your article has been created successfully",
        });
      }

      if (onClose) {
        onClose();
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error saving article:", error);
        toast({
          title: "Error",
          description: "Failed to save article. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{articleId ? "Edit Article" : "Create New Article"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter article title"
              required
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of the article"
              rows={3}
              required
            />
            {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your article content here..."
              rows={12}
              required
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 max-w-xs rounded-lg" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_url">Source URL (optional)</Label>
            <Input
              id="source_url"
              type="url"
              value={formData.source_url}
              onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              placeholder="https://example.com/original-article"
            />
            {errors.source_url && <p className="text-sm text-destructive">{errors.source_url}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_reference">Source Reference (optional)</Label>
            <Input
              id="source_reference"
              value={formData.source_reference}
              onChange={(e) => setFormData({ ...formData, source_reference: e.target.value })}
              placeholder="e.g., Reuters, Daily Nation"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="trending"
                checked={formData.trending}
                onCheckedChange={(checked) => setFormData({ ...formData, trending: checked })}
              />
              <Label htmlFor="trending">Trending</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {articleId ? "Update Article" : "Create Article"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
