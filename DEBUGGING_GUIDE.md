# Debugging Guide

This guide helps you debug issues in the Stylish Entertainment website.

## Quick Debug Checklist

### 1. Check Browser Console
- Open DevTools (F12 or Cmd+Option+I)
- Check the **Console** tab for errors (red messages)
- Check the **Network** tab for failed API requests (red status codes)

### 2. Common Issues to Look For

#### React Errors
- **"Objects are not valid as a React child"** → Data not properly sanitized
- **"Maximum update depth exceeded"** → Infinite loop in useEffect
- **"Cannot read property of undefined"** → Missing null checks

#### API Errors
- **404 Not Found** → Route doesn't exist or not compiled yet (hot reload issue)
- **500 Internal Server Error** → Server-side error, check server logs
- **401 Unauthorized** → Authentication issue

#### Performance Issues
- **Slow page loads** → Check Network tab for slow requests
- **Infinite re-renders** → Check React DevTools Profiler
- **Memory leaks** → Check Memory tab in DevTools

## Debugging Tools

### 1. Enable Debug Logging

Add to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_DEBUG_RENDERS=true  # Log component renders (use sparingly)
NEXT_PUBLIC_DEBUG_STATE=true    # Log state changes (use sparingly)
```

### 2. Use Debug Utilities

Import and use the debug utilities:
```typescript
import { debug } from '@/lib/debug';

// Instead of console.log
debug.log('Component mounted', { props });

// Log errors with context
debug.error('Failed to fetch booking', error, { bookingId });

// Track API calls
debug.api('POST', '/api/bookings', data);

// Measure performance
const endTimer = debug.time('fetchBooking');
// ... do work ...
endTimer();
```

### 3. React DevTools

Install the [React DevTools browser extension](https://react.dev/learn/react-developer-tools):
- Inspect component props and state
- Check for unnecessary re-renders
- Profile performance

### 4. Error Boundary

The app now has an ErrorBoundary component that catches React errors. If you see the error screen:
1. Check the error message (in development mode)
2. Try clicking "Try Again"
3. If it persists, check the console for full error details

## Debugging Specific Issues

### Issue: Page Not Loading
1. Check browser console for errors
2. Check Network tab - is the page request failing?
3. Check if the route exists in `app/` directory
4. Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: API Calls Failing
1. Check Network tab - what's the status code?
2. Check the Response tab - what error message?
3. Check server logs (terminal where `npm run dev` is running)
4. Verify the API route exists in `app/api/`

### Issue: Data Not Showing
1. Check if data is being fetched (Network tab)
2. Check if data is in the correct format (Console - log the response)
3. Check for null/undefined values
4. Check React DevTools - is the component receiving props?

### Issue: Infinite Re-renders
1. Open React DevTools Profiler
2. Record a session
3. Look for components rendering too many times
4. Check useEffect dependencies - are they causing loops?
5. Common causes:
   - Missing dependency in useEffect
   - Object/array in dependency array (create new reference each render)
   - State update in render function

### Issue: Styling Problems
1. Check if Tailwind classes are being applied
2. Check browser DevTools Elements tab
3. Look for CSS conflicts
4. Check if classes are being purged (build issue)

## Debugging Commands

### Check for TypeScript Errors
```bash
npm run type-check  # If you have this script
# Or
npx tsc --noEmit
```

### Check for Linting Errors
```bash
npm run lint
```

### Check Build Errors
```bash
npm run build
```

### Check Database Connection
```bash
npx prisma studio
# Opens database browser at http://localhost:5555
```

## Server-Side Debugging

### Check Server Logs
When running `npm run dev`, check the terminal for:
- API route errors
- Database query errors
- Environment variable issues

### Add Server-Side Logging
In API routes:
```typescript
console.log('[API] Request received', { method, url, body });
console.error('[API] Error occurred', error);
```

## Common Bugs & Fixes

### Bug: "Cannot read property 'email' of undefined"
**Fix**: Add null checks:
```typescript
const email = booking?.email || 'No email';
```

### Bug: Infinite useEffect Loop
**Fix**: Check dependencies:
```typescript
// BAD - creates new object each render
useEffect(() => {
  fetchData({ filters: { status: 'active' } });
}, [{ filters: { status: 'active' } }]);

// GOOD - use primitive values or memoize
useEffect(() => {
  fetchData({ filters: { status: 'active' } });
}, []); // Empty deps if only run once

// OR
const filters = useMemo(() => ({ status: 'active' }), []);
useEffect(() => {
  fetchData({ filters });
}, [filters]);
```

### Bug: API Returns 404 on First Load
**Fix**: This is usually a hot-reload issue. Wait a moment and try again, or restart the dev server.

### Bug: State Not Updating
**Fix**: Check if you're mutating state directly:
```typescript
// BAD
state.items.push(newItem);
setState(state);

// GOOD
setState([...state.items, newItem]);
```

## Getting Help

If you're stuck:
1. Check the browser console for errors
2. Check server logs
3. Use React DevTools to inspect component state
4. Use Network tab to check API calls
5. Add debug.log statements to trace execution
6. Check this guide for common issues

## Performance Debugging

### Check Bundle Size
```bash
npm run build
# Look for "First Load JS" sizes
```

### Profile React Components
1. Install React DevTools
2. Open Profiler tab
3. Click Record
4. Interact with the app
5. Stop recording
6. Check which components are slow

### Check Network Performance
1. Open DevTools Network tab
2. Check "Disable cache"
3. Reload page
4. Look for slow requests (red/yellow bars)
5. Check request sizes and timing
