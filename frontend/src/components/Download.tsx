import React, { useState, useCallback } from 'react';

import { useDownload } from '../hooks';

const Download: React.FunctionComponent = () => {
  const [input, setInput] = useState<string>();

  const [decrypt, setDecrypt] = useState(false);

  const [{ loading }, download] = useDownload(undefined, decrypt);

  const handleClick = useCallback(() => {
    if (!input) {
      alert('Please enter a file ID');
      return;
    }
    download(input);
  }, [input, download]);

  return (
    <>
      <input type="text" onChange={(event) => setInput(event.target.value)} />
      <input type="checkbox" checked={decrypt} onClick={() => setDecrypt((d) => !d)} />
      {loading && <p>Downloading...</p>}
      <button type="button" onClick={handleClick}>
        Download
      </button>
    </>
  );
};

export default Download;
