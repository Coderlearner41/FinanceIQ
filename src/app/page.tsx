import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// Interface for articles
interface Article {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}

// Fetch articles from Firestore
const fetchArticles = async (): Promise<Article[]> => {
  console.log("Fetching articles from Firestore...");
  const articlesCollection = collection(db, "Articles");
  const articlesSnapshot = await getDocs(articlesCollection);
  const articlesData = articlesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Article[];
  console.log("Fetched articles:", articlesData);
  return articlesData;
};

const noImage = '/images/no-image.png';

const Home = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      console.log("Loading articles...");
      setIsLoading(true);
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
        console.log("Finished loading articles.");
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-blue-700">Finance IQ</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-700">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-700">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-700">Contact Us</Link>
          </nav>
          <div className="text-sm text-red-600 font-semibold">Read to Lead</div>
        </div>
      </header>
      <div className="bg-gray-200 py-2 px-4 text-black text-sm border-b">
        <div className="max-w-[1200px] mx-auto">{currentDate}</div>
      </div>
      <main className="flex-grow max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Latest Articles</h1>
        {isLoading ? (
          <p className="text-center">Loading articles...</p>
        ) : articles.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="card border border-gray-200">
                  <div className="card-header">
                    <h2 className="card-title text-lg">{article.title}</h2>
                  </div>
                  <div className="card-content">
                    <Image
                      src={article.imageUrl || noImage}
                      alt={`${article.title} image`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover mb-4"
                    />
                    <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                    <p className="text-sm text-black">{article.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">No articles available.</p>
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
  );
};

export default Home;
