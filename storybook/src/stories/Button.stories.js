import React from 'react';

import { Button } from '@zeiq/web';
// import { Button } from '../atoms/Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    label: {
      name: 'button',
    },
    onClick: {
      table: {
        category: 'Events',
      },
    },
    size: {},
  },
};

const Template = (args) => <Button {...args}>{args.children}</Button>;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  children: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  children: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  children: 'Button',
};
