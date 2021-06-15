import React from 'react';

import AnchorLink from '../../components/atoms/AnchorLink';

export default {
  title: 'Atoms/AnchorLink',
  component: AnchorLink,
};

const Template = (args) => <AnchorLink {...args}>{args.children}</AnchorLink>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Click Me',
};
