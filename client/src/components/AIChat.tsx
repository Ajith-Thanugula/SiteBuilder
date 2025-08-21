import { useState, useEffect, useRef } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Conversation } from "@shared/schema";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const projectId = "sample-project-1"; // Using sample project ID

  const { data: conversation } = useQuery<Conversation>({
    queryKey: ['/api/conversations', projectId],
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { messages: Message[], context?: string, projectId: string }) => {
      const response = await apiRequest("POST", "/api/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      const newMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Invalidate conversation query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', projectId] });
    },
    onError: (error) => {
      toast({
        title: "Chat error",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Load conversation messages on component mount
  useEffect(() => {
    if (conversation?.messages && Array.isArray(conversation.messages)) {
      setMessages(conversation.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })));
    }
  }, [conversation]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    chatMutation.mutate({
      messages: updatedMessages,
      context: "User is working on updating their React components with AI assistance",
      projectId,
    });

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-1/2 bg-gray-50 flex flex-col">
      {/* AI Chat Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Ask questions or request clarifications</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex space-x-3 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div
                className={`rounded-lg p-4 shadow-sm max-w-md ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-800'
                }`}
                data-testid={`message-${message.role}-${index}`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Show action buttons for assistant messages with code */}
                {message.role === 'assistant' && message.content.includes('const') && (
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-accent text-white hover:bg-green-600"
                      data-testid="button-apply-changes"
                    >
                      Apply Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-view-diff"
                    >
                      View Diff
                    </Button>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            className="flex-1"
            placeholder="Ask a question or provide feedback..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={chatMutation.isPending}
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={chatMutation.isPending || !inputMessage.trim()}
            data-testid="button-send-message"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
