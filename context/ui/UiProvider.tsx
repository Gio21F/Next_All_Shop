import { FC, useReducer, ReactNode, useEffect } from 'react';
import { UiContext, uiReducer } from './';

interface Props {
    children: ReactNode
}
export interface UiState {
    theme: string;
}

const UI_INITIAL_STATE: UiState = {
    theme: ''
}


export const UiProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( uiReducer , UI_INITIAL_STATE );

    useEffect( () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            dispatch({ type: '[UI] - ToggleTheme', payload: savedTheme });
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        dispatch({ type: '[UI] - ToggleTheme', payload: newTheme });
    }

    return (
        <UiContext.Provider value={{
            ...state,

            // Methods
            toggleTheme,
        }}>
            { children }
        </UiContext.Provider>
    )
};