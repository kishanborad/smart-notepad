import React from 'react';
import { Card, Tag, Typography, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Note } from '../types/note';

const { Title, Paragraph } = Typography;

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
    onToggleFavorite: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onToggleFavorite }) => {
    const handleEdit = () => {
        onEdit(note);
    };

    const handleDelete = () => {
        onDelete(note._id);
    };

    const handleToggleFavorite = () => {
        onToggleFavorite(note._id);
    };

    return (
        <Card
            style={{
                marginBottom: 16,
                backgroundColor: note.color || '#ffffff',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            actions={[
                <Button
                    type="text"
                    icon={note.isFavorite ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined />}
                    onClick={handleToggleFavorite}
                />,
                <Button type="text" icon={<EditOutlined />} onClick={handleEdit} />,
                <Button type="text" icon={<DeleteOutlined />} onClick={handleDelete} />
            ]}
        >
            <Title level={4} style={{ marginBottom: 8 }}>
                {note.title}
            </Title>
            <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 16 }}>
                {note.content}
            </Paragraph>
            {note.summary && (
                <Paragraph type="secondary" style={{ fontSize: '0.9em', marginBottom: 16 }}>
                    {note.summary}
                </Paragraph>
            )}
            <Space wrap>
                {note.tags.map((tag, index) => (
                    <Tag key={index} color="blue">
                        {tag}
                    </Tag>
                ))}
            </Space>
            <div style={{ marginTop: 16, fontSize: '0.8em', color: '#8c8c8c' }}>
                Last edited: {new Date(note.updatedAt).toLocaleDateString()}
            </div>
        </Card>
    );
};

export default NoteCard; 