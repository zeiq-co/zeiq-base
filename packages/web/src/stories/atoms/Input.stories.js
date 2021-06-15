import React from 'react';

import Input from '../../components/atoms/Input';

export default {
  title: 'Atoms/Input',
  component: Input,
};

const Template = (args) => <Input {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
