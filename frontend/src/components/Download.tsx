import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import bytes from 'bytes';

import { useDownload } from '../hooks';

const Download: React.FunctionComponent = () => {
  const { id, secretb64 } = useParams<{ id: string; secretb64: string }>();

  const [count, setCount] = useState(0);
  const [state, download] = useDownload(id, secretb64);
  const { status, loading, metadata, error } = state;

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
    return download();
  }, [download]);

  return (
    <>
      <div>ID: {id}</div>
      <div>Secret: {secretb64}</div>
      {error ? (
        <p>404</p>
      ) : (
        <div>
          {status === 0 && <p>Setting up keys...</p>}

          {metadata && (
            <>
              <div>Name: {metadata.name}</div>
              <div>Size: {bytes(metadata.size)}</div> {/* eslint-disable-line */}
            </>
          )}

          {status !== 0 && loading && <p>...</p>}

          {!loading && count === 0 && (
            <button type="button" onClick={handleClick} disabled={loading}>
              Download
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Download;
