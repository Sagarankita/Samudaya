import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, Plus, ThumbsUp, Search, Pin, Flag } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { forumAPI } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface ForumProps {
  user: any;
}

export function Forum({ user }: ForumProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [threads, setThreads] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await forumAPI.getThreads();
        if (!mounted) return;
        setThreads(data);
      } catch (err: any) {
        setError(err.message || "Failed to load threads");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Ideas":
        return "bg-purple-500";
      case "Feedback":
        return "bg-blue-500";
      case "Help":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Community Forum</h1>
          <p className="text-muted-foreground mt-1">
            Discuss ideas, ask questions, and share feedback
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Thread</DialogTitle>
              <DialogDescription>
                Start a discussion with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="thread-title">Title *</Label>
                <Input id="thread-title" placeholder="Thread title" className="bg-input-background" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thread-category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="thread-category" className="bg-input-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ideas">Ideas</SelectItem>
                    <SelectItem value="Feedback">Feedback</SelectItem>
                    <SelectItem value="Help">Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thread-content">Content *</Label>
                <Textarea
                  id="thread-content"
                  placeholder="Share your thoughts..."
                  rows={6}
                  className="bg-input-background"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thread-tags">Tags (comma separated)</Label>
                <Input id="thread-tags" placeholder="suggestion, event, help" className="bg-input-background" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={async () => {
                    try {
                      setError("");
                      await forumAPI.createThread({
                        title,
                        author: user?.name || "User",
                        category,
                        tags: tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      });
                      const data = await forumAPI.getThreads();
                      setThreads(data);
                      setTitle("");
                      setCategory("");
                      setContent("");
                      setTags("");
                    } catch (err: any) {
                      setError(err.message || "Failed to post thread");
                    }
                  }}
                >
                  Post Thread
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-10 bg-input-background"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ideas">Ideas</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="help">Help</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Legend */}
      <Card>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading && <p className="text-muted-foreground">Loading threads...</p>}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Ideas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Help</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threads List */}
      <div className="space-y-4">
        {threads
          .filter((t) => (categoryFilter === "all" ? true : t.category === categoryFilter))
          .map((thread) => (
          <Card
            key={thread._id || thread.id}
            className={thread.isPinned ? "border-emerald-500 border-2" : ""}
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {(thread.author?.name || thread.author || "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.isPinned && (
                          <Pin className="h-4 w-4 text-emerald-600" />
                        )}
                        <h4 className="hover:text-emerald-600 cursor-pointer">
                          {thread.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>by {thread.author?.name || thread.author}</span>
                        <span>•</span>
                        <span>{thread.createdAt}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className={`${getCategoryColor(thread.category)} text-white`}
                    >
                      {thread.category}
                    </Badge>
                    {thread.tags?.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{thread.likes} likes</span>
                    </div>
                    <span>Last activity: {thread.lastActivity}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
