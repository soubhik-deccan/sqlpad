import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import message from '../common/message';
import { api } from './api';

interface UrlAuthParams {
    password?: string;
    email?: string;
}

/**
 * Hook to handle URL-based authentication for iframe embedding
 * Automatically authenticates when email/password are in URL params
 * Cleans up URL after authentication to avoid exposing credentials
 */
export function useUrlAuth() {
    const location = useLocation();
    const history = useHistory();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

    useEffect(() => {
        // Only attempt once per mount
        if (hasAttemptedAuth || isAuthenticating) {
            return;
        }

        const searchParams = new URLSearchParams(location.search);
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        // Check if we have credentials in URL (email and password required)
        if (password && email) {
            setIsAuthenticating(true);
            setHasAttemptedAuth(true);

            const authenticate = async () => {
                try {
                    const json = await api.post('/api/signin', {
                        email,
                        password,
                    });

                    if (json.error) {
                        message.error('Authentication failed: ' + json.error);
                        // Clean up URL even on failure
                        removeAuthParams();
                        setIsAuthenticating(false);
                        return;
                    }

                    // Reload app info to get current user
                    await api.reloadAppInfo();

                    // Clean up URL parameters to avoid exposing credentials
                    removeAuthParams();

                    setIsAuthenticating(false);
                } catch (error) {
                    console.error('URL authentication error:', error);
                    message.error('Authentication failed');
                    removeAuthParams();
                    setIsAuthenticating(false);
                }
            };

            authenticate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const removeAuthParams = () => {
        const searchParams = new URLSearchParams(location.search);
        // Keep email, only delete password
        // Remove username if it exists (we only use email)
        searchParams.delete('username');
        searchParams.delete('password');

        const newSearch = searchParams.toString();
        const newPath = newSearch
            ? `${location.pathname}?${newSearch}`
            : location.pathname;

        // Use replace to avoid adding to history
        history.replace(newPath);
    };

    return { isAuthenticating };
}

