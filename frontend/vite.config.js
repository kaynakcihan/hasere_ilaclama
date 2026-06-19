import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Mobil cihazlardan da IP üzerinden bağlanabilmek için
    watch: null, // Türkçe karakterli yollarda oluşan sonsuz döngü hatasını engellemek için
  }
});
