import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, Switch } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Note } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface NoteEditorProps {
    note?: Note;
    onSave: (note: Partial<Note>) => void;
    onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (note) {
            form.setFieldsValue({
                content: note.content,
                tags: note.tags,
                category: note.category,
                color: note.color,
                isPinned: note.isPinned,
            });
        }
    }, [note, form]);

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            await onSave({
                ...values,
                id: note?.id
            });
            form.resetFields();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                category: 'personal',
                color: '#ffffff',
                isPinned: false
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Form.Item
                    name="content"
                    label="Content"
                    rules={[{ required: true, message: 'Please enter content' }]}
                >
                    <TextArea
                        placeholder="Enter note content"
                        autoSize={{ minRows: 4, maxRows: 8 }}
                    />
                </Form.Item>

                <Form.Item name="tags" label="Tags">
                    <Select
                        mode="tags"
                        placeholder="Enter tags"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Space>
                    <Form.Item name="category" label="Category">
                        <Select style={{ width: 140 }}>
                            <Option value="personal">Personal</Option>
                            <Option value="work">Work</Option>
                            <Option value="ideas">Ideas</Option>
                            <Option value="tasks">Tasks</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="color" label="Color">
                        <Input type="color" style={{ width: 60, height: 40, padding: 0, border: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        name="isPinned"
                        label="Pin Note"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Space>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isSubmitting}
                        >
                            Save
                        </Button>
                        <Button
                            icon={<CloseOutlined />}
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Space>
        </Form>
    );
};

export default NoteEditor; 