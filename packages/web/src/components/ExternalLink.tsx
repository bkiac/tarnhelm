import React from 'react';
import isNil from 'lodash.isnil';

import Link from './Link';

type Target = '_blank' | '_self' | '_parent' | '_top';

const ExternalLink: React.FC<{ href: string; target?: Target; rel?: string }> = ({
  href,
  target,
  rel,
  children,
}) => (
  <Link
    href={href}
    target={target}
    rel={target === '_blank' ? `${!isNil(rel) ? `${rel} ` : ''}noopener noreferrer` : rel}
  >
    {children}
  </Link>
);

export default ExternalLink;
