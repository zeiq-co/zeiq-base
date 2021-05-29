import React from 'react';

const Heading = ({ type, children, className, ...props }) => {
  const classNameMerged = `sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 ${className}`;

  if (type === 'h1') {
    return (
      <h1 className={classNameMerged} {...props}>
        {children}
      </h1>
    );
  }
  if (type === 'h2') {
    return (
      <h2 className={classNameMerged} {...props}>
        {children}
      </h2>
    );
  }
  if (type === 'h3') {
    return (
      <h2 className={classNameMerged} {...props}>
        {children}
      </h2>
    );
  }

  return <h3 className={classNameMerged}>{children}</h3>;
};

export default Heading;
