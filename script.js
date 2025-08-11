class ScrollAnimationController {
    constructor() {
        // DOM elements
        this.staticImage = document.getElementById('staticImage');
        this.animatedGif = document.getElementById('animatedGif');
        this.finalImage = document.getElementById('finalImage');
        this.imageContainer = document.getElementById('imageContainer');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.scrollOverlay = document.getElementById('scrollOverlay');
        this.okapIcon = document.getElementById('okapIcon');
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.body = document.body;
        
        // State management
        this.hasStartedScrolling = false;
        this.isAnimationPlaying = false;
        this.animationComplete = false;
        this.gifDuration = 3000; // Default 3 seconds, will be updated
        this.scrollThreshold = 50; // Minimum scroll distance to trigger
        
        // Icon interaction state
        this.iconClickCount = 0;
        this.isIconFallen = false;
        this.isMusicPlaying = false;
        
        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        this.init();
    }
    
    init() {
        // Preload the GIF to get its duration
        this.preloadGif();
        
        // Add scroll event listeners
        this.addEventListeners();
        
        // Add icon event listener
        this.addIconEventListener();
        
        // Start music immediately when page loads
        this.startMusic();
        
        // Ensure initial state is correct
        this.resetToInitialState();
    }
    
    preloadGif() {
        // Create a canvas to analyze the GIF
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Preload GIF in hidden state to calculate duration
        const preloadGif = new Image();
        preloadGif.src = 'animation.gif';
        preloadGif.className = 'preload';
        document.body.appendChild(preloadGif);
        
        preloadGif.onload = () => {
            // Try to estimate GIF duration (fallback approach)
            this.estimateGifDuration();
            document.body.removeChild(preloadGif);
        };
        
        preloadGif.onerror = () => {
            console.warn('Could not preload GIF, using default duration');
            document.body.removeChild(preloadGif);
        };
    }
    
    estimateGifDuration() {
        // Since we can't directly get GIF duration in vanilla JS,
        // we'll use a reasonable default and allow manual override
        // In a real implementation, you might want to use a library
        // or encode the duration in the filename or data attribute
        
        // For now, using a 3-second default
        // You can adjust this based on your actual GIF duration
        this.gifDuration = 3000;
        
        // Alternative: Try to detect from file size or use common durations
        // This is a simplified approach for the demo
    }
    
    addEventListeners() {
        // Scroll detection
        window.addEventListener('scroll', this.handleScroll, { passive: false });
        
        // Prevent scrolling during animation
        window.addEventListener('wheel', this.handleWheel, { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        window.addEventListener('keydown', this.handleKeydown, { passive: false });
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    removeScrollBlockingListeners() {
        // Remove the scroll-blocking listeners after animation completes
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('wheel', this.handleWheel);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('keydown', this.handleKeydown);
    }
    
    addIconEventListener() {
        if (this.okapIcon) {
            this.okapIcon.addEventListener('click', this.handleIconClick.bind(this));
        }
    }
    
    handleIconClick() {
        if (this.isIconFallen) {
            return; // Don't respond to clicks if already fallen
        }
        
        this.iconClickCount++;
        console.log(`Icon clicked ${this.iconClickCount} times`);
        
        // Add shake animation
        this.okapIcon.classList.remove('shake');
        // Force reflow to restart animation
        void this.okapIcon.offsetWidth;
        this.okapIcon.classList.add('shake');
        
        // Remove shake class after animation
        setTimeout(() => {
            this.okapIcon.classList.remove('shake');
        }, 500);
        
        if (this.iconClickCount >= 3) {
            this.makeIconFall();
        }
    }
    
    makeIconFall() {
        console.log('Making icon fall with echo effect...');
        this.isIconFallen = true;
        
        // Add echo effect to music before stopping
        this.addEchoEffect();
        
        // Add fall animation
        this.okapIcon.classList.add('fall');
        
        // Stop music after echo effect (1.5 seconds)
        setTimeout(() => {
            this.stopMusic();
            console.log('Music stopped after echo effect');
        }, 1500);
        
        // Hide icon completely after animation
        setTimeout(() => {
            this.okapIcon.style.display = 'none';
        }, 2000);
    }
    
    startMusic() {
        if (this.backgroundMusic && !this.isMusicPlaying && !this.isIconFallen) {
            this.backgroundMusic.volume = 1.0; // Ensure full volume
            this.backgroundMusic.play().then(() => {
                this.isMusicPlaying = true;
                console.log('Background music started');
            }).catch(error => {
                console.log('Could not start music (user interaction may be required):', error.message);
                // Note: Modern browsers require user interaction before playing audio
                // Try again on first user interaction
                document.addEventListener('click', () => {
                    if (!this.isMusicPlaying && !this.isIconFallen) {
                        this.startMusic();
                    }
                }, { once: true });
            });
        }
    }
    
    addEchoEffect() {
        if (this.backgroundMusic && this.isMusicPlaying) {
            // Create echo effect by gradually reducing volume
            const fadeOutInterval = setInterval(() => {
                if (this.backgroundMusic.volume > 0.1) {
                    this.backgroundMusic.volume -= 0.1;
                } else {
                    clearInterval(fadeOutInterval);
                }
            }, 100);
            
            console.log('Echo effect applied to music');
        }
    }
    
    stopMusic() {
        if (this.backgroundMusic && this.isMusicPlaying) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.volume = 1.0; // Reset volume for next time
            this.isMusicPlaying = false;
            console.log('Background music stopped');
        }
    }
    
    handleScroll(event) {
        if (this.isAnimationPlaying) {
            event.preventDefault();
            return false;
        }
        
        // Allow normal scrolling after animation is complete
        if (this.animationComplete) {
            return true;
        }
        
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (!this.hasStartedScrolling && scrollY > this.scrollThreshold) {
            this.triggerAnimation();
        }
    }
    
    handleWheel(event) {
        if (this.isAnimationPlaying) {
            event.preventDefault();
            return false;
        }
        
        // Allow normal scrolling after animation is complete
        if (this.animationComplete) {
            return true;
        }
        
        if (!this.hasStartedScrolling && Math.abs(event.deltaY) > 10) {
            this.triggerAnimation();
        }
    }
    
    handleTouchMove(event) {
        if (this.isAnimationPlaying) {
            event.preventDefault();
            return false;
        }
        
        // Allow normal scrolling after animation is complete
        if (this.animationComplete) {
            return true;
        }
    }
    
    handleKeydown(event) {
        if (this.isAnimationPlaying) {
            // Prevent arrow keys, space, page up/down during animation
            const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
            if (scrollKeys.includes(event.keyCode)) {
                event.preventDefault();
                return false;
            }
        }
        
        // Trigger animation on arrow keys or space
        if (!this.hasStartedScrolling && [32, 38, 40].includes(event.keyCode)) {
            this.triggerAnimation();
        }
    }
    
    handleResize() {
        // Ensure images maintain proper aspect ratio on resize
        this.updateImageDimensions();
    }
    
    triggerAnimation() {
        if (this.hasStartedScrolling || this.isAnimationPlaying) {
            return;
        }
        
        console.log('Triggering animation...');
        
        this.hasStartedScrolling = true;
        this.isAnimationPlaying = true;
        
        // Hide scroll indicator
        this.scrollIndicator.classList.add('fade-out');
        setTimeout(() => {
            this.scrollIndicator.style.display = 'none';
        }, 300);
        
        // Prevent scrolling
        this.disableScrolling();
        
        // Switch from static image to GIF
        this.switchToGif();
        
        // Set timer for when GIF completes
        setTimeout(() => {
            this.completeAnimation();
        }, this.gifDuration);
    }
    
    switchToGif() {
        // Show GIF immediately (no fade delay)
        this.animatedGif.classList.remove('hidden');
        
        // Force GIF to restart from beginning and play immediately
        const gifSrc = this.animatedGif.src;
        this.animatedGif.src = '';
        this.animatedGif.src = gifSrc;
        
        // Keep static image visible underneath (don't hide it yet)
        // This ensures smooth transition
    }
    
    completeAnimation() {
        console.log('Animation completed, showing final image and enabling scroll...');
        
        this.isAnimationPlaying = false;
        this.animationComplete = true;
        
        // Show the final image immediately over the GIF
        this.finalImage.classList.remove('hidden');
        
        // Enable scrolling
        this.enableScrolling();
        
        // Remove all scroll-blocking event listeners
        this.removeScrollBlockingListeners();
        
        // Hide the static image and GIF, keep only the final image visible
        this.staticImage.classList.add('hidden');
        this.animatedGif.classList.add('hidden');
        
        // Keep photo1.png visible for 3 seconds, then transition smoothly
        setTimeout(() => {
            console.log('Starting smooth transition from photo1 to main content...');
            
            // Add fade-out transition to image container
            this.imageContainer.style.transition = 'opacity 1s ease-out';
            this.imageContainer.style.opacity = '0';
            
            // After fade completes, hide container and enable scrolling
            setTimeout(() => {
                this.imageContainer.style.display = 'none';
                
                // Reset all scroll restrictions
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                
                console.log('Smooth transition complete, scrolling enabled');
            }, 1000);
            
        }, 3000); // Wait 3 seconds before starting transition
    }
    
    disableScrolling() {
        // Add no-scroll class to body
        this.body.classList.add('no-scroll');
        
        // Show scroll overlay
        this.scrollOverlay.classList.remove('hidden');
        
        // Store current scroll position
        this.scrollPosition = window.pageYOffset;
        
        // Reset scroll to top
        window.scrollTo(0, 0);
    }
    
    enableScrolling() {
        console.log('Enabling scrolling...');
        
        // Remove no-scroll class from body
        this.body.classList.remove('no-scroll');
        
        // Hide scroll overlay
        this.scrollOverlay.classList.add('hidden');
        
        // Clean up any duplicate scroll settings
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
        
        console.log('Scrolling should now be enabled');
    }
    
    updateImageDimensions() {
        // Ensure images cover the full viewport
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        [this.staticImage, this.animatedGif, this.finalImage].forEach(img => {
            img.style.width = `${vw}px`;
            img.style.height = `${vh}px`;
        });
    }
    
    resetToInitialState() {
        // Ensure we start in the correct state
        this.staticImage.classList.remove('hidden');
        this.animatedGif.classList.add('hidden');
        this.finalImage.classList.add('hidden');
        this.scrollOverlay.classList.add('hidden');
        this.body.classList.remove('no-scroll');
        
        // Reset state flags
        this.hasStartedScrolling = false;
        this.isAnimationPlaying = false;
        this.animationComplete = false;
        
        // Reset icon state
        this.iconClickCount = 0;
        this.isIconFallen = false;
        if (this.okapIcon) {
            this.okapIcon.style.display = 'block';
            this.okapIcon.classList.remove('shake', 'fall');
        }
        
        // Restore image container
        this.imageContainer.style.display = 'block';
        this.imageContainer.style.opacity = '1';
        this.imageContainer.style.transition = 'none';
        this.imageContainer.classList.remove('scroll-enabled');
        document.body.style.paddingTop = '';
        
        // Update image dimensions
        this.updateImageDimensions();
        
        // Reset scroll position
        window.scrollTo(0, 0);
    }
    
    // Public method to manually set GIF duration
    setGifDuration(duration) {
        this.gifDuration = duration;
        console.log(`GIF duration set to ${duration}ms`);
    }
    
    // Public method to reset the entire animation
    reset() {
        this.hasStartedScrolling = false;
        this.isAnimationPlaying = false;
        this.animationComplete = false;
        
        // Stop music and reset icon
        this.stopMusic();
        this.iconClickCount = 0;
        this.isIconFallen = false;
        if (this.okapIcon) {
            this.okapIcon.style.display = 'block';
            this.okapIcon.classList.remove('shake', 'fall');
        }
        
        this.resetToInitialState();
        this.scrollIndicator.style.display = 'block';
        this.scrollIndicator.classList.remove('fade-out');
        this.imageContainer.style.display = 'block';
        this.imageContainer.style.transform = 'translateY(0)';
        this.imageContainer.style.transition = 'none';
        this.finalImage.classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const controller = new ScrollAnimationController();
    
    // Make controller globally available for debugging
    window.scrollController = controller;
    
    // Optional: Allow manual GIF duration setting via console
    // Example: scrollController.setGifDuration(5000) for 5-second GIF
    
    console.log('Scroll Animation Controller initialized');
    console.log('Use scrollController.reset() to reset animation');
    console.log('Use scrollController.setGifDuration(ms) to set GIF duration');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any ongoing animations when tab is not visible
        console.log('Page hidden, pausing animations');
    } else {
        // Resume when tab becomes visible again
        console.log('Page visible, resuming animations');
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (window.scrollController) {
        window.scrollController.reset();
    }
});
