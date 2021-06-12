import React from 'react';

import { Label } from '@zeiq/web';

export default {
  title: 'Atoms/Label',
  component: Label,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = (args) => <Label {...args}>{args.children}</Label>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Label Text',
};
