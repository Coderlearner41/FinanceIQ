import mongoose from 'mongoose';

export interface Note {
    _id: string;
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    imageUrl: string
  }
  
  export interface NoteContextType {
    notes: Note[];
    getUserBlogs: () => Promise<void>;
    getBlogs: () => Promise<void>;
    addNote: (title: string, description: string, tag: string) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    editNote: (id: string, title: string, description: string, tag: string) => Promise<void>;
    deleteNoteHead: (id: string) => Promise<void>;
    editNoteHead: (id: string, title: string, description: string, tag: string) => Promise<void>;
    getUsers: () => Promise<void>;
  }
  

