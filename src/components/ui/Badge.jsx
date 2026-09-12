import React from 'react';
export default function Badge({ children, className = '', ...props }) {
  return <span className={'ui-badge ' + className} {...props}>{children}</span>;
}

