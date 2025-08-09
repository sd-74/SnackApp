export interface UserProfile {
	id: string;
	email: string;
	displayName: string | null;
	avatarUrl: string | null;
	onboardingCompleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Snack {
	id: number;
	name: string;
	brand: string | null;
	imageUrl: string;
	flavors: string[];
	attributes: string[];
	tags: string[];
	description: string | null;
	createdAt: string;
}

export interface UserSnackInteraction {
	id: number;
	userId: string;
	snackId: number;
	action: 'like' | 'dislike' | 'skip';
	rating: number | null; // 1-5 stars, null if skipped
	notes: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface SnackWithInteraction extends Snack {
	userInteraction?: UserSnackInteraction;
}	

export interface UserPreferences {
	liked_snacks: number[]; // Array of snack IDs
	liked_flavors: string[];
	disliked_flavors: string[];
	preferred_attributes: string[];
	average_rating: number;
	total_interactions: number;

}

export const VALID_ACTIONS = ['like', 'dislike', 'skip'] as const;
export const RATING_RANGE = [1, 2, 3, 4, 5] as const;

export const FLAVORS = [
	'chocolate', 'vanilla', 'strawberry', 'caramel', 'peanut-butter',
	'barbecue', 'cheese', 'sour-cream', 'jalapeno', 'spicy', 'hot',
	'plain', 'salted', 'sea-salt', 'honey', 'sweet', 'salty', 
	'sour', 'tangy', 'smoky', 'garlic', 'onion', 'nacho'
  ] as const;
  
  export const ATTRIBUTES = [
	'potato-chip', 'tortilla-chip', 'pretzel', 'popcorn', 'nuts',
	'candy', 'chocolate-bar', 'gummy', 'cookie', 'cracker',
	'granola-bar', 'trail-mix', 'jerky', 'fruit-snack', 'sandwich'
  ] as const;
  
  export const TAGS = [
	'healthy', 'organic', 'gluten-free', 'vegan', 'low-sodium',
	'baked', 'fried', 'crunchy', 'chewy', 'soft', 'spicy-hot',
	'family-size', 'individual', 'bulk', 'premium', 'popular'
  ] as const;