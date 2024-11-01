// src/context/NoteContext.tsx
import { createContext } from 'react';
import { NoteContextType } from './NoteContextType';


const noteContext = createContext<NoteContextType | undefined>(undefined);

export default noteContext;
