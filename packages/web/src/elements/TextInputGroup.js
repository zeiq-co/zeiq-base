import React from 'react';

import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Error from '../atoms/Error';

const TextInput = ({ name, label, error, ...props }) => (
  <div className="relative">
    <Label htmlFor={name}>{label}</Label>
    <Input name={name} {...props} />
    {error && <Error>{error}</Error>}
  </div>
);

export default TextInput;
