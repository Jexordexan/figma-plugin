import React from 'react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import {
  act, createMockStore, render,
} from '../../../../tests/config/setupTest';
import { ThemeSelector } from './ThemeSelector';

describe('ThemeSelector', () => {
  it('should show none if no active theme is selected', () => {
    const mockStore = createMockStore({});
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    expect(component.queryByTestId('themeselector-dropdown')?.textContent).toEqual('Theme:None');
  });

  it('should show the active theme name', () => {
    const mockStore = createMockStore({
      tokenState: {
        activeTheme: 'light',
        themes: [{
          id: 'light', name: 'Light', selectedTokenSets: {}, $figmaStyleReferences: {},
        }],
      },
    });
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    expect(component.queryByTestId('themeselector-dropdown')?.textContent).toEqual('Theme:Light');
  });

  it('should show the unknown if the active theme is somehow not available anymore', () => {
    const mockStore = createMockStore({
      tokenState: {
        activeTheme: 'light',
      },
    });
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    expect(component.queryByTestId('themeselector-dropdown')?.textContent).toEqual('Theme:Unknown');
  });

  it('be possible to select a theme', async () => {
    const mockStore = createMockStore({
      tokenState: {
        themes: [{
          id: 'light', name: 'Light', selectedTokenSets: {}, $figmaStyleReferences: {},
        }],
      },
    });
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    await act(async () => {
      const trigger = await component.findByTestId('themeselector-dropdown');
      trigger.focus();
      await userEvent.keyboard('[Enter]');
    });

    await act(async () => {
      const lightTheme = await component.findByTestId('themeselector--themeoptions--light');
      await lightTheme.click();
    });

    expect(mockStore.getState().tokenState.activeTheme).toEqual('light');
  });

  it('should clear theme', async () => {
    const mockStore = createMockStore({
      tokenState: {
        themes: [],
      },
    });
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    await act(async () => {
      const trigger = await component.findByTestId('themeselector-dropdown');
      trigger.focus();
      await userEvent.keyboard('[Enter]');
    });

    await act(async () => {
      const noTheme = await component.findByText('No themes');
      await noTheme.click();
    });

    expect(mockStore.getState().tokenState.activeTheme).toEqual(null);
  });

  it('be possible to reset a theme', async () => {
    const mockStore = createMockStore({
      tokenState: {
        themes: [{
          id: 'light', name: 'Light', selectedTokenSets: {}, $figmaStyleReferences: {},
        }],
        activeTheme: 'light',
      },
    });
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    await act(async () => {
      const trigger = await component.findByTestId('themeselector-dropdown');
      trigger.focus();
      await userEvent.keyboard('[Enter]');
    });

    await act(async () => {
      const lightTheme = await component.findByTestId('themeselector--themeoptions--light');
      await lightTheme.click();
    });

    expect(mockStore.getState().tokenState.activeTheme).toEqual(null);
  });

  it('open manage theme modal', async () => {
    const mockStore = createMockStore({
      tokenState: {
        themes: [{
          id: 'light', name: 'Light', selectedTokenSets: {}, $figmaStyleReferences: {},
        }],
        activeTheme: 'light',
      },
    });
    const component = render(
      <Provider store={mockStore}>
        <ThemeSelector />
      </Provider>,
    );

    await act(async () => {
      const trigger = await component.findByTestId('themeselector-dropdown');
      trigger.focus();
      await userEvent.keyboard('[Enter]');
    });
    const manageTheme = await component.findByTestId('themeselector-managethemes');

    await act(async () => {
      manageTheme.focus();
      await userEvent.keyboard('[Enter]');
    });

    expect(manageTheme).not.toBeInTheDocument();
  });
});
