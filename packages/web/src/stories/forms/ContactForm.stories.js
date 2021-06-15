import React from 'react';

import ContactForm from '../../components/forms/ContactForm';

export default {
  title: 'Forms/ContactForm',
  component: ContactForm,
};

const Template = (args) => <ContactForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
