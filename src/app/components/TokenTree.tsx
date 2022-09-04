import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TokenGroupHeading from './TokenGroupHeading';
import { TokenButton } from './TokenButton';
import { displayTypeSelector, editProhibitedSelector } from '@/selectors';
import { DeepKeyTokenMap, SingleToken, TokenTypeSchema } from '@/types/tokens';
import { isSingleToken } from '@/utils/is';
import IconButton from './IconButton';
import AddIcon from '@/icons/add.svg';
import { collapsedTokensSelector } from '@/selectors/collapsedTokensSelector';
import { Dispatch } from '../store';
import { EditTokenFormStatus } from '@/constants/EditTokenFormStatus';
import { IconCollapseArrow, IconExpandArrow } from '@/icons';
import { StyledCollapsableTokenGroupHeadingButton, StyledTokenGroup } from './StyledTokenGroup';

export type ShowFormOptions = {
  name: string;
  status?: EditTokenFormStatus;
  token: SingleToken | null;
};

export type ShowNewFormOptions = {
  name?: string;
};

type Props = {
  schema: TokenTypeSchema;
  tokenValues: DeepKeyTokenMap;
  path?: string | null;
  showNewForm: (opts: ShowNewFormOptions) => void;
  showForm: (opts: ShowFormOptions) => void;
};

const TokenTree: React.FC<Props> = ({
  tokenValues, showNewForm, showForm, schema, path = null,
}) => {
  const editProhibited = useSelector(editProhibitedSelector);
  const collapsed = useSelector(collapsedTokensSelector);
  const displayType = useSelector(displayTypeSelector);
  const dispatch = useDispatch<Dispatch>();

  const handleToggleCollapsed = useCallback((key: string) => {
    dispatch.tokenState.setCollapsedTokens(collapsed.includes(key) ? collapsed.filter((s) => s !== key) : [...collapsed, key]);
  }, [collapsed, dispatch.tokenState]);

  const tokenValuesEntries = React.useMemo(() => (
    Object.entries(tokenValues).map(([name, value]) => {
      const stringPath = [path, name].filter((n) => n).join('.');
      const isTokenGroup = !isSingleToken(value);
      const parent = path || '';

      return {
        stringPath,
        name,
        value,
        isTokenGroup,
        parent,
        handleShowNewForm: () => showNewForm({ name: `${stringPath}.` }),
      };
    })
  ), [tokenValues, path, showNewForm]);

  const mappedItems = useMemo(() => (
    tokenValuesEntries.filter((item) => (
      // remove items which are in a collapsed parent
      !collapsed.some((parentKey) => (item.parent?.startsWith(parentKey) && item.parent?.charAt(parentKey.length) === '.')
      || item.parent === parentKey)
    )).map((item) => ({
      item,
      onToggleCollapsed: () => handleToggleCollapsed(item.stringPath),
    }))
  ), [tokenValuesEntries, collapsed, handleToggleCollapsed]);

  const [draggedToken, setDraggedToken] = useState<SingleToken | null>(null);
  const [dragOverToken, setDragOverToken] = useState<SingleToken | null>(null);

  return (
    <StyledTokenGroup displayType={displayType}>
      {mappedItems.map(({ item, onToggleCollapsed }) => (
        <React.Fragment key={item.stringPath}>
          {typeof item.value === 'object' && !isSingleToken(item.value) ? (
            <div className="property-wrapper w-full" data-cy={`token-group-${item.stringPath}`}>
              <div className="flex items-center justify-between group">
                <StyledCollapsableTokenGroupHeadingButton
                  collapsed={collapsed.includes(item.stringPath)}
                  data-cy={`tokenlisting-group-${item.stringPath}`}
                  data-testid={`tokenlisting-group-${item.stringPath}`}
                  type="button"
                  onClick={onToggleCollapsed}
                >
                  {collapsed.includes(item.stringPath) ? (
                    <IconCollapseArrow />
                  ) : (
                    <IconExpandArrow />
                  )}
                  <TokenGroupHeading label={item.name} path={item.stringPath} id="listing" type={schema.type} />
                </StyledCollapsableTokenGroupHeadingButton>
                <div className="opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <IconButton
                    icon={<AddIcon />}
                    tooltip="Add a new token"
                    tooltipSide="left"
                    onClick={item.handleShowNewForm}
                    disabled={editProhibited}
                    dataCy="button-add-new-token-in-group"
                  />
                </div>
              </div>

              <TokenTree
                tokenValues={item.value}
                showNewForm={showNewForm}
                showForm={showForm}
                schema={schema}
                path={item.stringPath}
              />
            </div>
          ) : (
            <TokenButton
              type={schema.type}
              token={item.value}
              showForm={showForm}
              draggedToken={draggedToken}
              dragOverToken={dragOverToken}
              setDraggedToken={setDraggedToken}
              setDragOverToken={setDragOverToken}
            />
          )}
        </React.Fragment>
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      ))}
    </StyledTokenGroup>
  );
};

export default React.memo(TokenTree);
