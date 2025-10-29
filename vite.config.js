import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        
        // Copy manifest
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(distDir, 'manifest.json')
        );
        
        // Copy content.css
        const contentCssSource = resolve(__dirname, 'src/content/content.css');
        if (existsSync(contentCssSource)) {
          copyFileSync(contentCssSource, resolve(distDir, 'content.css'));
        }
        
        // Copy icons if they exist
        const iconsSourceDir = resolve(__dirname, 'public/icons');
        const iconsDistDir = resolve(distDir, 'icons');
        
        if (!existsSync(iconsDistDir)) {
          mkdirSync(iconsDistDir, { recursive: true });
        }
        
        // Copy PNG icons if they exist
        const iconSizes = [16, 48, 128];
        iconSizes.forEach(size => {
          const iconFile = `icon${size}.png`;
          const sourcePath = resolve(iconsSourceDir, iconFile);
          const destPath = resolve(iconsDistDir, iconFile);
          
          if (existsSync(sourcePath)) {
            copyFileSync(sourcePath, destPath);
          }
        });
        
        // Move HTML files from subdirectories to root
        const moveHtmlFiles = (dir) => {
          const files = readdirSync(dir);
          for (const file of files) {
            const fullPath = join(dir, file);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
              moveHtmlFiles(fullPath);
            } else if (file.endsWith('.html')) {
              const targetName = file === 'index.html' ? 'popup.html' : file;
              const targetPath = join(distDir, targetName);
              if (fullPath !== targetPath) {
                copyFileSync(fullPath, targetPath);
              }
            }
          }
        };
        
        moveHtmlFiles(distDir);
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/service-worker.js'),
        content: resolve(__dirname, 'src/content/content.js'),
        offscreen: resolve(__dirname, 'src/offscreen/offscreen.html')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'service-worker.js';
          if (chunkInfo.name === 'content') return 'content.js';
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') return 'popup.html';
          if (assetInfo.name === 'offscreen.html') return 'offscreen.html';
          if (assetInfo.name === 'content.css') return 'content.css';
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  }
});
