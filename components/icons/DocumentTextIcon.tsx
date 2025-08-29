
import React from 'react';
import { Icon } from './Icon';

export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path
      fillRule="evenodd"
      d="M5 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8.828a3 3 0 0 0-.879-2.121l-3.657-3.657A3 3 0 0 0 8.828 2H5Zm1 5a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Z"
      clipRule="evenodd"
    />
  </Icon>
);
