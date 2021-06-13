import tw from 'twin.macro';
import React from 'react';

const Heading = ({ type, children, className, ...props }) => {
  const classNameMerged =
    'sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900';

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

export default Heading;
