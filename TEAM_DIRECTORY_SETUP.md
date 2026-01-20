# Team Directory Setup Guide

## Overview

The Team Directory module provides a centralized way to manage all DJs, Musicians, and Styling staff. It includes searchable directory, quick edit functionality, and automatic email updates for bookings.

## Features

✅ **Searchable Directory**: Search by name, email, title, skills, or roles  
✅ **Quick Edit**: Slide-out sheet for fast updates without leaving the list  
✅ **Email Validation**: Required email field with proper formatting  
✅ **Technical Skills Tags**: Add custom skills or use common presets  
✅ **Role Management**: Assign multiple roles (DJ, Musician, Lighting, etc.)  
✅ **Auto-Update Bookings**: Email changes automatically reflect in all current and future bookings  
✅ **Luxe UI**: Clean, professional interface matching STYLISH theme

## Database Migration

### Step 1: Run SQL Migration

Run the migration script in Supabase SQL Editor:

```sql
-- File: supabase-staff-management-migration.sql
```

This will:
- Add `professionalTitle` field
- Add `bio` field  
- Add `technicalSkills` array field
- Make `email` required (sets default for existing null values)
- Add index on email for faster lookups

### Step 2: Update Prisma Client

After running the migration:

```bash
npx prisma generate
```

### Step 3: Update Existing Staff

After migration, any staff members with `pending@stylishentertainment.co.uk` need their email updated:

1. Go to `/admin/staff-management`
2. Edit each staff member
3. Update their email address

## Access

The Team Directory is accessible from:
- **Admin Dashboard**: "Staff Management" card in Main Actions
- **Direct URL**: `/admin/staff-management`

## Usage

### Adding a Staff Member

1. Click "Add Staff Member" button
2. Fill in required fields:
   - **Full Name** (required)
   - **Primary Email** (required, validated)
3. Optional fields:
   - Professional Title
   - Phone Number
   - Bio
   - Technical Skills (tags)
   - Roles
4. Click "Save"

### Editing a Staff Member

1. Click the edit icon (pencil) next to any staff member
2. Quick Edit sheet slides out from the right
3. Update any fields
4. Click "Save"

**Important**: When you update a staff member's email:
- A warning appears: "⚠️ Changing email will update all current and future bookings"
- The email is automatically updated in the FreelanceCrew record
- All future dispatches and briefs will use the new email
- No manual updates needed in individual bookings

### Technical Skills

**Adding Skills:**
- Type a skill name and press Enter or click "Add"
- Click common skills from the preset list
- Remove skills by clicking the X on the badge

**Common Skills:**
- Vinyl DJ
- Digital DJ
- Pianist
- Guitarist
- Saxophonist
- Lighting Tech
- Sound Engineer
- Styling Assistant
- Event Coordinator
- Photographer

### Roles

Click role badges to toggle them on/off:
- DJ
- Musician
- Lighting
- Sound
- Styling
- Coordinator

## Email Update Logic

When a staff member's email is updated:

1. **Validation**: System checks if new email already exists
2. **Update**: FreelanceCrew.email is updated
3. **Propagation**: All future queries automatically use the new email because:
   - Dispatch route reads from `staff.staff.email` (relation)
   - Brief system reads from `staffAssignments.staff.email` (relation)
   - All queries fetch email via the FreelanceCrew relation

**No manual booking updates needed** - the relation ensures the latest email is always used.

## Linking to Bookings

The Team Directory is automatically linked to bookings via:

- **staffAssignments** table: References `FreelanceCrew.id`
- When assigning staff to a booking, the system:
  1. Looks up staff by ID
  2. Uses their current email from FreelanceCrew
  3. Creates BookingStaffAssignment record

## Validation Rules

- **Name**: Minimum 2 characters
- **Email**: 
  - Required
  - Must be valid email format
  - Must be unique (no duplicates)
- **Phone**: Optional, no validation
- **Bio**: Optional, text field
- **Technical Skills**: Array of strings
- **Roles**: Array of strings

## Search Functionality

Search works across:
- Full Name
- Email address
- Professional Title
- Technical Skills
- Roles

Search is case-insensitive and matches partial strings.

## UI Features

- **Table View**: Clean, scannable list
- **Quick Edit Sheet**: Slide-out panel for fast edits
- **Color-Coded Badges**: 
  - Gold for Technical Skills
  - Blue for Roles
- **Status Indicators**: Shows "Inactive" for deactivated staff
- **Responsive**: Works on mobile and desktop

## Integration with Brief System

The Monday Morning Brief system uses staff emails from FreelanceCrew:

- Reads `staffAssignments.staff.email` for Blue Actions
- Email updates in Team Directory automatically reflect in next week's brief
- No manual synchronization needed

## Troubleshooting

### "Email already exists" Error

- Check if another staff member has this email
- Each staff member must have a unique email

### "Cannot delete staff member with active bookings"

- Staff with future bookings cannot be deleted
- Set `isActive: false` instead to hide them
- Or cancel/complete their bookings first

### Email Not Updating in Bookings

- Email updates are immediate for future bookings
- Past bookings keep the email that was used at dispatch time
- This is by design for historical accuracy

## Next Steps

1. ✅ Run database migration
2. ✅ Update Prisma client
3. ✅ Update existing staff emails
4. ✅ Start using Team Directory for all staff management

---

**Last Updated**: 2026-01-20  
**Status**: ✅ Ready for Use
