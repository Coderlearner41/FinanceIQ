"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./Components/card"
import { Facebook, Twitter, Linkedin } from "lucide-react"
import { useEffect, useState } from "react"
import noImage from './assets/noImage.jpg'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebaseConfig" 

interface Article {
  id: string;
  title?: string; // Include other properties as needed
  description?: string;
  imageUrl?: string;
  category?: string;

}

const fetchArticles = async () => {
  console.log("Fetching articles from Firestore...");
  const articlesCollection = collection(db, "Articles");
  const articlesSnapshot = await getDocs(articlesCollection);
  const articlesData = articlesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("Fetched articles:", articlesData);
  return articlesData;
};

export default function Component() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      console.log("Loading articles...");
      setIsLoading(true);
      try {
        const data = await fetchArticles();
        if (articles.length === 0) {  // Only set if articles are not yet loaded
          setArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
        console.log("Finished loading articles.");
      }
    };

    loadArticles();
  }, [articles.length]);  

  return (
    <body suppressHydrationWarning={true}>
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-gray-200 py-1 px-4 flex text-black justify-between items-center text-sm">
        <div>{currentDate}</div>
      </div>
      <header className="bg-white shadow-md">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-blue-700">Finance IQ</div>
          <div className="text-sm text-red-600 font-semibold">Read to Lead</div>
        </div>
      </header>

      <main className="flex-grow max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Latest Articles</h1>
        {isLoading ? (
          <p className="text-center">Loading articles...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={article.imageUrl ? article.imageUrl : noImage}
                    alt={`${article.title} image`}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                  <p className="text-sm text-black">{article.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 Finance IQ. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </body>
  );
}
