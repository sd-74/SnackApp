# Database Schema Documentation

## Overview
This database supports a swipe-based snack recommendation app where users can like/dislike snacks and optionally provide ratings.

## Tables

### `user_profiles`
Extends Supabase's built-in auth.users table with app-specific user data.
- `id`: UUID, references auth.users.id
- `display_name`: User's chosen display name
- `avatar_url`: Profile picture URL
- `onboarding_completed`: Whether user has completed initial setup

### `snacks`
Contains all available snacks that users can rate.
- `name`: Snack name (e.g., "Doritos Nacho Cheese")
- `brand`: Manufacturer (e.g., "Frito-Lay")
- `image_url`: Product image for display in app
- `flavors`: Array of flavor tags (e.g., ["cheese", "spicy"])
- `attributes`: Product type tags (e.g., ["tortilla-chip", "crunchy"])
- `tags`: Additional properties (e.g., ["healthy", "popular"])

### `user_snack_interactions`
Tracks all user interactions with snacks.
- `action`: 'like', 'dislike', or 'skip'
- `rating`: Optional 1-5 star rating (only if liked/disliked)
- `notes`: Optional user comments
- `UNIQUE(user_id, snack_id)`: Prevents duplicate interactions

## Usage Patterns

### Recording User Interactions
```sql
-- User swipes right (likes) a snack
INSERT INTO user_snack_interactions (user_id, snack_id, action)
VALUES ('user-uuid', 123, 'like');

-- User provides additional rating
UPDATE user_snack_interactions 
SET rating = 4, notes = 'Pretty good but too salty'
WHERE user_id = 'user-uuid' AND snack_id = 123;
```

### Getting Recommendations
```sql
-- Get snacks user hasn't interacted with yet
SELECT s.* FROM snacks s
LEFT JOIN user_snack_interactions usi ON (s.id = usi.snack_id AND usi.user_id = 'user-uuid')
WHERE usi.id IS NULL
ORDER BY RANDOM()
LIMIT 10;
```

### User Analytics
```sql
-- Get user's flavor preferences based on ratings
SELECT 
  UNNEST(s.flavors) as flavor,
  AVG(usi.rating) as avg_rating,
  COUNT(*) as interaction_count
FROM user_snack_interactions usi
JOIN snacks s ON usi.snack_id = s.id
WHERE usi.user_id = 'user-uuid' AND usi.rating IS NOT NULL
GROUP BY flavor
ORDER BY avg_rating DESC;
```

## Migration Strategy
- Use numbered migration files in `/database/migrations/`
- Test all changes in development environment first
- Always backup before applying to production
- Document breaking changes in this README

## Development Setup
1. Run `schema.sql` in Supabase SQL Editor
2. Verify Row Level Security policies are active
3. Test with sample data from `/database/seed-data/`
4. Update TypeScript types in `lib/database-types.ts` after schema changes