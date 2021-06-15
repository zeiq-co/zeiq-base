import React from 'react';

import SetPasswordForm from '../../components/forms/SetPasswordForm';

export default {
  title: 'Forms/SetPasswordForm',
  component: SetPasswordForm,
};

const Template = (args) => <SetPasswordForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
