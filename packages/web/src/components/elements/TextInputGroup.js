import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Error from '../atoms/Error';

const TextInputGroup = ({ name, label, error, ...props }) => (
  <div tw="relative">
    <Label htmlFor={name}>{label}</Label>
    <Input name={name} {...props} />
    {error && <Error>{error}</Error>}
  </div>
);

TextInputGroup.defaultProps = {
  error: undefined,
};
TextInputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default TextInputGroup;
