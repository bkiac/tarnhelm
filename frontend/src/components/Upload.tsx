import React, { useMemo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import isNil from 'lodash.isnil';
import differenceWith from 'lodash.differencewith';
import { useDropzone, DropHandler } from 'react-dropzone';
import { v4 as uuid } from 'uuid';
import bytes from 'bytes';

import config from '../config';
import { useUpload } from '../hooks';
import DangerIcon from './DangerIcon';
import Vault from './Vault';
import Button from './Button';

const Container = styled.div`
  width: 30vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dropzone = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const Info = styled.div`
  width: 95%;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;

  & > p {
    margin: 0;
    margin-bottom: 1rem;
  }
`;

const StyledTotalSize = styled.p<{ hasError?: boolean }>(
  (props) => css`
    color: ${props.hasError ? props.theme.palette.error : props.theme.palette.foreground};
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

const TotalSize: React.FC<{ hasError?: boolean }> = ({ hasError, children }) => (
  <StyledTotalSize hasError={hasError}>
    {hasError && <DangerIcon />}
    {children}
  </StyledTotalSize>
);

const Upload: React.FC = () => {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const files = useMemo(() => fileObjects.map((fo) => fo.file), [fileObjects]);
  const totalSize = useMemo(() => files.reduce((size, file) => size + file.size, 0), [files]);
  const hasFiles = files.length > 0;
  const areFilesTooLarge = totalSize > 5 * 1024 * 1024 * 1024;

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

  const filesInVault = useMemo(
    () =>
      fileObjects.map((fo) => ({
        id: fo.id,
        name: fo.file.name,
        size: fo.file.size,
        onDelete: createFileDeleteHandler(fo.id),
      })),
    [fileObjects, createFileDeleteHandler],
  );

  const [expiry, setExpiry] = useState(1); // days
  const [downloadLimit, setDownloadLimit] = useState(1);

  const [state, upload] = useUpload();
  const {
    secretb64,
    id,
    status,
    progress: { loading, percent },
  } = state;

  const handleDrop = useCallback<DropHandler>(
    (newFiles) => addFiles(differenceWith(newFiles, files, isDuplicate)),
    [files, addFiles],
  );
  const dropzone = useDropzone({
    onDrop: handleDrop,
    noClick: hasFiles,
    noKeyboard: hasFiles,
    disabled: areFilesTooLarge,
  });

  const handleClick = useCallback(() => {
    if (!loading && hasFiles) upload(files[0], { expiry: expiry * 86400, downloadLimit });
  }, [files, hasFiles, loading, upload, expiry, downloadLimit]);

  const to = `/download/${id}&${secretb64}`;
  const href = config().app.origin + to;

  const uploading = status !== 0 && loading;
  const success = !loading && !isNil(id) && !isNil(secretb64);

  const uploadDisabled = useMemo(
    () =>
      !hasFiles ||
      areFilesTooLarge ||
      loading ||
      expiry < 1 ||
      expiry > 14 ||
      downloadLimit < 1 ||
      downloadLimit > 200,
    [hasFiles, areFilesTooLarge, loading, expiry, downloadLimit],
  );

  return (
    <Container>
      <Dropzone {...dropzone.getRootProps()}>
        <Vault
          files={filesInVault}
          isDragActive={dropzone.isDragActive}
          loading={loading}
          success={success}
        />
        <input {...dropzone.getInputProps()} />
      </Dropzone>

      <Info>
        <InfoRow>
          <p>Total Size</p>
          <TotalSize hasError={areFilesTooLarge}>{bytes(totalSize)}</TotalSize>
        </InfoRow>

        <InfoRow>
          <p>Expires After</p>
          {uploading || success ? (
            <p>
              {expiry} {`day${expiry === 1 ? '' : 's'}`}
            </p>
          ) : (
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
          )}
        </InfoRow>

        <InfoRow>
          <p>Download Limit</p>
          {uploading || success ? (
            <p>{downloadLimit}</p>
          ) : (
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
          )}
        </InfoRow>

        {uploading && (
          <>
            <InfoRow>
              <p>Progress</p>
              <p>{Math.floor(percent * 100)}%</p>
            </InfoRow>
          </>
        )}
      </Info>

      {hasFiles && !loading && !success && (
        <Button onClick={handleClick} disabled={uploadDisabled}>
          Upload
        </Button>
      )}

      {success && <Link to={to}>{href}</Link>}
    </Container>
  );
};

export default Upload;
