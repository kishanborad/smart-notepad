import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NoteEditor } from './NoteEditor';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { Note } from '../../types';

const meta: Meta<typeof NoteEditor> = {
  title: 'Components/NoteEditor',
  component: NoteEditor,
  decorators: [
    (Story: React.ComponentType) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onTitleChange: { action: 'title changed' },
    onContentChange: { action: 'content changed' },
  },
};

export default meta;
type Story = StoryObj<typeof NoteEditor>;

const sampleNote: Note = {
  id: '1',
  title: 'Sample Note',
  content: 'This is a sample note content.',
  category: 'personal',
  tags: ['sample', 'test'],
  color: '#ffffff',
  isPinned: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    note: sampleNote,
  },
};

export const Empty: Story = {
  args: {
    note: {
      ...sampleNote,
      id: '2',
      title: '',
      content: '',
      tags: [],
    },
  },
};

export const LongContent: Story = {
  args: {
    note: {
      ...sampleNote,
      id: '3',
      title: 'Long Note',
      content: 'This is a note with a lot of content. '.repeat(20),
    },
  },
};

export const WithTags: Story = {
  args: {
    note: {
      ...sampleNote,
      id: '4',
      title: 'Note with Tags',
      content: 'A note with multiple tags',
      tags: ['important', 'work', 'urgent', 'meeting'],
    },
  },
}; 