import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        soda: path.resolve(__dirname, 'san-pham-soda.html'),
        cola: path.resolve(__dirname, 'san-pham-cola.html'),
        peach: path.resolve(__dirname, 'san-pham-peach.html'),
        lemon: path.resolve(__dirname, 'san-pham-lemon.html'),
        cream: path.resolve(__dirname, 'san-pham-cream.html'),
        lemoncola: path.resolve(__dirname, 'san-pham-lemoncola.html'),
        rock: path.resolve(__dirname, 'san-pham-rock.html'),
        toast: path.resolve(__dirname, 'san-pham-toast.html'),
        veUhi: path.resolve(__dirname, 've-uhi.html'),
        hopTac: path.resolve(__dirname, 'hop-tac.html'),
        datHang: path.resolve(__dirname, 'dat-hang.html'),
        quanLyDon: path.resolve(__dirname, 'quan-ly-don.html'),
      }
    }
  }
});
