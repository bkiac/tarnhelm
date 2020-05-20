import styled from 'styled-components';

import Icon from './Icon';

export const content = '\\e902';

const StyledDeathIcon = styled(Icon)`
  &:before {
    content: '${content}';
  }
`;

export default StyledDeathIcon;
