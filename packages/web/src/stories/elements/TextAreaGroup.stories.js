import React from 'react';

import TextAreaGroup from '../../components/elements/TextAreaGroup';

export default {
  title: 'Elements/TextAreaGroup',
  component: TextAreaGroup,
};

const Template = (args) => <TextAreaGroup {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  name: 'message',
  label: 'Label Text',
};

export const Error = Template.bind({});
Error.args = {
  name: 'message',
  label: 'Label Text',
  error: 'This field is required',
};
