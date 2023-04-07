import React, {
  useCallback, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import compact from 'just-compact';
import { activeThemeSelector, themesListSelector } from '@/selectors';
import Modal from '../Modal';
import { Dispatch } from '@/app/store';
import Blankslate from '../Blankslate';
import Stack from '../Stack';
import IconPlus from '@/icons/plus.svg';
import Button from '../Button';
import { CreateOrEditThemeForm, FormValues } from './CreateOrEditThemeForm';
import { ThemeObject, ThemeObjectsList } from '@/types';
import Box from '../Box';
import { track } from '@/utils/analytics';
import useConfirm from '@/app/hooks/useConfirm';
import { ReorderGroup } from '@/motion/ReorderGroup';
import { DragItem } from '../StyledDragger/DragItem';
import { ThemeListItemContent } from '../ThemeSelector/ThemeListItemContent';
import Input from '../Input';
import Text from '../Text';

type Props = unknown;

export const ManageThemesModal: React.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const themes = useSelector(themesListSelector);
  const activeTheme = useSelector(activeThemeSelector);
  const { confirm } = useConfirm();
  const [themeEditorOpen, setThemeEditorOpen] = useState<boolean | string>(false);
  const [groupEditorOpen, setGroupEditorOpen] = useState<boolean | string>(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groupNames, setGroupNames] = useState(compact(themes.map((theme) => theme.group)));
  const isNewGroupNameValid = useMemo(() => newGroupName && !groupNames.find((g) => g === newGroupName), [newGroupName, groupNames]);

  const themeEditorDefaultValues = useMemo(() => {
    const themeObject = themes.find(({ id }) => id === themeEditorOpen);
    if (themeObject) {
      return {
        name: themeObject.name,
        tokenSets: themeObject.selectedTokenSets,
      };
    }
    return {};
  }, [themes, themeEditorOpen]);

  const handleClose = useCallback(() => {
    dispatch.uiState.setManageThemesModalOpen(false);
  }, [dispatch]);

  const handleToggleThemeEditor = useCallback((theme?: ThemeObject) => {
    if (theme && typeof theme !== 'boolean') {
      const nextState = theme.id === themeEditorOpen ? false : theme.id;
      setThemeEditorOpen(nextState);
    } else {
      setThemeEditorOpen(!themeEditorOpen);
    }
  }, [themeEditorOpen]);

  const handleDeleteTheme = useCallback(async () => {
    if (typeof themeEditorOpen === 'string') {
      const confirmDelete = await confirm({ text: 'Are you sure you want to delete this theme?' });
      if (confirmDelete) {
        track('Delete theme', { id: themeEditorOpen });
        dispatch.tokenState.deleteTheme(themeEditorOpen);
        setThemeEditorOpen(false);
      }
    }
  }, [confirm, dispatch.tokenState, themeEditorOpen]);

  const handleCancelEdit = useCallback(() => {
    setThemeEditorOpen(false);
  }, []);

  const handleSubmit = useCallback((values: FormValues) => {
    const id = typeof themeEditorOpen === 'string' ? themeEditorOpen : undefined;
    if (id) {
      track('Edit theme', { id, values });
    } else {
      track('Create theme', { values });
    }
    dispatch.tokenState.saveTheme({
      id,
      name: values.name,
      selectedTokenSets: values.tokenSets,
      group: 'empty',
    });
    setThemeEditorOpen(false);
  }, [themeEditorOpen, dispatch]);

  const handleReorder = React.useCallback((reorderedItems: ThemeObjectsList) => {
    const reorderedThemeList = compact(reorderedItems.map((item) => themes.find((theme) => theme.id === item.id)));
    dispatch.tokenState.setThemes(reorderedThemeList);
  }, [dispatch.tokenState, themes]);

  const handleShowGroupEditor = useCallback(() => {
    setGroupEditorOpen(true);
  }, []);

  const handleNewGroupNameChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    setNewGroupName(e.target.value);
  }, []);

  const handleResetNewGroupName = useCallback(() => {
    setNewGroupName('');
  }, []);

  const handleSaveNewEmptyGroup = useCallback(() => {
    if (isNewGroupNameValid) {
      setGroupNames([...groupNames, newGroupName]);
    }
  }, [groupNames, newGroupName, isNewGroupNameValid]);

  return (
    <Modal
      isOpen
      compact={!!themeEditorOpen}
      full={!themeEditorOpen}
      large
      title="Themes"
      footer={(
        <Stack gap={2} direction="row" justify="end">
          {!themeEditorOpen && (
            <Button
              id="button-manage-themes-modal-new-theme"
              variant="secondary"
              icon={<IconPlus />}
              onClick={handleToggleThemeEditor}
            >
              New theme
            </Button>
          )}
          {themeEditorOpen && (
            <>
              <Box css={{ marginRight: 'auto' }}>
                {typeof themeEditorOpen === 'string' && (
                <Button
                  id="button-manage-themes-modal-delete-theme"
                  variant="danger"
                  type="submit"
                  onClick={handleDeleteTheme}
                >
                  Delete
                </Button>
                )}
              </Box>
              <Button
                id="button-manage-themes-modal-cancel"
                variant="secondary"
                onClick={handleToggleThemeEditor}
              >
                Cancel
              </Button>
              <Button
                id="button-manage-themes-modal-save-theme"
                variant="primary"
                type="submit"
                form="form-create-or-edit-theme"
              >
                Save theme
              </Button>
            </>
          )}
        </Stack>
      )}
      close={handleClose}
    >
      {!themes.length && !themeEditorOpen && (
        <Blankslate
          css={{ padding: '$8 $4' }}
          title="You don't have any themes yet"
          text="Create your first theme now"
        />
      )}
      {!!themes.length && !themeEditorOpen && (
        <>
          <ReorderGroup
            layoutScroll
            values={themes}
            onReorder={handleReorder}
          >
            <Text css={{ color: '$textSubtle' }}>No group</Text>
            {
              themes.filter((t) => t.group === 'empty').map((theme) => (
                <DragItem<ThemeObject> key={theme.id} item={theme}>
                  <ThemeListItemContent item={theme} isActive={activeTheme === theme.id} onOpen={handleToggleThemeEditor} />
                </DragItem>
              ))
            }
            {
              groupNames.map((groupName) => (
                <>
                  <Text css={{ color: '$textSubtle' }}>{groupName}</Text>
                  {
                    themes.filter((t) => t.group === groupName).map((theme) => (
                      <DragItem<ThemeObject> key={theme.id} item={theme}>
                        <ThemeListItemContent item={theme} isActive={activeTheme === theme.id} onOpen={handleToggleThemeEditor} />
                      </DragItem>
                    ))
                  }
                  {
                    !themes.filter((t) => t.group === groupName).length && (
                      <Blankslate
                        css={{ padding: '$8 $4' }}
                        title="No themes yet"
                        text="No themes yet"
                      />
                    )
                  }
                </>
              ))
            }
          </ReorderGroup>
          {
            !groupEditorOpen ? (
              <Button
                id="button-manage-themes-modal-new-group"
                variant="secondary"
                icon={<IconPlus />}
                onClick={handleShowGroupEditor}
              >
                New group
              </Button>
            ) : (
              <Stack direction="row">
                <Input
                  required
                  full
                  label="Group Name"
                  value={newGroupName}
                  onChange={handleNewGroupNameChange}
                  type="text"
                  autofocus
                  name="groupName"
                  placeholder="Unique name"
                />
                <Button variant="secondary" type="button" onClick={handleResetNewGroupName}>
                  Cancel
                </Button>
                <Button disabled={!isNewGroupNameValid} variant="primary" onClick={handleSaveNewEmptyGroup}>
                  Save
                </Button>
              </Stack>
            )
          }
        </>
      )}
      {themeEditorOpen && (
        <CreateOrEditThemeForm
          id={typeof themeEditorOpen === 'string' ? themeEditorOpen : undefined}
          defaultValues={themeEditorDefaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      )}
    </Modal>
  );
};
