export interface Note {
    _id: string;
    title: string;
    content: string;
    summary?: string;
    type: 'text' | 'todo' | 'meeting' | 'idea' | 'code' | 'checklist' | 'sketch';
    tags: string[];
    user: string;
    isPinned: boolean;
    isFavorite: boolean;
    collaborators: string[];
    version: number;
    versionHistory: {
        content: string;
        timestamp: Date;
        version: number;
    }[];
    metadata: {
        wordCount: number;
        readingTime: number;
        lastEdited: Date;
    };
    attachments: {
        type: string;
        url: string;
        name: string;
    }[];
    reminders: {
        date: Date;
        description: string;
    }[];
    status: 'active' | 'archived' | 'deleted';
    isPublic: boolean;
    relatedNotes: string[];
    aiEnhanced: boolean;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    color: string;
    improveContent: boolean;
} 