import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        resolve: {
            alias: [
                {find: '@', replacement: '/src'},
                {find: 'assets', replacement: '/src/assets'},
                {find: 'components', replacement: '/src/components'},
                {find: 'contexts', replacement: '/src/contexts'},
                {find: 'data', replacement: '/src/data'},
                {find: 'helpers', replacement: '/src/helpers'},
                {find: 'hooks', replacement: '/src/hooks'},
                {find: 'pages', replacement: '/src/pages'},
            ],
        },
        server: {
            port: parseInt(env.PORT, 10),
        },
        esbuild: {
            supported: {
                'top-level-await': true //browsers can handle top-level-await features
            },
        }
    };
});
