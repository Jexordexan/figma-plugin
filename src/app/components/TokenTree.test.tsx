import React from 'react';
import { TokenTypes } from '@/constants/TokenTypes';
import { DeepKeyTokenMap, TokenTypeSchema } from '@/types/tokens';
import { fireEvent, render, resetStore } from '../../../tests/config/setupTest';
import { store } from '../store';
import TokenTree from './TokenTree';

const displayType = 'GRID';
const schema = {
  label: 'Sizing',
  property: 'Size',
  type: TokenTypes.SIZING,
  schemas: {
    value: {
      type: 'string',
    },
  },
};
const tokenValues = {
  size: {
    1: {
      name: 'size.1',
      type: TokenTypes.SIZING,
      value: '1',
    },
    2: {
      name: 'size.2',
      type: TokenTypes.SIZING,
      value: '2',
    },
    font: {
      small: {
        name: 'size.font.small',
        type: TokenTypes.SIZING,
        value: '10',
      },
      big: {
        name: 'size.font.big',
        type: TokenTypes.SIZING,
        value: '20',
      },
    }
  },
  color: {
    black: {
      name: 'color.black',
      type: TokenTypes.COLOR,
      value: '#ffffff',
    },
    white: {
      name: 'color.white',
      type: TokenTypes.COLOR,
      value: '#000000',
    },
  },
  other: {
    name: 'other',
    type: TokenTypes.OTHER,
    value: 'other',
  }
};

const showNewForm = jest.fn();
const showForm = jest.fn();

describe('TokenTree', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should be able to collpase token tree', async () => {
    const { getByTestId } = render(<TokenTree
      displayType={displayType}
      tokenValues={tokenValues as DeepKeyTokenMap}
      showNewForm={showNewForm}
      showForm={showForm}
      schema={schema as TokenTypeSchema}
    />);

    await fireEvent.click(getByTestId('tokenlisting-group-size.font'));
    await fireEvent.click(getByTestId('tokenlisting-group-color'));

    const { collapsedTokens } = store.getState().tokenState;
    expect(collapsedTokens).toEqual(['size.font', 'color']);
  });

  it('should be able to expand token tree', async () => {
    const { getByTestId } = render(<TokenTree
      displayType={displayType}
      tokenValues={tokenValues as DeepKeyTokenMap}
      showNewForm={showNewForm}
      showForm={showForm}
      schema={schema as TokenTypeSchema}
    />);

    await fireEvent.click(getByTestId('tokenlisting-group-size.font'));
    await fireEvent.click(getByTestId('tokenlisting-group-size.font'));
    await fireEvent.click(getByTestId('tokenlisting-group-color'));

    const { collapsedTokens } = store.getState().tokenState;
    expect(collapsedTokens).toEqual(['color']);
  });

  it('should be able to work add a new token', async () => {
    const result = render(<TokenTree
      displayType={displayType}
      tokenValues={tokenValues as DeepKeyTokenMap}
      showNewForm={showNewForm}
      showForm={showForm}
      schema={schema as TokenTypeSchema}
    />);

    await fireEvent.click(result.getAllByTestId('button-add-new-token-in-group')[0]);
    expect(showNewForm).toBeCalledTimes(1);
  });
});
