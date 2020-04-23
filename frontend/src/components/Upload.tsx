import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

import { useUpload } from '../hooks';

function Upload(): ReactElement {
  const filesRef = useRef<HTMLInputElement>(null);
  const [counter, setCounter] = useState(0);

  const [
    {
      id,
      loading,
      progress: { percent, count, estimate },
    },
    upload,
  ] = useUpload();

  function handleClick(event: React.MouseEvent): void {
    event.preventDefault();
    setCounter(counter + 1);
  }

  useEffect(() => {
    if (filesRef.current?.files && counter > 0) {
      upload(filesRef.current.files);
    }
  }, [upload, counter]);

  return (
    <>
      <p>Select file</p>
      <input type="file" ref={filesRef} />
      <button type="button" onClick={handleClick}>
        Upload
      </button>
      {loading && <p>Uploading...</p>}
      {id && !loading && <p>File ID: {id}</p>}
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
