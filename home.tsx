import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Loader2, TrashIcon, Globe2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { sendMessage, clearChat } from "@/lib/openai";
import { queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, languages, type Language } from "@/lib/i18n";
import type { Message } from "@shared/schema";

export default function Home() {
  const [input, setInput] = useState("");
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();

  // Add useEffect to clear chat when component mounts (new user loads the page)
  useEffect(() => {
    clearChat();
  }, []); // Empty dependency array means this runs once on mount

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: clear, isPending: isClearing } = useMutation({
    mutationFn: clearChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: language === "fr" ? "Discussion effacée" : "Chat cleared",
        description: language === "fr" ? "Tous les messages ont été supprimés" : "All messages have been removed",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input.trim());
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d"
              alt="Hotel Finesse Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {getTranslation(language, "hotelName")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {getTranslation(language, "virtualConcierge")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowQR(!showQR)}
              className="relative"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.entries(languages) as [Language, string][]).map(([lang, label]) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? "bg-muted" : ""}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clear()}
              disabled={isClearing}
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
              <span className="ml-2">{getTranslation(language, "clearChat")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="h-[calc(100vh-16rem)] flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {isLoadingMessages ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <img
                  src="https://images.unsplash.com/photo-1590073844006-33379778ae09"
                  alt="Hotel Finesse Reception"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
                <p className="text-center text-muted-foreground">
                  {getTranslation(language, "welcome")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.metadata?.responseTime && (
                        <p className="text-xs mt-2 opacity-70">
                          {getTranslation(language, "responseTime")}: {message.metadata.responseTime}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getTranslation(language, "typeMessage")}
                disabled={isSending}
                className="flex-1"
              />
              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-card p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              Scan to chat with Hotel Finesse
            </h2>
            <QRCodeSVG
              value={window.location.href}
              size={256}
              level="H"
              includeMargin
              className="bg-white p-2 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}