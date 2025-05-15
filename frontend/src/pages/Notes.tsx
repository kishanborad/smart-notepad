import React, { useState } from 'react';
import { Typography, Input, List, Card, Button, Space, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Note } from '../types';

const { Title } = Typography;
const { Search } = Input;

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Smart Notepad',
      content: 'This is your first note. Click the edit button to modify it.',
      category: 'personal',
      tags: ['welcome', 'getting-started'],
      color: '#1890ff',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const filteredNotes = notes.filter((note) => {
    const searchLower = searchText.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (id: string) => {
    navigate(`/notes/${id}`);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>My Notes</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNote}>
          New Note
        </Button>
      </div>

      <Search
        placeholder="Search notes..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={filteredNotes}
        renderItem={(note) => (
          <List.Item>
            <Card
              title={note.title}
              extra={
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditNote(note.id)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteNote(note.id)}
                  />
                </Space>
              }
            >
              <p>{note.content.substring(0, 100)}...</p>
              <div>
                {note.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div style={{ marginTop: 8, color: '#999', fontSize: '12px' }}>
                Last updated: {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notes; 