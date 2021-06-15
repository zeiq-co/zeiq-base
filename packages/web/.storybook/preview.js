export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  storySort: {
    order: ['Docs', 'Atoms', 'Elements', 'Forms'],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
