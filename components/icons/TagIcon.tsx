
import React from 'react';

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
    {...props}
  >
    <path d="M3 3.5A1.5 1.5 0 014.5 2h9.25a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01.22.53V16.5a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 012 16.5v-13z" />
    <path d="M6.5 5a.5.5 0 000 1h.5a.5.5 0 000-1h-.5z" />
  </svg>
);

export default TagIcon;
