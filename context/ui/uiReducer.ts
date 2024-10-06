import { UiState } from './';

type UiActionType = 
   | { type: '[UI] - ToggleTheme', payload: string }

export const uiReducer = ( state: UiState, action: UiActionType ): UiState => {

   switch (action.type) {
      case '[UI] - ToggleTheme':
         return {
            ...state,
            theme: action.payload
        }

       default:
          return state;
   }

}