import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import config from '../config';
import { exists } from '../utils';
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

  const to = `/download/${id}&${secret?.b64}`;
  const href = `${config().app.origin}${to}}`;

  return (
    <>
      <input
        id="file"
        type="file"
        ref={filesRef}
        onChange={(event) => setHasFile(Boolean(event.target.value))}
      />

      <button type="button" onClick={handleClick} disabled={!hasFile || loading}>
        Upload
      </button>

      {loading && (
        <div>
          <p>Uploading...</p>
          <p>
            {Math.floor(percent * 100)}%, #{count}
          </p>
          {estimate && (
            <p>
              {format(estimate, 'yyyy-MM-dd HH:mm:ss')} {formatDistanceToNow(estimate)}
            </p>
          )}
        </div>
      )}

      {!loading && exists(id) && secret && (
        <div>
          <Link to={to}>{href}</Link>
        </div>
      )}
    </>
  );
}

export default Upload;
