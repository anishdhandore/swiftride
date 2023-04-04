import { nodePolyfills } from 'esbuild-plugin-node-polyfills';

export default {
  plugins: [
    nodePolyfills({
      crypto: true,
      http: true
    }),
    {
      name: 'polyfill-crypto',
      enforce: 'pre',
      apply: 'build',
      transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
          return html.replace(
            '</head>',
            '<script type="module">import "crypto-browserify";</script></head>'
          );
        },
      },
    },
    {
      name: 'polyfill-http',
      enforce: 'pre',
      apply: 'build',
      transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
          return html.replace(
            '</head>',
            '<script type="module">import "stream-http";</script></head>'
          );
        },
      },
    },
  ],
};

