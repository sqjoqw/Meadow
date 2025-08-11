# Interactive Scroll Animation

## Overview

This is a web application that creates an interactive scroll-triggered animation experience. The application displays a static image that transforms into an animated GIF when the user begins scrolling, creating an engaging entry point to the main content. The project uses vanilla HTML, CSS, and JavaScript to create a smooth, responsive animation system that works across different devices and input methods.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without frameworks
- **Object-Oriented JavaScript**: Uses ES6 class-based architecture with the `ScrollAnimationController` class managing all interactions
- **Event-Driven Design**: Handles multiple input types (scroll, wheel, touch, keyboard) through a unified event system
- **State Management**: Simple boolean flags track animation states (`hasStartedScrolling`, `isAnimationPlaying`)

### Animation System
- **Image Transition Logic**: Three-stage sequence (photo.png → animation.gif → photo1.png)
- **Scroll Prevention**: Implements overlay system to prevent scrolling during animation playback
- **Duration Estimation**: 3-second GIF duration with 3-second photo1.png display
- **Smooth Transitions**: Fade effects between stages and to final content
- **Icon Interactions**: Shake animation on click, falling animation after 3 clicks
- **Audio Effects**: Echo/fade-out effect applied when icon falls

### User Interface Components
- **Full-Screen Image Display**: Fixed positioning with viewport units for complete screen coverage
- **Scroll Indicator**: Visual cue to guide user interaction
- **Main Content Area**: Hidden initially, revealed after animation completion with fade-in effect
- **Scroll Overlay**: Prevents user interaction during animation sequences
- **Interactive Icon**: Fixed position okap.png icon in upper-right corner with click interactions
- **Background Music System**: Looping audio that starts on page load and responds to icon interactions

### Performance Optimizations
- **Image Preloading**: Loads GIF in advance to prevent loading delays during interaction
- **CSS Transitions**: Hardware-accelerated opacity transitions for smooth visual effects
- **Event Debouncing**: Scroll threshold prevents accidental triggers from minor movements

## External Dependencies

### Media Assets
- **Static Image**: `photo.png` - Initial display image
- **Animated GIF**: `animation.gif` - Scroll-triggered animation
- **Final Image**: `photo1.png` - Image shown after GIF completes
- **Interactive Icon**: `okap.png` - Clickable icon in upper-right corner
- **Background Music**: `ring-ring-ring.mp3` or `.wav` - Looping audio track

### Browser APIs
- **DOM Manipulation**: Standard document methods for element control
- **Event Handling**: Native scroll, wheel, touch, and keyboard event listeners
- **Canvas API**: Used for GIF analysis and duration estimation
- **Viewport APIs**: CSS viewport units and JavaScript window properties for responsive behavior

### Font System
- **System Font Stack**: Uses native operating system fonts for optimal performance and consistency