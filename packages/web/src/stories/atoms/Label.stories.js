import React from 'react';

import Label from '../../components/atoms/Label';

export default {
  title: 'Atoms/Label',
  component: Label,
};

const Template = (args) => <Label {...args}>{args.children}</Label>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Label Text',
};
