import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

import { useEncryptedFileUpload } from '../hooks';

function Upload(): ReactElement {
  const filesRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);

  const [counter, setCounter] = useState(0);

  const [
    { secret },
    {
      id,
      loading,
      progress: { percent, count, estimate },
    },
    upload,
  ] = useEncryptedFileUpload();

  function handleClick(event: React.MouseEvent): void {
    event.preventDefault();
    setCounter(counter + 1);
  }

  useEffect(() => {
    if (filesRef.current?.files && filesRef.current.files[0] && counter > 0) {
      upload(filesRef.current.files[0]);
    }
  }, [upload, counter]);

  return (
    <>
      <p>Select file</p>
      <input
        type="file"
        ref={filesRef}
        onChange={(event) => setHasFile(Boolean(event.target.value))}
      />
      <button type="button" onClick={handleClick} disabled={!hasFile}>
        Upload
      </button>
      {loading && <p>Uploading...</p>}
      {id && !loading && secret && (
        <>
          <p>
            File ID: {id}, Key: {secret.b64}
          </p>
        </>
      )}
      <p>
        {Math.floor(percent * 100)}%, #{count}
      </p>
      {estimate && (
        <p>
          {format(estimate, 'yyyy-MM-dd HH:mm:ss')} {formatDistanceToNow(estimate)}
        </p>
      )}
    </>
  );
}

export default Upload;
