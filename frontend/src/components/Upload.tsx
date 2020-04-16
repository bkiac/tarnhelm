import React, { ReactElement, useRef, useState, useEffect } from 'react';

import { useUpload } from '../hooks';

function Upload(): ReactElement {
  const filesRef = useRef<HTMLInputElement>(null);
  const [counter, setCounter] = useState(0);

  const [upload, progress] = useUpload();

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
      <p>{progress}%</p>
    </>
  );
}

export default Upload;