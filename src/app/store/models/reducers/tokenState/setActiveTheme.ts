import { TokenSetStatus } from '@/constants/TokenSetStatus';
import { track } from '@/utils/analytics';
import type { TokenState } from '../../tokenState';

export function setActiveTheme(state: TokenState, themeId: string | null): TokenState {
  const themeObject = themeId ? state.themes.find((theme) => theme.id === themeId) : null;
  const usedTokenSetsMap = themeObject
    ? Object.fromEntries(
      Object.keys(state.tokens).map((tokenSet) => (
        [tokenSet, themeObject.selectedTokenSets?.[tokenSet] ?? TokenSetStatus.DISABLED]
      )),
    )
    : Object.fromEntries(
      Object.keys(state.tokens).map((tokenSet) => (
        [tokenSet, TokenSetStatus.DISABLED]
      )),
    );
  track('setActiveTheme');

  return {
    ...state,
    usedTokenSet: usedTokenSetsMap,
    activeTheme: themeId,
  };
}
