import React from 'react';

import { H1, Page, Upload } from '../components';

const UploadPage: React.FC = () => (
  <Page>
    <H1>Share end-to-end encrypted files which expire automatically</H1>
    <Upload />
  </Page>
);

export default UploadPage;
