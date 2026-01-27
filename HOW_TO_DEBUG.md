# How to Debug - Quick Guide

## ⚠️ Important: These are CODE examples, not terminal commands!

The debug utilities are **JavaScript/TypeScript code** that you add to your `.tsx` or `.ts` files, NOT commands you run in the terminal.

## ✅ Correct Usage (In Your Code Files)

### Step 1: Import the debug utilities

At the top of your component file (e.g., `app/admin/bookings/[id]/page.tsx`):

```typescript
import { debug } from '@/lib/debug';
```

### Step 2: Use them in your code

**Example 1: Logging when a component mounts**
```typescript
useEffect(() => {
  debug.log('Component mounted', { bookingId });
  // ... rest of your code
}, [bookingId]);
```

**Example 2: Logging errors**
```typescript
try {
  // ... your code
} catch (error) {
  debug.error('Failed to fetch booking', error, { bookingId });
}
```

**Example 3: Tracking API calls**
```typescript
const response = await fetch('/api/admin/bookings/123');
debug.api('GET', '/api/admin/bookings/123', { status: response.status });
```

**Example 4: Measuring performance**
```typescript
const fetchData = async () => {
  const endTimer = debug.time('fetchData');
  // ... do work ...
  endTimer(); // This logs how long it took
};
```

## ❌ What NOT to Do

**Don't run these in the terminal:**
```bash
# ❌ This won't work - it's not a terminal command!
debug.log('Component mounted', { props });
```

## 🔍 Where to See the Debug Output

1. **Open your browser** (where the app is running)
2. **Open DevTools** (Press F12 or Cmd+Option+I on Mac)
3. **Go to the Console tab**
4. You'll see messages like:
   ```
   [DEBUG] Component mounted { bookingId: "123" }
   [API] GET /api/admin/bookings/123 { status: 200 }
   [PERF] fetchBooking: 234.56ms
   ```

## 📝 Real Example

Here's how I added it to your booking page:

**File: `app/admin/bookings/[id]/page.tsx`**

```typescript
// At the top with other imports
import { debug } from '@/lib/debug';

// In your fetchBooking function
const fetchBooking = async () => {
  const endTimer = debug.time('fetchBooking'); // Start timer
  try {
    debug.log('Fetching booking', { bookingId });
    
    const response = await fetch(`/api/admin/bookings/${bookingId}`);
    debug.api('GET', `/api/admin/bookings/${bookingId}`, { status: response.status });
    
    // ... rest of code ...
    
    endTimer(); // End timer - shows how long it took
  } catch (err) {
    debug.error('Error fetching booking', err, { bookingId });
    endTimer();
  }
};
```

## 🎯 Quick Debugging Checklist

1. **Check Browser Console** (F12 → Console tab)
   - Look for red error messages
   - Look for `[DEBUG]`, `[ERROR]`, `[API]` messages

2. **Check Network Tab** (F12 → Network tab)
   - Look for failed requests (red status codes)
   - Click on failed requests to see error details

3. **Check Server Logs** (Terminal where `npm run dev` is running)
   - Look for server-side errors
   - Look for API route errors

4. **Use React DevTools** (Browser extension)
   - Inspect component props and state
   - Check for unnecessary re-renders

## 🚀 Enable More Debugging

Add to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_DEBUG_RENDERS=true  # Log every component render (use sparingly!)
NEXT_PUBLIC_DEBUG_STATE=true     # Log every state change (use sparingly!)
```

## 💡 Common Debugging Scenarios

### "Why isn't my data loading?"
```typescript
debug.log('Before fetch', { bookingId });
const response = await fetch(`/api/admin/bookings/${bookingId}`);
debug.api('GET', `/api/admin/bookings/${bookingId}`, { status: response.status });
const data = await response.json();
debug.log('After fetch', { data });
```

### "Why is my component re-rendering so much?"
Enable render logging:
```bash
NEXT_PUBLIC_DEBUG_RENDERS=true
```
Then check the console - you'll see `[RENDER]` messages for every component render.

### "Why is my API call failing?"
```typescript
try {
  const response = await fetch('/api/something');
  debug.api('GET', '/api/something', { status: response.status });
  
  if (!response.ok) {
    const errorData = await response.json();
    debug.error('API call failed', null, { status: response.status, error: errorData });
  }
} catch (error) {
  debug.error('Network error', error, { url: '/api/something' });
}
```

## 📚 More Help

See `DEBUGGING_GUIDE.md` for a complete debugging guide with all the tools and techniques.
