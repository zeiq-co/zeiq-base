import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Error from '../atoms/Error';

const TextInputGroup = ({ name, label, error, addon, ...props }) => (
  <div tw="relative">
    <Label htmlFor={name}>{label}</Label>
    {addon ? (
      <div tw="flex">
        <Input name={name} {...props} tw="rounded-l" />
        <div tw="w-48 flex items-center justify-center bg-gray-400 rounded-r text-gray-100">
          .gallery.co
        </div>
      </div>
    ) : (
      <Input name={name} {...props} />
    )}
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
  addon: PropTypes.string,
};

export default TextInputGroup;
