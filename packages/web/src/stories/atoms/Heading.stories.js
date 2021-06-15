import React from 'react';

import Heading from '../../components/atoms/Heading';

export default {
  title: 'Atoms/Heading',
  component: Heading,
};

const Template = (args) => <Heading {...args}>{args.children}</Heading>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'I am Heading',
  color: 'text-gray-900',
};

export const H1 = Template.bind({});
H1.args = {
  children: 'I am Heading',
  type: 'h1',
};

export const H2 = Template.bind({});
H2.args = {
  children: 'I am Heading',
  type: 'h2',
};

export const H3 = Template.bind({});
H3.args = {
  children: 'I am Heading',
  type: 'h3',
};

export const H4 = Template.bind({});
H4.args = {
  children: 'I am Heading',
  type: 'h4',
};
