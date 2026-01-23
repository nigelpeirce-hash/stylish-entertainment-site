# 🎵 Guest Request Facility - Complete Implementation

## ✅ All Features Implemented

### 1. Public Route - `/guest/music/[token]`
**Status**: ✅ Complete  
**Location**: `app/guest/music/[token]/page.tsx`

**Features**:
- ✅ Simple, elegant design with search bar
- ✅ "Add to the Party" button
- ✅ Optional guest name field (can submit anonymously)
- ✅ 3 submission limit per booking
- ✅ Shows existing submissions
- ✅ Real-time validation and feedback

**Design**:
- Premium gradient background
- Gold-accented card with Music icon
- Shows booking name and venue
- Submission counter (X of 3 requests)
- Success/error messages

---

### 2. Data Structure
**Status**: ✅ Complete  
**Model**: `GuestRequest` in `prisma/schema.prisma`

**Fields**:
- `id` - Unique identifier
- `bookingId` - Links to Booking
- `songTitle` - Required
- `artist` - Optional
- `guestName` - Optional (anonymous submissions allowed)
- `status` - 'pending', 'approved', 'moved_to_official'
- `createdAt`, `updatedAt` - Timestamps

**Relation**: `Booking.guestRequests GuestRequest[]`

---

### 3. API Routes
**Status**: ✅ Complete

**Routes Created**:
- `GET /api/guest/music/[token]` - Get booking info and existing requests
- `POST /api/guest/music/[token]` - Submit new request (enforces 3 limit)
- `POST /api/client/bookings/[id]/guest-requests/[requestId]/move-to-official` - Move to official list

**Security**:
- Token validation via `booking.portalToken`
- Client route requires session or token
- 3 request limit enforced server-side

---

### 4. Client Portal - Guest Request Card
**Status**: ✅ Complete  
**Location**: `components/client/PortalView.tsx`

**Features**:
- ✅ Displays all guest requests (pending, approved, moved_to_official)
- ✅ Shows song title, artist, and guest name (if provided)
- ✅ "Move to Official List" button for pending requests
- ✅ Badge shows "Added to List" for moved requests
- ✅ Automatically adds to `booking.musicRequests` field
- ✅ Real-time updates after moving to official list

**UI**:
- Music icon header
- Amber-accented card
- Clean list layout
- Guest name shown in smaller text below song

---

### 5. Artist Dispatch Integration
**Status**: ✅ Complete  
**Location**: `app/api/admin/bookings/[id]/dispatch/route.ts`

**Implementation**:
- Guest requests automatically included in dispatch email
- Section: "🎵 Guest Song Requests"
- Shows song title, artist, guest name
- Indicates if moved to official list
- Gold-accented section header

**Example Output**:
```
🎵 Guest Song Requests
Songs requested by your guests. These are crowd favorites to consider.

Dancing Queen by ABBA — Sarah
Sweet Caroline by Neil Diamond — Tim
Bohemian Rhapsody — Anonymous
```

---

## 🎯 User Flow

### Guest Flow:
1. Guest receives magic link: `/guest/music/[token]`
2. Opens page → sees booking name and venue
3. Enters song title (required), artist (optional), name (optional)
4. Clicks "Add to the Party"
5. Can submit up to 3 requests
6. Sees their submissions listed

### Client Flow:
1. Client opens portal
2. Sees "Guest Song Requests" card (if requests exist)
3. Reviews songs with guest names
4. Clicks "Move to Official List" for songs they want
5. Songs automatically added to `musicRequests` field
6. DJ sees them in dispatch email

### DJ Flow:
1. Receives Artist Dispatch email
2. Sees "🎵 Guest Song Requests" section
3. Knows what the crowd wants
4. Can prioritize guest favorites

---

## 📋 Verification Checklist

| Test | Expected Result |
|------|----------------|
| **Public Page** | Visit `/guest/music/[token]` → Shows booking name, search form |
| **Submit Request** | Enter song → Click "Add to the Party" → Appears in list |
| **3 Limit** | Submit 3 requests → 4th submission blocked |
| **Anonymous** | Submit without name → Shows "Anonymous" |
| **Client View** | Open portal → Guest requests card appears |
| **Move to Official** | Click "Move to Official List" → Badge changes, added to musicRequests |
| **Dispatch Email** | Send dispatch → Email includes "🎵 Guest Song Requests" section |

---

## 🔗 Magic Link Generation

**How to Generate Guest Links**:
- Use existing `booking.portalToken` (same as client portal magic link)
- Share URL: `https://stylishentertainment.co.uk/guest/music/[portalToken]`
- Guests can submit without login
- Each booking has one token (shared for client portal and guest requests)

**Alternative**: Create separate `guestToken` field if you want different links for guests vs. clients.

---

## 📝 Notes

- **Low Risk**: Separate `GuestRequest` table - won't break core booking logic
- **Privacy**: Guest name is optional - allows anonymous submissions
- **Limit**: 3 requests per booking (enforced server-side)
- **Status Flow**: `pending` → `moved_to_official` (when client approves)
- **Integration**: Moved requests automatically append to `booking.musicRequests`

---

**Ready for Production! 🎉**
