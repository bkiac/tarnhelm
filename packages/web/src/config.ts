import memo from 'memoize-one';

interface Config {
  secure: boolean;
  app: {
    origin: string;
  };
  server: {
    host: string;
    origin: {
      http: string;
      ws: string;
    };
  };
}

function url(options: { protocol: 'http' | 'ws'; secure: boolean; host: string }): string {
  const protocol = options.secure ? `${options.protocol}s` : options.protocol;
  return `${protocol}://${options.host}`;
}

const host = process.env.REACT_APP_SERVER_HOST ?? '';

export default memo(
  (): Config => {
    const secure = window.location.protocol === 'https:';
    const http = url({ protocol: 'http', secure, host });
    const ws = url({ protocol: 'ws', secure, host });
    return {
      secure,
      app: {
        origin: window.location.origin,
      },
      server: {
        host,
        origin: {
          http,
          ws,
        },
      },
    };
  },
);
