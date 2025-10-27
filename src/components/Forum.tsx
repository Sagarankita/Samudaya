import { useState } from "react";
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

export function Forum() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const threads = [
    {
      id: "1",
      title: "Ideas for Winter Festival Activities",
      author: "Priya Sharma",
      category: "Ideas",
      replies: 12,
      likes: 24,
      tags: ["Suggestion", "Event Planning"],
      isPinned: true,
      createdAt: "2 hours ago",
      lastActivity: "15 min ago",
    },
    {
      id: "2",
      title: "Parking Arrangements at Nehru Stadium",
      author: "Amit Patel",
      category: "Help",
      replies: 5,
      likes: 8,
      tags: ["Question", "Logistics"],
      isPinned: false,
      createdAt: "5 hours ago",
      lastActivity: "1 hour ago",
    },
    {
      id: "3",
      title: "Thank You to All Cleanup Day Volunteers!",
      author: "Sneha Reddy",
      category: "Feedback",
      replies: 18,
      likes: 45,
      tags: ["Appreciation"],
      isPinned: false,
      createdAt: "1 day ago",
      lastActivity: "3 hours ago",
    },
    {
      id: "4",
      title: "Suggestion: Monthly Community Potluck",
      author: "Vikram Singh",
      category: "Ideas",
      replies: 22,
      likes: 38,
      tags: ["Suggestion", "Resolved"],
      isPinned: false,
      createdAt: "2 days ago",
      lastActivity: "5 hours ago",
    },
    {
      id: "5",
      title: "How to Register New Volunteers?",
      author: "Anjali Gupta",
      category: "Help",
      replies: 7,
      likes: 11,
      tags: ["Question"],
      isPinned: false,
      createdAt: "3 days ago",
      lastActivity: "1 day ago",
    },
  ];

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
                <Input id="thread-title" placeholder="Thread title" className="bg-input-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thread-category">Category *</Label>
                <Select>
                  <SelectTrigger id="thread-category" className="bg-input-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideas">Ideas</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="help">Help</SelectItem>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thread-tags">Tags (comma separated)</Label>
                <Input id="thread-tags" placeholder="suggestion, event, help" className="bg-input-background" />
              </div>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
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
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className={thread.isPinned ? "border-emerald-500 border-2" : ""}
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {thread.author
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
                        <span>by {thread.author}</span>
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
                    {thread.tags.map((tag, idx) => (
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
