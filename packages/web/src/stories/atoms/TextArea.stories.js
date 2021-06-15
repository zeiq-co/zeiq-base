import React from 'react';

import TextArea from '../../components/atoms/TextArea';

export default {
  title: 'Atoms/TextArea',
  component: TextArea,
};

const Template = (args) => <TextArea {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
