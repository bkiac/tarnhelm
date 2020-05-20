import React, { useMemo, useCallback, ReactElement, useState } from 'react';
import styled, { css } from 'styled-components';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import isNil from 'lodash.isnil';
import differenceWith from 'lodash.differencewith';
import { useDropzone, DropHandler } from 'react-dropzone';
import { v4 as uuid } from 'uuid';

import config from '../config';
import { useUpload } from '../hooks';
import Button from './Button';
import FileStick from './FileStick';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dropzone = styled.div`
  input {
    display: none;
  }
`;

const StyledVault = styled.div(
  (props) => css`
    border: 1px solid ${props.theme.colors.broom};

    padding: 2rem 4rem;

    height: 500px;
    width: 500px;

    & > * {
      margin-bottom: 1rem;
    }
  `,
);

function isDuplicate<A extends File, B extends File>(a: A, b: B): boolean {
  return (
    a.name === b.name && a.size === b.size && a.type === b.type && a.lastModified === b.lastModified
  );
}

interface FileObject {
  id: string;
  file: File;
}

function Vault(): ReactElement {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const files = useMemo(() => fileObjects.map((fo) => fo.file), [fileObjects]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFileObjects((oldFileObjects) => [
      ...oldFileObjects,
      ...newFiles.map((f) => ({ id: uuid(), file: f })),
    ]);
  }, []);
  const deleteFile = useCallback((id: string) => {
    setFileObjects((oldFileObjects) => oldFileObjects.filter((fo) => fo.id !== id));
  }, []);

  const createFileDeleteHandler = useCallback((id: string) => () => deleteFile(id), [deleteFile]);

  const handleDrop = useCallback<DropHandler>(
    (newFiles) => addFiles(differenceWith(newFiles, files, isDuplicate)),
    [files, addFiles],
  );
  const hasFiles = files.length > 0;
  const dropzone = useDropzone({
    onDrop: handleDrop,
    noClick: hasFiles,
    noKeyboard: hasFiles,
  });

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
    if (!loading && hasFiles) upload(files[0], { expiry: expiry * 86400, downloadLimit });
  }, [files, hasFiles, loading, upload, expiry, downloadLimit]);

  const to = `/download/${id}&${secretb64}`;
  const href = config().app.origin + to;

  const uploadDisabled = useMemo(
    () =>
      !hasFiles || loading || expiry < 1 || expiry > 14 || downloadLimit < 1 || downloadLimit > 200,
    [hasFiles, loading, expiry, downloadLimit],
  );

  return (
    <Container>
      <Dropzone {...dropzone.getRootProps()}>
        <StyledVault>
          {fileObjects.map(({ id: fid, file }) => (
            <FileStick
              key={fid}
              name={file.name}
              size={file.size}
              onDelete={createFileDeleteHandler(fid)}
            />
          ))}
        </StyledVault>
        <input {...dropzone.getInputProps()} />
      </Dropzone>

      <div>
        <label htmlFor="expiry" style={{ display: 'inline-block' }}>
          Expire after{' '}
          <input
            style={{ color: 'black' }}
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
            style={{ color: 'black' }}
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

      {!uploadDisabled && (
        <Button onClick={handleClick} disabled={uploadDisabled}>
          Upload
        </Button>
      )}

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
    </Container>
  );
}

export default Vault;
