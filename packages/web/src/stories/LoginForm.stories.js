import React from 'react';

import LoginForm from '../components/forms/LoginForm';

export default {
  title: 'Forms/LoginForm',
  component: LoginForm,
};

const Template = (args) => <LoginForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
