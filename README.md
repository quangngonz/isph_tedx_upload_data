# ISPH TEDx CSV Uploader

A React + Vite app for uploading hashed attendee data (name, phone, email) from a CSV file into a Supabase database for ISPH TEDx event management.

## 🚀 Features

- 🔐 Admin login via environment password
- 📄 CSV upload with PapaParse
- 🔑 SHA-256 hashing of unique identifiers
- ☁️ Supabase integration for upsert/delete
- ⚡ Built with Vite + React 19

## 🔧 Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**

   Create a `.env` file and add:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_PASSWORD=your-admin-password
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

## 🗂 Project Structure

- `src/App.jsx`: Main logic — handles auth, CSV parsing, hashing, uploading, and clearing.
- `mock_data.csv`: Sample input format.
- `eslint.config.js`: ESLint setup with modern plugins.
- `vite.config.js`: Vite configuration using `@vitejs/plugin-react`.

## 🧠 Tech Stack

- React 19
- Vite 6
- Supabase JS SDK
- PapaParse
- SHA-256 via `crypto.subtle`

## ⚠️ Production Tips

- Add authentication via Supabase or external OAuth if scaling this app
- Migrate to TypeScript for type safety (start from [Vite TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts))
- Protect database operations with stricter access policies

## 📜 License

MIT. Do what you want — just don't break stuff in production without testing.
