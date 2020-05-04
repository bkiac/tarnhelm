import React, { useCallback, ReactElement, useRef, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import isNil from 'lodash.isnil';

import config from '../config';
import { useUpload } from '../hooks';

function Upload(): ReactElement {
  const filesRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);

  const [state, upload] = useUpload();
  const {
    secretb64,
    id,
    status,
    progress: { loading, percent, ticks, estimate },
  } = state;

  const handleClick = useCallback(() => {
    if (!loading && filesRef.current?.files && filesRef.current.files[0]) {
      upload(filesRef.current.files[0]);
    }
  }, [loading, upload]);

  const to = `/download/${id}&${secretb64}`;
  const href = config().app.origin + to;

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

      <div>
        {status === 0 && <p>Setting up keys...</p>}

        {status !== 0 && loading && (
          <>
            <p>Uploading...</p>
            <p>
              {Math.floor(percent * 100)}%, #{ticks}
            </p>
            {estimate && (
              <p>
                {format(estimate, 'yyyy-MM-dd HH:mm:ss')} {formatDistanceToNow(estimate)}
              </p>
            )}
          </>
        )}

        {!loading && !isNil(id) && !isNil(secretb64) && <Link to={to}>{href}</Link>}
      </div>
    </>
  );
}

export default Upload;
