import styled from 'styled-components';

import Icon from './Icon';

export const content = '\\e900';

const StyledDeleteIcon = styled(Icon)`
  &:before {
    content: '${content}';
  }
`;

export default StyledDeleteIcon;
