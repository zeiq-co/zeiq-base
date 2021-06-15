import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ type, color, children, className, ...props }) => {
  const classNameMerged = 'sm:text-3xl text-2xl font-medium title-font mb-4';

  if (type === 'h1') {
    return (
      <h1 className={className} css={classNameMerged} {...props}>
        {children}
      </h1>
    );
  }
  if (type === 'h2') {
    return (
      <h2 className={className} css={classNameMerged} {...props}>
        {children}
      </h2>
    );
  }
  if (type === 'h3') {
    return (
      <h3 className={className} css={classNameMerged} {...props}>
        {children}
      </h3>
    );
  }

  return (
    <h4 className={className} css={classNameMerged}>
      {children}
    </h4>
  );
};

Heading.defaultProps = {
  type: 'h1',
  color: 'text-gray-900',
};
Heading.propTypes = {
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  color: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

export default Heading;
