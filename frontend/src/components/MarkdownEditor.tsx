import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string | number;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  minHeight = 400,
}) => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    onChange(newText);

    // Set cursor position after the inserted markdown
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const formatButtons = [
    {
      icon: <FormatBold />,
      tooltip: 'Bold (Ctrl+B)',
      action: () => insertMarkdown('**', '**'),
    },
    {
      icon: <FormatItalic />,
      tooltip: 'Italic (Ctrl+I)',
      action: () => insertMarkdown('*', '*'),
    },
    {
      icon: <FormatListBulleted />,
      tooltip: 'Bullet List',
      action: () => insertMarkdown('- '),
    },
    {
      icon: <FormatListNumbered />,
      tooltip: 'Numbered List',
      action: () => insertMarkdown('1. '),
    },
    {
      icon: <CodeIcon />,
      tooltip: 'Code Block',
      action: () => insertMarkdown('```\n', '\n```'),
    },
    {
      icon: <LinkIcon />,
      tooltip: 'Insert Link',
      action: () => insertMarkdown('[', '](url)'),
    },
    {
      icon: <ImageIcon />,
      tooltip: 'Insert Image',
      action: () => insertMarkdown('![alt text](', ')'),
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*');
          break;
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Write" />
          <Tab label="Preview" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            {formatButtons.map((button, index) => (
              <Tooltip key={index} title={button.tooltip}>
                <IconButton size="small" onClick={button.action}>
                  {button.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
          <textarea
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              minHeight,
              padding: '16px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
        </>
      )}

      {tab === 1 && (
        <Paper
          sx={{
            p: 2,
            minHeight,
            overflow: 'auto',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={theme.palette.mode === 'dark' ? materialDark : materialLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {value}
          </ReactMarkdown>
        </Paper>
      )}
    </Box>
  );
};

export default MarkdownEditor; 