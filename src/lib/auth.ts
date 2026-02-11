/**
 * Initialize demo user account on first visit
 */
export function initializeDemoAccount() {
    try {
        const users = localStorage.getItem('plants-users');

        // Only initialize if no users exist
        if (!users || JSON.parse(users).length === 0) {
            const demoUser = {
                id: 'demo-user-001',
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'demo123',
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('plants-users', JSON.stringify([demoUser]));
        }
    } catch (error) {
        console.error('Error initializing demo account:', error);
    }
}

/**
 * Get current logged in user
 */
export function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('plants-current-user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Logout current user
 */
export function logoutUser() {
    try {
        localStorage.removeItem('plants-current-user');
        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        return false;
    }
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(): boolean {
    try {
        const userStr = localStorage.getItem('plants-current-user');
        return userStr !== null && userStr !== '';
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}
