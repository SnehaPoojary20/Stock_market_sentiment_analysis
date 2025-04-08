
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  DocumentData,
  QuerySnapshot 
} from "firebase/firestore";
import { db } from "../config/firebase";

// Types
export interface SentimentResult {
  id: number;
  overall: string;
  score: number;
  emotions: Array<{ name: string; value: number; color: string }>;
  summary: string;
}

export interface FakeNewsArticle {
  id: number;
  verdict: "real" | "fake";
  confidence: number;
  explanation: string;
  factors: Array<{ factor: string; impact: "high" | "medium" | "low" }>;
}

// Initialize Firestore with mock data if needed
export const initializeFirestore = async () => {
  try {
    console.log("Initializing Firestore connection...");
    
    // Check if sentiment data exists
    const sentimentSnapshot = await getDocs(collection(db, "sentimentResults"));
    if (sentimentSnapshot.empty) {
      console.log("Initializing sentiment data in Firestore...");
      const sentimentData = require("../data/sentimentData.json").results;
      
      // Add sentiment data to Firestore
      for (const result of sentimentData) {
        await addDoc(collection(db, "sentimentResults"), result);
      }
      console.log("Sentiment data initialized in Firestore");
    } else {
      console.log("Sentiment data already exists in Firestore");
    }

    // Check if fake news data exists
    const fakeNewsSnapshot = await getDocs(collection(db, "fakeNewsArticles"));
    if (fakeNewsSnapshot.empty) {
      console.log("Initializing fake news data in Firestore...");
      const fakeNewsData = require("../data/fakeNewsData.json").articles;
      
      // Add fake news data to Firestore
      for (const article of fakeNewsData) {
        await addDoc(collection(db, "fakeNewsArticles"), article);
      }
      console.log("Fake news data initialized in Firestore");
    } else {
      console.log("Fake news data already exists in Firestore");
    }
    
    console.log("Firestore initialization complete");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

// Get random sentiment result
export const getRandomSentimentResult = async (): Promise<SentimentResult | null> => {
  try {
    const sentimentSnapshot = await getDocs(collection(db, "sentimentResults"));
    if (sentimentSnapshot.empty) {
      return null;
    }
    
    const results: SentimentResult[] = [];
    sentimentSnapshot.forEach((doc) => {
      const data = doc.data() as SentimentResult;
      results.push(data);
    });
    
    // Get random result
    const randomIndex = Math.floor(Math.random() * results.length);
    return results[randomIndex];
  } catch (error) {
    console.error("Error getting sentiment result:", error);
    return null;
  }
};

// Get random fake news article
export const getRandomFakeNewsArticle = async (): Promise<FakeNewsArticle | null> => {
  try {
    const fakeNewsSnapshot = await getDocs(collection(db, "fakeNewsArticles"));
    if (fakeNewsSnapshot.empty) {
      return null;
    }
    
    const articles: FakeNewsArticle[] = [];
    fakeNewsSnapshot.forEach((doc) => {
      const data = doc.data() as FakeNewsArticle;
      articles.push(data);
    });
    
    // Get random article
    const randomIndex = Math.floor(Math.random() * articles.length);
    return articles[randomIndex];
  } catch (error) {
    console.error("Error getting fake news article:", error);
    return null;
  }
};
