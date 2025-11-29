import React from 'react';
import { useUrlAuth } from '../utilities/use-url-auth';


export function UrlAuthHandler() {
    const { isAuthenticating } = useUrlAuth();

    // Show loading state while authenticating
    if (isAuthenticating) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div>Authenticating...</div>
            </div>
        );
    }

    return null;
}

