import React, { useState, useCallback } from 'react';

import { useDecryptedFileDownload } from '../hooks';

const Download: React.FunctionComponent = () => {
  const [fileId, setFileId] = useState<string>();
  const [secret, setSecret] = useState<string>();

  const [{ loading }, download] = useDecryptedFileDownload();

  const handleClick = useCallback(() => {
    if (fileId && secret) return download(fileId, secret);
    return alert('Please enter a file ID and a secret!');
  }, [download, fileId, secret]);

  return (
    <>
      <label htmlFor="fileId">
        File ID
        <input type="text" onChange={(event) => setFileId(event.target.value)} />
      </label>

      <label htmlFor="secret">
        Key
        <input type="text" onChange={(event) => setSecret(event.target.value)} />
      </label>

      {loading && <p>Downloading...</p>}
      <button type="button" onClick={handleClick} disabled={!(fileId && secret) || loading}>
        Download
      </button>
    </>
  );
};

export default Download;
