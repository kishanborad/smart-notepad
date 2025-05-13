import React, { useState } from 'react';
import { List, Input, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import NoteCard from './NoteCard';
import { Note } from '../types/note';

const { Title } = Typography;
const { Option } = Select;

interface NoteListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
    onToggleFavorite: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({
    notes,
    onEdit,
    onDelete,
    onToggleFavorite
}) => {
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [filterTag, setFilterTag] = useState<string | null>(null);

    // Get unique tags from all notes
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    // Filter and sort notes
    const filteredNotes = notes
        .filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase()) ||
                                note.content.toLowerCase().includes(searchText.toLowerCase());
            const matchesTag = !filterTag || note.tags.includes(filterTag);
            return matchesSearch && matchesTag;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'createdAt':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'favorite':
                    return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
                default: // updatedAt
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={2}>My Notes</Title>
                
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Input
                        placeholder="Search notes..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    
                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        style={{ width: 150 }}
                    >
                        <Option value="updatedAt">Last Updated</Option>
                        <Option value="createdAt">Created Date</Option>
                        <Option value="title">Title</Option>
                        <Option value="favorite">Favorites First</Option>
                    </Select>

                    <Select
                        placeholder="Filter by tag"
                        allowClear
                        style={{ width: 150 }}
                        onChange={value => setFilterTag(value)}
                    >
                        {allTags.map(tag => (
                            <Option key={tag} value={tag}>{tag}</Option>
                        ))}
                    </Select>
                </Space>

                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={filteredNotes}
                    renderItem={note => (
                        <List.Item>
                            <NoteCard
                                note={note}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleFavorite={onToggleFavorite}
                            />
                        </List.Item>
                    )}
                />
            </Space>
        </div>
    );
};

export default NoteList; 