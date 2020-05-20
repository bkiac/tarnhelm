import styled from 'styled-components';

import Icon from './Icon';

export const content = '\\e901';

const SaveIcon = styled(Icon)`
  &:before {
    content: '${content}';
  }
`;

export default SaveIcon;
