import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, BarChart2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
import sentimentData from '@/data/sentimentData.json';

const SentimentAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    
    // Simulate API call but use our dataset
    setTimeout(() => {
      // Get a random result from our dataset
      const randomIndex = Math.floor(Math.random() * sentimentData.results.length);
      setResult(sentimentData.results[randomIndex]);
      setLoading(false);
    }, 2000);
  };

  const handleTextAnalysis = async () => {
    if (!text) return;
    
    setLoading(true);
    
    // Simulate API call but use our dataset
    setTimeout(() => {
      // Get a random result from our dataset
      const randomIndex = Math.floor(Math.random() * sentimentData.results.length);
      setResult(sentimentData.results[randomIndex]);
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h1>
          <p className="text-muted-foreground">
            Upload files or enter text to analyze market sentiment
          </p>
        </header>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload size={16} /> Upload File
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText size={16} /> Enter Text
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Upload File for Analysis</CardTitle>
                <CardDescription>
                  Upload PDFs, images with text, or document files for sentiment analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input 
                      type="file" 
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, PNG, JPG, JPEG, DOC, DOCX
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleFileUpload} 
                    disabled={!file || loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>Analyzing...</>
                    ) : (
                      <>
                        <BarChart2 size={16} />
                        Analyze Sentiment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Enter Text for Analysis</CardTitle>
                <CardDescription>
                  Paste news articles, social media posts, or any text for sentiment analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className="w-full min-h-[200px] p-3 rounded-md border"
                    placeholder="Enter or paste text here for sentiment analysis..."
                    value={text}
                    onChange={handleTextChange}
                  ></textarea>
                  
                  <Button 
                    onClick={handleTextAnalysis} 
                    disabled={!text || loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>Analyzing...</>
                    ) : (
                      <>
                        <BarChart2 size={16} />
                        Analyze Sentiment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="mt-6 fade-in">
            <CardHeader>
              <CardTitle>Sentiment Analysis Results</CardTitle>
              <CardDescription>
                Detailed breakdown of sentiment and emotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Overall Sentiment: 
                    <span className={`ml-2 ${
                      result.overall === 'positive' ? 'text-market-positive' : 
                      result.overall === 'negative' ? 'text-market-negative' : 
                      'text-market-neutral'
                    }`}>
                      {result.overall.charAt(0).toUpperCase() + result.overall.slice(1)}
                    </span>
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Sentiment Score</span>
                      <span className="text-sm font-medium">{(result.score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          result.overall === 'positive' ? 'bg-market-positive' : 
                          result.overall === 'negative' ? 'bg-market-negative' : 
                          'bg-market-neutral'
                        }`} 
                        style={{ width: `${result.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{result.summary}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Emotion Breakdown</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.emotions}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {result.emotions.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SentimentAnalysis;
