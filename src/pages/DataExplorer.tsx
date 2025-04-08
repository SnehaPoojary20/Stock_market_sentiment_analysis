
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, initializeApp } from '@/config/firebase';
import Layout from '@/components/layout/Layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Database } from 'lucide-react';
import { toast } from "sonner";
import { SentimentResult, FakeNewsArticle, initializeFirestore } from '@/services/firebaseService';

const DataExplorer: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<SentimentResult[]>([]);
  const [fakeNewsData, setFakeNewsData] = useState<FakeNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Firebase with sample data if not already initialized
        await initializeFirestore();
        setInitialized(true);
        
        // Load sentiment data
        const sentimentSnapshot = await getDocs(collection(db, "sentimentResults"));
        const sentimentResults: SentimentResult[] = [];
        sentimentSnapshot.forEach((doc) => {
          sentimentResults.push(doc.data() as SentimentResult);
        });
        setSentimentData(sentimentResults);
        
        // Load fake news data
        const fakeNewsSnapshot = await getDocs(collection(db, "fakeNewsArticles"));
        const fakeNewsResults: FakeNewsArticle[] = [];
        fakeNewsSnapshot.forEach((doc) => {
          fakeNewsResults.push(doc.data() as FakeNewsArticle);
        });
        setFakeNewsData(fakeNewsResults);
        
        setLoading(false);
        toast.success("Datasets loaded successfully");
      } catch (error) {
        console.error("Error loading datasets:", error);
        toast.error("Error loading datasets");
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Data Explorer</h1>
          <p className="text-muted-foreground">
            View and explore the datasets used in the application
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-pulse-slow flex flex-col items-center">
              <Database className="h-10 w-10 text-primary mb-4" />
              <p className="text-muted-foreground">Loading datasets...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="sentiment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="sentiment" className="flex items-center gap-2">
                <Database size={16} /> Sentiment Analysis Data
              </TabsTrigger>
              <TabsTrigger value="fakenews" className="flex items-center gap-2">
                <FileText size={16} /> Fake News Detection Data
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sentiment">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis Dataset</CardTitle>
                  <CardDescription>
                    {sentimentData.length} records loaded from Firebase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>Complete dataset for sentiment analysis</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Overall Sentiment</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead>Emotions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentimentData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.overall === 'positive' ? "success" : 
                              item.overall === 'negative' ? "destructive" : 
                              "outline"
                            }>
                              {item.overall.charAt(0).toUpperCase() + item.overall.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{(item.score * 100).toFixed(0)}%</TableCell>
                          <TableCell className="max-w-[400px] truncate" title={item.summary}>
                            {item.summary}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.emotions.map((emotion, idx) => (
                                <div
                                  key={idx}
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: emotion.color }}
                                  title={`${emotion.name}: ${emotion.value}`}
                                />
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="fakenews">
              <Card>
                <CardHeader>
                  <CardTitle>Fake News Detection Dataset</CardTitle>
                  <CardDescription>
                    {fakeNewsData.length} records loaded from Firebase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>Complete dataset for fake news detection</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Verdict</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Explanation</TableHead>
                        <TableHead>Factors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fakeNewsData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <Badge variant={item.verdict === 'real' ? "success" : "destructive"}>
                              {item.verdict.charAt(0).toUpperCase() + item.verdict.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.confidence}%</TableCell>
                          <TableCell className="max-w-[400px] truncate" title={item.explanation}>
                            {item.explanation}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              {item.factors.length} factors
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default DataExplorer;
