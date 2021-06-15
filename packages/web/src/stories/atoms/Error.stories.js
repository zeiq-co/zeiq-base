import React from 'react';

import Error from '../../components/atoms/Error';

export default {
  title: 'Atoms/Error',
  component: Error,
};

const Template = (args) => <Error {...args}>{args.children}</Error>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'This is a error.',
};
