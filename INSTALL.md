# Installation Guide

## Prerequisites

Make sure you have Node.js installed. You can check by running:
```bash
node --version
npm --version
```

If these commands don't work, install Node.js from: https://nodejs.org/

## Installation Steps

1. **Install dependencies** (this may take a few minutes):
   ```bash
   npm install
   ```

2. **Wait for installation to complete** - You should see:
   - `added X packages` message
   - A `node_modules` folder should be created

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Troubleshooting

If `npm install` fails:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json** (if they exist):
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. **Try installing again**:
   ```bash
   npm install
   ```

If you see permission errors, you might need to use `sudo` (not recommended) or fix npm permissions.
