import styled from 'styled-components';

import Icon from './Icon';

export const content = '\\e903';

const StyledErrorIcon = styled(Icon)`
  &:before {
    content: '${content}';
  }
`;

export default StyledErrorIcon;
