import 'twin.macro';
import React from 'react';

import Label from '../atoms/Label';
import TextArea from '../atoms/TextArea';
import Error from '../atoms/Error';

const TextAreaGroup = ({ name, label, error, ...props }) => (
  <div tw="relative">
    <Label htmlFor={name}>{label}</Label>
    <TextArea name={name} {...props} />
    {error && <Error>{error}</Error>}
  </div>
);

export default TextAreaGroup;
