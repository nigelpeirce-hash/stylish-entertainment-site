# Setup Instructions

## Fix PATH Issue (One-time setup)

Since npm is installed via Homebrew at `/opt/homebrew/bin`, you need to add it to your PATH. 

### Option 1: Add to your shell profile (Recommended)
Add this line to your `~/.zshrc` file:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Then reload your shell:
```bash
source ~/.zshrc
```

### Option 2: Run commands with full path
Or you can temporarily add it before each command:
```bash
export PATH="/opt/homebrew/bin:$PATH"
npm run dev
```

## Running the Development Server

1. **Make sure you're in the project directory:**
   ```bash
   cd "/Users/nigel/Desktop/Local Sites/Stylish New Webiste"
   ```

2. **Add npm to PATH (if not already done):**
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to:**
   ```
   http://localhost:3000
   ```

## Troubleshooting

If you get "command not found" errors:
- Make sure `/opt/homebrew/bin` is in your PATH
- Check that `node_modules` exists: `ls node_modules`
- Try running: `export PATH="/opt/homebrew/bin:$PATH"` before npm commands
