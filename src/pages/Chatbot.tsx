
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m MarketMood Assistant. Ask me anything about stock markets, investment strategies, or for market sentiment analysis.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // In a real application, this would be an API call to a chatbot backend
    setTimeout(() => {
      const responses: {[key: string]: string} = {
        'market': 'The overall market sentiment today is cautiously optimistic. Tech stocks are showing strength while energy sectors are experiencing some volatility. Always consider your risk tolerance before making investment decisions.',
        'stock': 'When evaluating stocks, look at fundamentals like P/E ratio, revenue growth, and competitive advantages. Technical indicators can help with timing, but company quality should drive long-term decisions.',
        'invest': 'A balanced investment approach includes diversification across asset classes, regular portfolio reviews, and alignment with your time horizon and goals. Consider consulting with a financial advisor for personalized advice.',
        'sentiment': 'Market sentiment is the overall attitude of investors toward a particular security or market. It's often described as bullish (expecting prices to rise) or bearish (expecting prices to fall).',
        'strategy': 'Effective trading strategies include trend following, mean reversion, breakout trading, and value investing. The best strategy depends on your time horizon, risk tolerance, and market conditions.',
        'etf': 'ETFs (Exchange Traded Funds) offer diversification benefits by tracking indices, sectors, or themes. They typically have lower fees than mutual funds and trade like stocks throughout the market day.',
        'risk': 'Risk management is crucial in investing. Consider position sizing, stop losses, diversification, and correlation between assets. Never risk more than you can afford to lose.',
        'trend': 'Current market trends include AI and machine learning adoption, renewable energy growth, digital transformation across industries, and increasing focus on sustainable investing practices.'
      };
      
      // Find a matching keyword in the user's message
      const keyword = Object.keys(responses).find(key => input.toLowerCase().includes(key));
      
      let responseContent = keyword 
        ? responses[keyword]
        : "I don't have specific information on that topic yet. For the most accurate market insights, consider consulting financial news sources like Bloomberg, CNBC, or Wall Street Journal.";
        
      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m MarketMood Assistant. Ask me anything about stock markets, investment strategies, or for market sentiment analysis.',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Layout className="flex flex-col max-h-screen overflow-hidden">
      <div className="flex-grow overflow-hidden flex flex-col">
        <header className="space-y-1 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Market Assistant</h1>
          <p className="text-muted-foreground">
            Your AI assistant for market insights and investment guidance
          </p>
        </header>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              MarketMood Assistant
            </CardTitle>
            <CardDescription>
              Ask questions about market trends, investment strategies, or get sentiment analysis
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-y-auto pt-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={resetConversation}
                title="Reset conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Chatbot;
