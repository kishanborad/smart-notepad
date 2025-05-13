import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, ColorPicker, Switch } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Note } from '../types/note';

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
                title: note.title,
                content: note.content,
                tags: note.tags,
                type: note.type,
                color: note.color,
                improveContent: note.improveContent
            });
        }
    }, [note, form]);

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            await onSave({
                ...values,
                _id: note?._id
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
                type: 'text',
                color: '#ffffff',
                improveContent: false
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter note title" />
                </Form.Item>

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
                    <Form.Item name="type" label="Type">
                        <Select style={{ width: 120 }}>
                            <Option value="text">Text</Option>
                            <Option value="todo">Todo</Option>
                            <Option value="meeting">Meeting</Option>
                            <Option value="idea">Idea</Option>
                            <Option value="code">Code</Option>
                            <Option value="checklist">Checklist</Option>
                            <Option value="sketch">Sketch</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="color" label="Color">
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        name="improveContent"
                        label="Improve with AI"
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