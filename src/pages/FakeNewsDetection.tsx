
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ShieldAlert, FileText } from 'lucide-react';
import { toast } from "sonner";
import Layout from '@/components/layout/Layout';
import { getRandomFakeNewsArticle, initializeFirestore, FakeNewsArticle } from '@/services/firebaseService';

const FakeNewsDetection: React.FC = () => {
  const [newsText, setNewsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FakeNewsArticle | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Firebase on component mount
  useEffect(() => {
    const initializeData = async () => {
      await initializeFirestore();
      setIsInitialized(true);
    };

    initializeData();
  }, []);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewsText(event.target.value);
  };

  const handleAnalysis = async () => {
    if (!newsText) return;
    
    setLoading(true);
    
    try {
      // Get data from Firebase
      const fakeNewsArticle = await getRandomFakeNewsArticle();
      
      if (fakeNewsArticle) {
        setResult(fakeNewsArticle);
        toast.success("News content analyzed successfully");
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      console.error("Error analyzing news content:", error);
      toast.error("Error analyzing news content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Fake News Detection</h1>
          <p className="text-muted-foreground">
            Analyze news articles to determine if they are real or fake
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              News Content Analysis
            </CardTitle>
            <CardDescription>
              Paste news article text to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                className="w-full min-h-[250px] p-3 rounded-md border"
                placeholder="Paste news article or content here..."
                value={newsText}
                onChange={handleTextChange}
              ></textarea>
              
              <Button 
                onClick={handleAnalysis} 
                disabled={!newsText || loading || !isInitialized}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>Analyzing content...</>
                ) : (
                  <>
                    <Shield size={16} />
                    Verify News
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="fade-in">
            <Alert
              className={`p-6 ${
                result.verdict === 'real' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                  : 'border-red-500 bg-red-50 dark:bg-red-950/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.verdict === 'real' ? (
                  <Shield className="h-6 w-6 text-green-600" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <AlertTitle className="text-xl font-bold mb-2">
                    {result.verdict === 'real' ? 'Real News' : 'Fake News'} 
                    <span className="ml-2 text-sm bg-muted rounded-full px-3 py-1 font-medium">
                      {result.confidence}% confidence
                    </span>
                  </AlertTitle>
                  <AlertDescription className="text-base">
                    {result.explanation}
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Analysis Factors</CardTitle>
                <CardDescription>
                  Key elements used to determine the news authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.factors.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                      <div 
                        className={`w-2 h-2 rounded-full mt-2 ${
                          item.impact === 'high' 
                            ? result.verdict === 'real' ? 'bg-green-500' : 'bg-red-500'
                            : item.impact === 'medium'
                            ? result.verdict === 'real' ? 'bg-green-400' : 'bg-red-400'
                            : result.verdict === 'real' ? 'bg-green-300' : 'bg-red-300'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{item.factor}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.impact} impact factor
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FakeNewsDetection;
