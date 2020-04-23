import memo from 'memoize-one';

interface Config {
  domain: string;
  secure: boolean;
  uri: {
    http: string;
    ws: string;
  };
}

function uri(options: { protocol: 'http' | 'ws'; secure: boolean; domain: string }): string {
  const protocol = options.secure ? `${options.protocol}s` : options.protocol;
  return `${protocol}://${options.domain}`;
}

const domain = process.env.REACT_APP_SERVER_DOMAIN || '';

export default memo(
  (): Config => {
    const secure = window.location.protocol === 'https:';
    const http = uri({ protocol: 'http', secure, domain });
    const ws = uri({ protocol: 'ws', secure, domain });
    return {
      domain: domain || '',
      secure,
      uri: {
        http,
        ws,
      },
    };
  },
);
