import React, { useMemo, useCallback, ReactElement, useRef, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import isNil from 'lodash.isnil';

import config from '../config';
import { useUpload } from '../hooks';
import Button from './Button';

function Upload(): ReactElement {
  const filesRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);

  const [expiry, setExpiry] = useState(1); // days
  const [downloadLimit, setDownloadLimit] = useState(1);

  const [state, upload] = useUpload();
  const {
    secretb64,
    id,
    status,
    progress: { loading, percent, ticks, estimate },
  } = state;

  const handleClick = useCallback(() => {
    if (!loading && filesRef.current?.files && filesRef.current.files[0]) {
      upload(filesRef.current.files[0], { expiry: expiry * 86400, downloadLimit });
    }
  }, [loading, upload, expiry, downloadLimit]);

  const to = `/download/${id}&${secretb64}`;
  const href = config().app.origin + to;

  const uploadDisabled = useMemo(
    () =>
      !hasFile || loading || expiry < 1 || expiry > 14 || downloadLimit < 1 || downloadLimit > 200,
    [hasFile, loading, expiry, downloadLimit],
  );

  return (
    <>
      <p>Share a max 5GB file for 1-14 days, 1-200 downloads</p>

      <input
        id="file"
        type="file"
        ref={filesRef}
        onChange={(event) => setHasFile(Boolean(event.target.value))}
      />

      <div>
        <label htmlFor="expiry" style={{ display: 'inline-block' }}>
          Expire after{' '}
          <input
            id="expiry"
            type="number"
            min="1"
            max="14"
            disabled={loading}
            value={expiry}
            onChange={(event) => setExpiry(Number.parseInt(event.target.value, 10))}
          />
          days
        </label>

        <p style={{ display: 'inline-block', margin: '0.5em' }}>or</p>

        <label htmlFor="downloadLimit" style={{ display: 'inline-block' }}>
          <input
            id="downloadLimit"
            type="number"
            min="1"
            max="200"
            disabled={loading}
            value={downloadLimit}
            onChange={(event) => setDownloadLimit(Number.parseInt(event.target.value, 10))}
          />
          download(s)
        </label>
      </div>

      <Button onClick={handleClick} disabled={uploadDisabled}>
        Upload
      </Button>

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
