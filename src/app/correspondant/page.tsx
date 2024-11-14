'use client'

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../Components/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../Components/dialog"
import  Button  from "../Utils/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/Select"
import  Textarea  from "../Utils/Textarea"
import { RadioGroup, RadioGroupItem } from "../Utils/radio-group"
import { Label } from "../Utils/Label"
import  Input  from "../Utils/Input"
import { Facebook, Twitter, Linkedin, Pencil, Trash2 } from "lucide-react"
import noImage from '../assets/noImage.jpg'
import {  createUserWithEmailAndPassword } from "firebase/auth"
import { collection, addDoc,getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore"
import { auth, db} from "../../../firebaseConfig"
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";


interface Post {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
}


const BlogForm = ({ onSubmit, initialData }: { onSubmit: (data: Partial<Post>) => void, initialData?: Post }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    imageUrl: initialData?.imageUrl || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!initialData) {
      setFormData({ title: '', description: '', category: '', imageUrl: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter article title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Enter article category"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter article description"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="Enter image URL"
        />
      </div>
      <Button type="submit" className="w-20">
        {initialData ? 'Update Article' : 'Add Article'}
      </Button>
    </form>
  )
}

export default function Component() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const [ role, setRole] = useState("super")
  const [articles, setArticles] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Post | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [academicYear, setAcademicYear] = useState("")
  const [newUser, setNewUser] = useState({ smail: '', password: '', role: '', academicYear: '' })
  const router = useRouter();
  const [user, loading] = useAuthState(auth); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error)
    }
  };

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const articlesCollection = collection(db, "Articles");
      const articlesSnapshot = await getDocs(articlesCollection);
      const articlesData = articlesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (user) fetchArticles();
  }, [user, fetchArticles]);

  useEffect(() => {
    if (user) {
      fetchArticles();
    }
  }, [user, fetchArticles]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin"); 
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }




  // const handleAddUser = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     // Create a new user with email and password
  //     const userCredential = await createUserWithEmailAndPassword(auth, newUser.smail, newUser.password);
  //     const user = userCredential.user;
  //     console.log(newUser);
  
  //     // Add the user to the 'Users' collection in Firestore with the UID as the document ID
  //     await setDoc(doc(db, "Users", user.uid), {
  //       smail: newUser.smail,
  //       role: newUser.role,
  //       academicYear: newUser.academicYear,
  //     });
  
  //     // Close the user addition modal and reset the form
  //     setIsAddUserOpen(false);
  //     setNewUser({ smail: '', password: '', role: '', academicYear: '' });
  //     alert("User added successfully!");
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error message:", error.message);
  //       alert("Failed to add user: " + error.message);
  //     } else {
  //       console.error("Unknown error", error);
  //     }
  //   }
  // };
  


  const handleAddArticle = async (newArticle: Partial<Post>) => {
    if (!user) return; // Ensure user is authenticated
  
    try {
      // Use the UID of the currently authenticated user as the document ID
      await setDoc(doc(db, "Articles", user.uid), {
        ...newArticle,
        imageUrl: newArticle.imageUrl || '',
        authorId: user.uid // Optionally, store the UID as an author ID field
      });
  
      const article = { id: user.uid, ...newArticle } as Post;
      setArticles([article, ...articles]);
      alert("Article added successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        alert("Failed to add article: " + error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };
  

  const handleEditArticle = async (updatedArticle: Partial<Post>) => {
    if (!selectedArticle) return;
    try {
      await updateDoc(doc(db, "Articles", selectedArticle.id), {
        ...updatedArticle,
        imageUrl: updatedArticle.imageUrl || selectedArticle.imageUrl
      });
      setArticles(articles.map(article =>
        article.id === selectedArticle.id ? { ...article, ...updatedArticle } : article
      ));
      setSelectedArticle(null);
      alert("Article updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        alert("Failed to add article: " + error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };
  

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Articles", id));
      setArticles(articles.filter((article) => article.id !== id));
      alert("Article deleted successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        alert("Failed to add article: " + error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
     {/* NavBar */}
      <div className="bg-gray-200 py-1 px-4 flex text-black justify-between items-center text-sm">
        <div>{currentDate}</div>
        <div className="flex space-x-4">
          {/* <Button onClick={() => setIsAddUserOpen(true)} className="text-blue-600">
            <Plus className="inline-block w-4 h-4 mr-1" /> Add User
          </Button> */}
          <Button onClick={handleLogout} className="text-red-600">
            Logout
          </Button>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smail">Smail (Student Email)</Label>
              <Input
                id="smail"
                type="email"
                value={newUser.smail}
                onChange={(e) => setNewUser({ ...newUser, smail: e.target.value })}
                placeholder="Enter student email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor=" role" className="text-sm font-semibold text-gray-700">Admin Level</Label>
              <RadioGroup id=" role" value={role} onValueChange={setRole} className="flex">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="head" onClick={() => setNewUser({ ...newUser, role: 'head' })} id="super" />
                  <Label htmlFor="head" className="text-sm text-gray-600">Head</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lead" id="department" />
                  <Label htmlFor="lead" onClick={() => setNewUser({ ...newUser, role: 'lead' })} className="text-sm text-gray-600">Team Lead</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="correspondant" id="moderator" />
                  <Label htmlFor="correspondant" onClick={() => setNewUser({ ...newUser, role: 'correspondant' })} className="text-sm text-gray-600">Correspondant</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-sm font-semibold text-gray-700">Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger id="academicYear" className="border-gray-300 bg-white text-black">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24" onClick={() => setNewUser({ ...newUser, academicYear: '2023-24' })}>2023-24</SelectItem>
                  <SelectItem value="2024-25" onClick={() => setNewUser({ ...newUser, academicYear: '2024-25' })}>2024-25</SelectItem>
                  <SelectItem value="2025-26" onClick={() => setNewUser({ ...newUser, academicYear: '2025-26' })}>2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-20">Add User</Button>
          </form>
        </DialogContent>
      </Dialog>

      <header className="bg-white shadow-md">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-blue-700">Finance IQ</div>
          <div className="text-sm text-red-600 font-semibold">Read to Lead</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Article</CardTitle>
            <CardDescription>Share your financial insights</CardDescription>
          </CardHeader>
          <CardContent>
            <BlogForm onSubmit={handleAddArticle} />
          </CardContent>
        </Card>

        <h1 className="text-3xl font-bold text-black mb-8">Your Articles</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedArticle(article)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Image
                    src={article.imageUrl || noImage}
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

      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <BlogForm onSubmit={handleEditArticle} initialData={selectedArticle || undefined} />
        </DialogContent>
      </Dialog>
    </div>
  )
}