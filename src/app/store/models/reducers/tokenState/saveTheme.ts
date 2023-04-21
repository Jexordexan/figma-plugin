import hash from 'object-hash';
import { ThemeObject } from '@/types';
import type { TokenState } from '../../tokenState';
import { setActiveTheme } from './setActiveTheme';
import { TokenSetStatus } from '@/constants/TokenSetStatus';

type Payload = Omit<ThemeObject, 'id' | '$figmaStyleReferences'> & {
  id?: string,
  group: string
};

export function saveTheme(state: TokenState, data: Payload): TokenState {
  const isNewTheme = !data.id;
  const themeId = data.id || hash([Date.now(), data]);
  const isActiveTheme = Object.values(state.activeTheme).includes(themeId);
  const selectedTokenSets = Object.fromEntries(
    Object.entries(data.selectedTokenSets)
      .filter(([, status]) => (status !== TokenSetStatus.DISABLED)),
  );
  const themeObjectIndex = state.themes.findIndex((theme) => theme.id === themeId);
  const startIndex = themeObjectIndex > -1 ? themeObjectIndex : state.themes.length;

  const updatedThemes = [...state.themes];
  updatedThemes.splice(startIndex, 1, {
    ...state.themes[themeObjectIndex],
    ...data,
    id: themeId,
    $figmaStyleReferences: state.themes[themeObjectIndex]?.$figmaStyleReferences ?? {},
    selectedTokenSets,
  });

  const newActiveTheme = state.activeTheme;
  if (isActiveTheme) {
    delete newActiveTheme[data.group];
  } else {
    newActiveTheme[data.group] = themeId;
  }

  const nextState: TokenState = {
    ...state,
    themes: updatedThemes,
  };

  if (isActiveTheme || isNewTheme) {
    // @README if this theme is currently active or if it's a new theme
    // we will also run the setActiveTheme reducer
    // we don't want to update nodes or styles though.
    return setActiveTheme(nextState, { newActiveTheme, shouldUpdateNodes: false });
  }

  return nextState;
}
