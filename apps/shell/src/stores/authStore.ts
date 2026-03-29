import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { User, TokenPair, AuthResult } from '@nab/shared-types';

interface IUseAuthStore {
    // properties
    user: User | null;
    tokens: TokenPair | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Method
    logout: () => void;
    setAuth: (result: AuthResult) => void;
}


const useAuthStore = create<IUseAuthStore>()(
    devtools(
        persist(
            (set) => ({
                // initial state
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,

                // actions
                logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
                setAuth: (result: AuthResult) => set({ user: result.user, tokens: result.tokens, isAuthenticated: true })
            }),
            { name: "nab-auth" } //persit config
        ),
        { name: "AuthStore" } // devtools config
    )
)

export default useAuthStore