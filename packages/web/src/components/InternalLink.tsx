import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from './Link';

const InternalLink: React.FC<{ to: string }> = ({ to, children }) => (
  <Link as={RouterLink} to={to}>
    {children}
  </Link>
);

export default InternalLink;
