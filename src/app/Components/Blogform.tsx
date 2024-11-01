import React, { useState } from 'react';
import Button  from "../Utils/Button"
import  Input  from "../Utils/Input"
import { Label } from "../Utils/Label"
import  Textarea  from "../Utils/Textarea"

interface BlogFormProps {
    onAddBlog: (blog: Partial<Post>) => void
    initialData?: Post | null
  }

  interface Post {
    _id: string
    image: string
    title: string
    description: string
    category: string
    date: string
    author: {
      name: string
      avatar: string
    }
  }
const BlogForm: React.FC<BlogFormProps> = ({ onAddBlog, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [imageUrl, setImageUrl] = useState(initialData?.image || '')
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onAddBlog({ title, description, image: imageUrl })
      setTitle('')
      setDescription('')
      setImageUrl('')
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <Button type="submit">{initialData ? 'Update' : 'Add'} Blog</Button>
      </form>
    )
  }
export default BlogForm;
