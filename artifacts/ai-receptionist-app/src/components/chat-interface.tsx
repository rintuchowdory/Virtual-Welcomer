import { useState, useRef, useEffect } from "react";
import { useCreateConversation, useListConversationMessages } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@workspace/api-client-react";
import { Link } from "wouter";

export function ChatInterface() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  const createConv = useCreateConversation();
  const initConversation = async () => {
    try {
      const conv = await createConv.mutateAsync();
      setConversationId(conv.id);
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  };

  useEffect(() => {
    if (!conversationId) {
      initConversation();
    }
  }, [conversationId]);

  const { data: serverMessages = [], refetch } = useListConversationMessages(conversationId || 0, {
    query: {
      enabled: !!conversationId,
      queryKey: ["messages", conversationId],
      refetchInterval: false,
    }
  });

  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    setLocalMessages(serverMessages);
  }, [serverMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, streamingMessage]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !conversationId || isStreaming) return;

    const userText = inputValue;
    setInputValue("");
    
    // Optimistic UI for user message
    const tempUserMsg: Message = {
      id: Date.now(),
      conversationId,
      content: userText,
      role: "user",
      createdAt: new Date().toISOString()
    };
    setLocalMessages(prev => [...prev, tempUserMsg]);
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userText })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.delta) {
                streamText += data.delta;
                setStreamingMessage(streamText);
              }
              if (data.done) {
                break;
              }
            } catch (e) {
              console.error("Failed to parse SSE data", e);
            }
          }
        }
      }
      
      // Finished streaming
      await refetch();
      setIsStreaming(false);
      setStreamingMessage(null);

    } catch (err) {
      console.error("Chat error", err);
      setIsStreaming(false);
      setStreamingMessage(null);
      // Just refetch on error to get real state
      refetch();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        <p>Waking Ava up...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-card rounded-2xl shadow-xl overflow-hidden border">
      <div className="bg-primary/5 border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-serif font-bold text-lg overflow-hidden shrink-0">
              A
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
          </div>
          <div>
            <h3 className="font-serif font-medium leading-none">Ava</h3>
            <p className="text-xs text-muted-foreground mt-1">Virtual Receptionist</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => initConversation()} title="Reset Conversation" className="text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {localMessages.length === 0 && (
          <div className="text-center py-10 opacity-60 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <User className="w-8 h-8" />
            </div>
            <p className="font-medium text-foreground">Welcome to Oasis Studio</p>
            <p className="text-sm mt-1">Say hello to get started!</p>
          </div>
        )}
        
        {localMessages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id || i} className={cn("flex gap-3 max-w-[85%] animate-in slide-in-from-bottom-2 fade-in duration-300", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
              {!isUser && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-serif font-bold shrink-0 mt-1">
                  A
                </div>
              )}
              <div className={cn("px-4 py-3 rounded-2xl text-sm shadow-sm", isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm")}>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          );
        })}

        {isStreaming && (
          <div className="flex gap-3 max-w-[85%] mr-auto animate-in fade-in duration-300">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-serif font-bold shrink-0 mt-1">
              A
            </div>
            <div className="px-4 py-3 rounded-2xl text-sm shadow-sm bg-muted rounded-tl-sm flex flex-col gap-2 min-w-[3rem]">
              {streamingMessage ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: streamingMessage.replace(/\n/g, '<br/>') }} />
              ) : (
                <div className="flex gap-1 items-center h-5">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background/50 backdrop-blur border-t shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask Ava about our services..."
            className="rounded-full bg-background border-muted shadow-inner focus-visible:ring-primary/20"
            disabled={isStreaming}
            autoFocus
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isStreaming}
            className="rounded-full shadow-sm shrink-0 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="flex items-center justify-center mt-3 gap-1 text-xs text-muted-foreground">
          <span>Ready to book?</span>
          <Link href="/book" className="font-medium text-primary hover:underline underline-offset-4">
            Go to Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
