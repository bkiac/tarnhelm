import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useDecryptedFileDownload } from '../hooks';

const Download: React.FunctionComponent = () => {
  const { id, secret } = useParams<{ id: string; secret: string }>();

  const [count, setCount] = useState(0);
  const [{ loading }, download] = useDecryptedFileDownload();

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
    return download(id, secret);
  }, [download, id, secret]);

  return (
    <>
      <div>File ID: {id}</div>
      <div>Secret: {secret}</div>
      {loading && <p>Downloading...</p>}
      {!loading && count === 0 && (
        <button type="button" onClick={handleClick} disabled={loading}>
          Download
        </button>
      )}
    </>
  );
};

export default Download;
