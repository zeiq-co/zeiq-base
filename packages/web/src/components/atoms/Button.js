import tw from 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  const {
    children,
    isLoading,
    disabled,
    className,
    primary,
    size,
    ...otherProps
  } = props;

  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      className={className}
      css={[
        tw`text-indigo-100 transition-colors duration-150 border-0 rounded focus:outline-none`,
        isLoading && tw`animate-pulse`,
        size === 'small' && tw`py-1 px-4 text-sm`,
        size === 'medium' && tw`py-2 px-6`,
        size === 'large' && tw`py-2 px-8 text-lg`,
        primary
          ? tw`bg-green-500 hover:bg-green-700`
          : tw`bg-indigo-500 hover:bg-indigo-700`,
      ]}
      {...otherProps}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  primary: false,
  size: 'medium',
  onClick: () => {},
  isLoading: false,
  disabled: false,
};

export default Button;
