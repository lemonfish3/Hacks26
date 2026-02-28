/**
 * Home Page Sections - Component Architecture
 *
 * These components make up the redesigned home page based on the Cloudy design system.
 * Each component is self-contained and uses the unified color theme from `/lib/theme.ts`
 *
 * Component Breakdown:
 * -------------------
 *
 * 1. Navigation.tsx
 *    - Fixed header with logo, navigation links, and CTA button
 *    - Smooth scrolling to anchor sections
 *    - Responsive design (hidden nav on mobile)
 *
 * 2. HeroSection.tsx
 *    - Full-screen welcome section with animated cloud shapes
 *    - Floating avatars animation
 *    - Calls-to-action for exploration and signup
 *
 * 3. HowItWorks.tsx
 *    - 3-step process explanation
 *    - Cards with icons, titles, and descriptions
 *    - Staggered animation on scroll
 *
 * 4. RoomTypes.tsx
 *    - Showcases Private vs Public room types
 *    - Feature lists for each room type
 *    - Gradient backgrounds and decorative emojis
 *
 * 5. AvatarPreview.tsx
 *    - Interactive avatar builder
 *    - Animal selector, color picker, focus area selection
 *    - Live preview of avatar customization
 *
 * 6. Footer.tsx
 *    - Simple footer with logo and tagline
 *
 * Color Theme:
 * -----------
 * All colors are imported from `/lib/theme.ts` including:
 * - cloudyColors: Primary color palette
 * - avatarGradients: Avatar styling gradients
 *
 * Usage in Index.tsx:
 * ==================
 * All components are imported and rendered in sequence within the Index page,
 * with anchors for smooth scrolling between sections.
 */

export * from "./Navigation";
export * from "./HeroSection";
export * from "./HowItWorks";
export * from "./RoomTypes";
export * from "./AvatarPreview";
export * from "./Footer";
