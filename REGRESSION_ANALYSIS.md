# Regression Analysis: Booking Detail Page

## Current State Analysis

### Feature: Booking Detail Page (`app/admin/bookings/[id]/page.tsx`)

**Purpose:** Display and manage individual booking details with real-time updates from multiple child components.

**Size:** ~1,746 lines - monolithic component with 15+ child components

---

## 5-7 Sources of Underlying Instability

### 1. **Data Sanitization at Component Level (High Risk)**
**Location:** Lines 292-351 in `page.tsx`

**Problem:**
- Heavy data transformation happening in React component (should be in API layer)
- 100+ lines of sanitization logic runs on every fetch
- Creates new object references even when data hasn't changed
- Causes unnecessary re-renders in child components
- If API response format changes, component breaks silently

**Impact:** 
- Fixing one data type issue (e.g., `{fee}` objects) requires adding more sanitization
- Each fix adds complexity and potential for new bugs
- Child components receive different data shapes than expected

**Evidence:**
```typescript
// Lines 294-300: Fee sanitization
const sanitizeFeeValue = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && val !== null) {
    return Number(val.fee) || Number(val.amount) || Number(val.value) || 0;
  }
  return Number(val) || 0;
};
// This logic exists because API sometimes returns {fee: 100} instead of 100
```

---

### 2. **Multiple Overlapping useEffect Hooks (Medium-High Risk)**
**Location:** Lines 193-254

**Problem:**
- Three separate `useEffect` hooks all potentially calling `fetchBooking()`
- Dependencies overlap: `[status, session, bookingId]` appears in multiple places
- Race conditions: Multiple fetches can fire simultaneously
- No debouncing or request cancellation
- Dev bypass logic duplicated across effects

**Impact:**
- Fixing authentication flow can break dev bypass
- Adding new dependency can trigger unexpected refetches
- Changes to one effect can cause infinite loops

**Evidence:**
```typescript
// Effect 1: Lines 193-227 - Auth check + fetch
useEffect(() => { /* ... */ }, [status, session, router, bookingId]);

// Effect 2: Lines 229-246 - Auth check + fetch (DUPLICATE LOGIC)
useEffect(() => { /* ... */ }, [status, session, bookingId]);

// Effect 3: Lines 248-254 - Venue fetch (separate concern)
useEffect(() => { /* ... */ }, [showEditModal]);
```

---

### 3. **Tight Coupling: Child Components Directly Trigger Parent Refetch (High Risk)**
**Location:** Throughout component, lines 1264-1370

**Problem:**
- 15+ child components receive `onUpdate={fetchBooking}` callback
- Each component action triggers full page refetch
- No granular updates - entire booking object re-fetched for any change
- Child components have no knowledge of what changed
- Creates cascade of re-renders

**Impact:**
- Fixing one component's update can break others
- Adding new child component requires understanding parent's fetch logic
- Performance degrades as more components trigger refetches

**Evidence:**
```typescript
// Line 1264: TeamAssignment
<TeamAssignment onUpdate={fetchBooking} />

// Line 1350: CrewAssignments  
<CrewAssignments onUpdate={fetchBooking} />

// Line 1361: FlexibleOperatorSidebar
<FlexibleOperatorSidebar onUpdate={fetchBooking} />

// All trigger full refetch, even for minor changes
```

---

### 4. **API Response Shape Mismatch (Medium Risk)**
**Location:** `app/api/admin/bookings/[id]/route.ts` vs `page.tsx` interface

**Problem:**
- API returns Prisma-shaped data (nested relations, Date objects)
- Component expects sanitized, flattened data
- TypeScript interface doesn't match actual API response
- Fallback mode returns different shape than normal mode
- JSON fields (`feeBreakdown`, `emailsSent`) can be malformed

**Impact:**
- API changes break component silently
- Type safety is false - runtime errors occur despite TypeScript
- Fixing API response can break component expectations
- Fixing component can break API consumers

**Evidence:**
```typescript
// API returns: booking.feeBreakdown as JSON (could be string or object)
// Component expects: Array<{id: string, description: string, amount: number}>
// Sanitization tries to fix this, but it's a band-aid
```

---

### 5. **No Request Deduplication or Caching (Medium Risk)**
**Location:** `fetchBooking()` function, lines 256-376

**Problem:**
- Every call creates new fetch request (no request deduplication)
- Aggressive cache-busting (`?t=${timestamp}&_=${Math.random()}`) prevents any caching
- Multiple components can trigger simultaneous fetches
- No request cancellation - old requests can overwrite new data
- No optimistic updates

**Impact:**
- Fixing one race condition creates another
- Adding caching breaks real-time updates
- Removing cache-busting breaks stale data issues

**Evidence:**
```typescript
// Line 264: Aggressive cache-busting indicates caching problems
const response = await fetch(`/api/admin/bookings/${bookingId}?t=${timestamp}&_=${Math.random()}`, {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  },
});
```

---

### 6. **State Synchronization Issues (Medium Risk)**
**Location:** Multiple state variables, lines 175-190

**Problem:**
- 12+ separate `useState` hooks managing related state
- No single source of truth
- State updates scattered across component
- Child components maintain their own copies of booking data
- Manual state sync via `fetchBooking()` callback

**Impact:**
- Fixing one state update can desync others
- Adding new state can create new sync issues
- Child components can show stale data

**Evidence:**
```typescript
const [booking, setBooking] = useState<Booking | null>(null);
const [isFallbackMode, setIsFallbackMode] = useState(false);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// ... 9 more useState hooks
// All need to stay in sync, but no coordination mechanism
```

---

### 7. **Type Safety Illusion (Low-Medium Risk)**
**Location:** Booking interface vs actual data

**Problem:**
- TypeScript interface suggests type safety
- Runtime data doesn't match interface (sanitization proves this)
- `any` types used extensively in sanitization
- Type assertions bypass type checking
- Interface doesn't reflect API's actual return shape

**Impact:**
- TypeScript doesn't catch real bugs
- Refactoring feels safe but breaks at runtime
- New developers trust types and get surprised

**Evidence:**
```typescript
// Interface says: agreedFee: number
// Reality: Can be {fee: 100} object
// Sanitization fixes it, but TypeScript doesn't know
```

---

## Dependency Map: File A ↔ File B

### `app/admin/bookings/[id]/page.tsx` ↔ `app/api/admin/bookings/[id]/route.ts`

**Current Flow:**
```
Component → fetch() → API Route → Prisma → Database
                ↓
         JSON Response (Prisma shape)
                ↓
         Component Sanitization (100+ lines)
                ↓
         setBooking(sanitizedData)
                ↓
         15+ Child Components re-render
```

**Conflicts:**
1. **Data Shape Mismatch:**
   - API returns: `staffAssignments[].staff` (full FreelanceCrew object)
   - Component expects: `staffAssignments[].staff` (sanitized subset)
   - Fix: API change breaks component, component change breaks API

2. **Type Mismatch:**
   - API returns: `feeBreakdown` as JSON string or object
   - Component expects: `Array<FeeLineItem>`
   - Fix: Sanitization in component masks the real problem

3. **Fallback Mode:**
   - API fallback returns minimal data shape
   - Component must handle both shapes
   - Fix: Adding fields to fallback breaks component expectations

4. **Update Propagation:**
   - Component updates via PATCH → API
   - Component then refetches entire booking
   - No way to know what changed
   - Fix: Optimistic update breaks, full refetch is slow

---

### `page.tsx` ↔ Child Components (CrewAssignments, FlexibleOperatorSidebar, TeamAssignment)

**Current Flow:**
```
Parent Component (page.tsx)
    ↓ (passes booking data)
Child Component (e.g., CrewAssignments)
    ↓ (user action: assign staff)
API Call → Database Update
    ↓ (calls onUpdate callback)
Parent Component → fetchBooking() → Full Refetch
    ↓ (new booking data)
All Child Components Re-render
```

**Conflicts:**
1. **Update Cascade:**
   - One child updates → parent refetches → all children re-render
   - Fix: Optimizing one child breaks others

2. **Data Ownership:**
   - Parent owns booking state
   - Children receive props but also maintain local state
   - Fix: Child state can desync from parent

3. **Callback Dependency:**
   - Children depend on `fetchBooking` function
   - Function recreated on every render (not memoized)
   - Fix: Memoizing breaks, not memoizing causes re-renders

---

## 3 Low-Risk Architectural Changes

### Change 1: Move Data Sanitization to API Layer (Low Risk, High Impact)

**Current:** Sanitization in React component (100+ lines)

**Proposed:** Create a data transformation layer in the API route

**Implementation:**
1. Create `lib/transformers/booking-transformer.ts`
2. Move all sanitization logic there
3. API route calls transformer before returning
4. Component receives clean, consistent data

**Benefits:**
- Single source of truth for data shape
- Type safety at API boundary
- Component becomes simpler
- Fixes apply to all consumers

**Risk:** Low - Can be done incrementally, test API response shape

**Files to Change:**
- `app/api/admin/bookings/[id]/route.ts` - Add transformer call
- `lib/transformers/booking-transformer.ts` - New file
- `app/admin/bookings/[id]/page.tsx` - Remove sanitization

---

### Change 2: Implement Request Deduplication with SWR or React Query (Low Risk, Medium Impact)

**Current:** Manual fetch with aggressive cache-busting

**Proposed:** Use SWR (already in codebase) or React Query for data fetching

**Implementation:**
1. Replace `fetchBooking()` with `useSWR()` hook
2. SWR handles: caching, deduplication, revalidation
3. Child components use `mutate()` for optimistic updates
4. Remove manual cache-busting

**Benefits:**
- Automatic request deduplication
- Built-in caching with revalidation
- Optimistic updates supported
- Less code, fewer bugs

**Risk:** Low - SWR is already used in 90-day-command page, proven pattern

**Files to Change:**
- `app/admin/bookings/[id]/page.tsx` - Replace fetchBooking with useSWR
- Child components - Use mutate() instead of onUpdate callback

---

### Change 3: Create Update Event System (Low Risk, Medium Impact)

**Current:** Child components call `fetchBooking()` directly

**Proposed:** Event-based update system with granular updates

**Implementation:**
1. Create `lib/hooks/useBookingUpdates.ts`
2. Child components emit update events: `{type: 'staff_assigned', data: {...}}`
3. Hook handles: optimistic updates, API calls, error handling
4. Parent subscribes to updates, updates only affected parts

**Benefits:**
- Decouples child components from parent
- Granular updates (only affected parts re-render)
- Easier to add new update types
- Better error handling

**Risk:** Low - Can be added alongside existing system, gradual migration

**Files to Change:**
- `lib/hooks/useBookingUpdates.ts` - New file
- `app/admin/bookings/[id]/page.tsx` - Use hook
- Child components - Emit events instead of callbacks

---

## Recommended Implementation Order

1. **Week 1:** Move sanitization to API layer (Change 1)
   - Highest impact, lowest risk
   - Fixes root cause of data shape issues

2. **Week 2:** Add SWR for data fetching (Change 2)
   - Reduces fetch complexity
   - Fixes caching and deduplication issues

3. **Week 3:** Implement update event system (Change 3)
   - Decouples components
   - Enables granular updates

---

## Success Metrics

After implementing these changes:
- ✅ No data sanitization in components
- ✅ Single source of truth for booking data
- ✅ Request deduplication working
- ✅ Child components decoupled from parent
- ✅ Type safety at API boundary
- ✅ Fewer re-renders (only affected components)
- ✅ Easier to add new features without breaking existing ones
