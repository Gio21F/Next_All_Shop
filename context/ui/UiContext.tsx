import { createContext } from 'react';


interface ContextProps {
    theme: string;
    // Methods
    toggleTheme: () => void;
}


export const UiContext = createContext({} as ContextProps );