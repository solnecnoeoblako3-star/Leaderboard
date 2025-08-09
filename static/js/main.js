// Minecraft Bedwars Leaderboard - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Bedwars Leaderboard initialized successfully!');

    // Initialize all components
    initializeCursor();
    initializeRippleEffect();
    initializeAnimations();
    initializeStatCalculators();
    initializeFormValidation();
    initializeMobileOptimizations();
    initializePerformanceMetrics();
    initializeAccessibility();
    initializeAdvancedFeatures();
    initializeGradientSystem();

    // Apply current theme if set
    applyCurrentTheme();

    // Initialize i18n when DOM is loaded
    if (typeof window.bedwarsI18n === 'undefined') {
        window.bedwarsI18n = new I18n();
    }

    // Ensure language switching works
    setTimeout(() => {
        if (window.bedwarsI18n && typeof window.bedwarsI18n.createLanguageSwitcher === 'function') {
            window.bedwarsI18n.createLanguageSwitcher();
        }
    }, 100);
});

// Enhanced Gradient System
function initializeGradientSystem() {
    console.log('🎨 Initializing gradient system...');

    // Load all player gradients on leaderboard
    loadLeaderboardGradients();

    // Initialize gradient inventory system
    initializeGradientInventory();

    // Fix any broken gradients
    fixBrokenGradients();
}

function loadLeaderboardGradients() {
    const playerRows = document.querySelectorAll('.player-row');
    playerRows.forEach(row => {
        const playerId = row.getAttribute('data-player-id');
        if (playerId) {
            loadPlayerGradients(parseInt(playerId));
        }
    });
}

function loadPlayerGradients(playerId) {
    fetch(`/api/player/${playerId}/gradients`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.gradients) {
                applyPlayerGradients(playerId, data.gradients);
            }
        })
        .catch(error => {
            console.error('Error loading player gradients:', error);
        });
}

function applyPlayerGradients(playerId, gradients) {
    Object.entries(gradients).forEach(([elementType, gradientData]) => {
        if (gradientData && gradientData.css_gradient) {
            applyGradientToElement(playerId, elementType, gradientData);
        }
    });
}

function applyGradientToElement(playerId, elementType, gradientData) {
    const elements = document.querySelectorAll(`[data-player-id="${playerId}"]`);

    elements.forEach(element => {
        const shouldApply = 
            (elementType === 'nickname' && element.classList.contains('player-nickname')) ||
            (elementType === 'role' && element.classList.contains('player-role')) ||
            (elementType === 'stats' && element.classList.contains('player-stat')) ||
            (elementType === element.getAttribute('data-stat'));

        if (shouldApply) {
            applyGradientStyle(element, gradientData);
        }
    });
}

function applyGradientStyle(element, gradientData) {
    if (!element || !gradientData.css_gradient) return;

    // Remove any existing gradient classes
    element.classList.remove('gradient-text', 'gradient-animated');

    // Apply gradient
    element.style.background = gradientData.css_gradient;
    element.style.backgroundClip = 'text';
    element.style.webkitBackgroundClip = 'text';
    element.style.webkitTextFillColor = 'transparent';
    element.style.backgroundSize = gradientData.is_animated ? '200% 200%' : '100% 100%';

    // Add animation if needed
    if (gradientData.is_animated) {
        element.style.animation = 'gradientShift 3s ease-in-out infinite';
        element.classList.add('gradient-animated');
    }

    // Add fallback color for unsupported browsers
    element.setAttribute('data-fallback-color', gradientData.fallback_color || '#ffc107');
}

function initializeGradientInventory() {
    // Handle gradient application from inventory
    document.addEventListener('click', function(e) {
        if (e.target.matches('.apply-gradient-btn')) {
            const gradientId = e.target.getAttribute('data-gradient-id');
            const elementType = e.target.getAttribute('data-element-type');
            applyGradientFromInventory(gradientId, elementType);
        }
    });
}

function applyGradientFromInventory(gradientId, elementType) {
    fetch('/api/apply-gradient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gradient_id: gradientId,
            element_type: elementType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload gradients
            const playerId = data.player_id;
            loadPlayerGradients(playerId);
            showSuccessMessage('Градиент применён успешно!');
        } else {
            showErrorMessage(data.error || 'Ошибка применения градиента');
        }
    })
    .catch(error => {
        console.error('Error applying gradient:', error);
        showErrorMessage('Произошла ошибка');
    });
}

function fixBrokenGradients() {
    // Check if browser supports background-clip: text
    const testElement = document.createElement('div');
    testElement.style.backgroundClip = 'text';
    const supportsBackgroundClip = testElement.style.backgroundClip === 'text';

    if (!supportsBackgroundClip) {
        // Apply fallback for unsupported browsers
        document.querySelectorAll('[data-fallback-color]').forEach(element => {
            const fallbackColor = element.getAttribute('data-fallback-color');
            element.style.background = 'none';
            element.style.webkitTextFillColor = 'initial';
            element.style.color = fallbackColor;
        });
    }
}

// Cursor System
function initializeCursor() {
    // Custom cursor effects for enhanced experience
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor effects on interactive elements
    document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('button, a, .clickable')) {
            cursor.classList.add('cursor-hover');
        }
    }, true);

    document.addEventListener('mouseleave', (e) => {
        if (e.target.matches('button, a, .clickable')) {
            cursor.classList.remove('cursor-hover');
        }
    }, true);
}

// Ripple Effect System
function initializeRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('button, .btn, .card, .ripple')) {
            createRipple(e);
        }
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced Animations
function initializeAnimations() {
    // Animate cards on scroll
    const observeElements = document.querySelectorAll('.card, .stat-box, .player-row');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    });

    observeElements.forEach(el => observer.observe(el));

    // Animate stat counters
    animateStatCounters();
}

function animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-value');

    statNumbers.forEach((stat, index) => {
        const value = parseInt(stat.textContent.replace(/,/g, ''));
        if (!isNaN(value) && value > 0) {
            setTimeout(() => {
                animateNumber(stat, 0, value, 1500);
            }, index * 100);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Statistics Calculators
function initializeStatCalculators() {
    // Real-time K/D ratio calculator
    const killInputs = document.querySelectorAll('input[name="kills"]');
    const deathInputs = document.querySelectorAll('input[name="deaths"]');

    function updateKDRatio() {
        const kills = parseInt(killInputs[0]?.value || 0);
        const deaths = parseInt(deathInputs[0]?.value || 0);
        const ratio = deaths > 0 ? (kills / deaths).toFixed(2) : kills;

        const kdDisplay = document.querySelector('.kd-preview');
        if (kdDisplay) {
            kdDisplay.textContent = ratio;
            kdDisplay.className = `kd-preview ${ratio >= 2 ? 'text-success' : ratio >= 1 ? 'text-warning' : 'text-danger'}`;
        }
    }

    killInputs.forEach(input => input.addEventListener('input', updateKDRatio));
    deathInputs.forEach(input => input.addEventListener('input', updateKDRatio));
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
                return false;
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const errors = [];

    // Check required fields
    const required = form.querySelectorAll('[required]');
    required.forEach(input => {
        if (!input.value.trim()) {
            markInputError(input, 'Это поле обязательно');
            isValid = false;
        }
    });

    // Check numeric ranges
    const numbers = form.querySelectorAll('input[type="number"]');
    numbers.forEach(input => {
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);

        if (value < min) {
            markInputError(input, `Минимальное значение: ${min}`);
            isValid = false;
        }

        if (max && value > max) {
            markInputError(input, `Максимальное значение: ${max}`);
            isValid = false;
        }
    });

    // Game logic validation
    const wins = parseInt(form.querySelector('input[name="wins"]')?.value || 0);
    const games = parseInt(form.querySelector('input[name="games_played"]')?.value || 0);

    if (wins > games) {
        showErrorMessage('Количество побед не может превышать количество игр!');
        isValid = false;
    }

    return isValid;
}

function validateInput(input) {
    clearInputError(input);

    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);

    if (input.hasAttribute('required') && !input.value.trim()) {
        markInputError(input, 'Обязательное поле');
        return false;
    }

    if (!isNaN(min) && value < min) {
        markInputError(input, `Мин: ${min}`);
        return false;
    }

    if (!isNaN(max) && value > max) {
        markInputError(input, `Макс: ${max}`);
        return false;
    }

    return true;
}

function markInputError(input, message) {
    input.classList.add('is-invalid');

    let errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearInputError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Mobile Optimizations
function initializeMobileOptimizations() {
    // Touch support for cards
    if ('ontouchstart' in window) {
        document.querySelectorAll('.card, .player-row').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });

            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    // Responsive table handling
    const tables = document.querySelectorAll('.table-responsive');
    tables.forEach(table => {
        if (window.innerWidth < 768) {
            table.classList.add('mobile-scrollable');
        }
    });
}

// Performance Metrics
function initializePerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;

            console.log('🚀 Performance Metrics:', {
                'Load Time': `${loadTime.toFixed(2)}ms`,
                'DOM Content Loaded': `${(domReady / 1000).toFixed(1)}ms`,
                'Total Page Load': `${((loadTime - domReady) / 1000).toFixed(1)}ms`
            });
        });
    }
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }

        // Escape key handling
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                const modal = bootstrap.Modal.getInstance(activeModal);
                if (modal) modal.hide();
            }
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Screen reader announcements
    const announceRegion = document.createElement('div');
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('aria-atomic', 'true');
    announceRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announceRegion);

    window.announceToScreenReader = function(message) {
        announceRegion.textContent = message;
    };
}

// Advanced Features
function initializeAdvancedFeatures() {
    initializeQuickFilters();
    initializeKeyboardShortcuts();
    initializeTableEnhancements();
    initializeSearchEnhancements();
}

function initializeQuickFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const playerRows = document.querySelectorAll('.player-row');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter rows
            playerRows.forEach(row => {
                const shouldShow = filter === 'all' || row.getAttribute('data-filter') === filter;
                row.style.display = shouldShow ? '' : 'none';
            });
        });
    });
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchInput.form.submit();
            }
        }
    });
}

function initializeTableEnhancements() {
    const tables = document.querySelectorAll('.leaderboard-table');

    tables.forEach(table => {
        // Add zebra striping enhancement
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }
        });

        // Enhanced row hover effects
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.3)';
            });

            row.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    });
}

function initializeSearchEnhancements() {
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        // Debounced search
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 2 || this.value.length === 0) {
                    this.form.submit();
                }
            }, 300);
        });

        // Search suggestions
        searchInput.addEventListener('focus', function() {
            // Could implement search suggestions here
        });
    }
}

// Theme System
function applyCurrentTheme() {
    const savedTheme = localStorage.getItem('selected_theme');
    if (savedTheme) {
        try {
            const theme = JSON.parse(savedTheme);
            updateThemeVariables(theme);
        } catch (e) {
            console.error('Error parsing saved theme:', e);
        }
    }

    // Also update variables if there's a session theme
    const sessionTheme = window.sessionTheme;
    if (sessionTheme) {
        updateThemeVariables(sessionTheme);
    }
}

function updateThemeVariables(theme) {
    const root = document.documentElement;

    if (theme.primary_color) root.style.setProperty('--primary-color', theme.primary_color);
    if (theme.secondary_color) root.style.setProperty('--secondary-color', theme.secondary_color);
    if (theme.background_color) root.style.setProperty('--background-color', theme.background_color);
    if (theme.card_background) root.style.setProperty('--card-background', theme.card_background);
    if (theme.text_color) root.style.setProperty('--text-color', theme.text_color);
    if (theme.accent_color) root.style.setProperty('--accent-color', theme.accent_color);
}

// Utility Functions
function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to page
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno
    });
});

// Initialize Elite Squad specific features
console.log('🎮 Elite Squad Bedwars initialized successfully!');