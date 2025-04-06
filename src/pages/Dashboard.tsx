
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown, BarChart2, PieChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';

// Mock data for the dashboard
const getSentimentData = async () => {
  // This would be an API call in a real app
  return {
    sentimentDistribution: [
      { name: 'Positive', value: 45, color: '#059669' },
      { name: 'Neutral', value: 30, color: '#3B82F6' },
      { name: 'Negative', value: 25, color: '#DC2626' },
    ],
    marketTrends: {
      overall: 'positive',
      change: '+2.3%',
    },
    recentAnalysis: [
      { 
        id: 1, 
        source: 'Financial Times article', 
        sentiment: 'positive', 
        confidence: 87,
        summary: 'Tech sector shows strong growth despite market headwinds'
      },
      { 
        id: 2, 
        source: 'Twitter feed - @MarketExpert', 
        sentiment: 'neutral', 
        confidence: 72,
        summary: 'Mixed signals for retail stocks ahead of earnings reports'
      },
      { 
        id: 3, 
        source: 'Bloomberg report', 
        sentiment: 'negative', 
        confidence: 65,
        summary: 'Energy sector faces regulatory challenges'
      },
    ]
  };
};

const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: getSentimentData,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse-slow flex flex-col items-center">
            <BarChart2 className="h-10 w-10 text-primary mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Market Mood Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of current market sentiment and analysis results
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Market Mood Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Market Mood
                {data?.marketTrends.overall === 'positive' ? (
                  <TrendingUp className="h-5 w-5 text-market-positive" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-market-negative" />
                )}
              </CardTitle>
              <CardDescription>Based on latest sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className={`text-2xl font-semibold ${data?.marketTrends.overall === 'positive' ? 'text-market-positive' : 'text-market-negative'}`}>
                  {data?.marketTrends.overall === 'positive' ? 'Positive' : 'Negative'}
                </span>
                <span className="ml-2 text-sm bg-secondary rounded-full px-3 py-1 font-medium">
                  {data?.marketTrends.change}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Distribution Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>Distribution of sentiments across analyzed content</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={data?.sentimentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {data?.sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analysis Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analysis Results</CardTitle>
            <CardDescription>Latest content analyzed by MarketMood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentAnalysis.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50">
                  {item.sentiment === 'positive' ? (
                    <ArrowUpIcon className="h-5 w-5 text-market-positive flex-shrink-0 mt-0.5" />
                  ) : item.sentiment === 'negative' ? (
                    <ArrowDownIcon className="h-5 w-5 text-market-negative flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-market-neutral flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.summary}</p>
                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                      <span>{item.source}</span>
                      <span>Confidence: {item.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
