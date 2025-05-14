import React from 'react';
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "../src/theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f5f5f5',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview; 