import React from 'react';

import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';

export default {
  title: 'Forms/ForgotPasswordForm',
  component: ForgotPasswordForm,
};

const Template = (args) => <ForgotPasswordForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
