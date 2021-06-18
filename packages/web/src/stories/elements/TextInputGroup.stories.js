import React from 'react';

import TextInputGroup from '../../components/elements/TextInputGroup';

export default {
  title: 'Elements/TextInputGroup',
  component: TextInputGroup,
};

const Template = (args) => <TextInputGroup {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  name: 'email',
  label: 'Label Text',
};

export const Error = Template.bind({});
Error.args = {
  name: 'email',
  label: 'Label Text',
  error: 'This field is required',
};

export const InputAddon = Template.bind({});
InputAddon.args = {
  name: 'email',
  label: 'Label Text',
  addon: '.example.com'
};