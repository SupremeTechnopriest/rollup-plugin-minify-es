const minifier = require('uglify-es').minify;

export default function minify(userOptions) {
    const options = Object.assign({ sourceMap: true }, userOptions);
    return {
        name: 'minify',

        transformBundle(code) {
            const result = minifier(code, options);
            if (result.error) {
              throw result.error;
            }
            return result;
        }
    };
}
