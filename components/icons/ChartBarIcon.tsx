
import React from 'react';
import { Icon } from './Icon';

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3Zm4.5 9.5a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v4.5Zm3.5-2.5a1 1 0 0 1-2 0V10a1 1 0 0 1 2 0v2.5Zm3.5-5.5a1 1 0 0 1-2 0V5a1 1 0 0 1 2 0v2.5Z"
      clipRule="evenodd"
    />
  </Icon>
);
