export type NoteCategory = 'personal' | 'work' | 'ideas' | 'tasks' | 'other';

export interface Note {
    id: string;
    content: string;
    category: NoteCategory;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    isPinned: boolean;
    color?: string;
} 