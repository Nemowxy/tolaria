import { APP_COMMAND_IDS, getAppCommandShortcutDisplay } from '../appCommandCatalog'
import type { CommandAction } from './types'
import i18next from '../../i18n'


interface NoteCommandsConfig {
  hasActiveNote: boolean
  activeTabPath: string | null
  isArchived: boolean
  activeNoteHasIcon?: boolean
  onCreateNote: () => void
  onCreateType?: () => void
  onSave: () => void
  onDeleteNote: (path: string) => void
  onArchiveNote: (path: string) => void
  onUnarchiveNote: (path: string) => void
  onChangeNoteType?: () => void
  onMoveNoteToFolder?: () => void
  canMoveNoteToFolder?: boolean
  onSetNoteIcon?: () => void
  onRemoveNoteIcon?: () => void
  onOpenInNewWindow?: () => void
  onToggleFavorite?: (path: string) => void
  isFavorite?: boolean
  onToggleOrganized?: (path: string) => void
  isOrganized?: boolean
  onRestoreDeletedNote?: () => void
  canRestoreDeletedNote?: boolean
}

interface NoteCommandConfig {
  id: string
  label: string
  keywords: string[]
  enabled: boolean
  execute?: () => void
  shortcut?: string
  path?: string | null
  run?: (path: string) => void
}

function createNoteCommand(config: NoteCommandConfig): CommandAction {
  return {
    id: config.id,
    label: config.label,
    group: 'Note',
    shortcut: config.shortcut,
    keywords: config.keywords,
    enabled: config.enabled,
    execute: () => {
      if (config.path && config.run) {
        config.run(config.path)
        return
      }
      config.execute?.()
    },
  }
}

function buildCoreNoteCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    createNoteCommand({
      id: 'create-note',
      label: i18next.t('commands.newNote'),
      shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.fileNewNote),
      keywords: ['new', 'create', 'add'],
      enabled: true,
      execute: config.onCreateNote,
    }),
    createNoteCommand({
      id: 'create-type',
      label: i18next.t('commands.newType'),
      keywords: ['new', 'create', 'type', 'template'],
      enabled: !!config.onCreateType,
      execute: () => config.onCreateType?.(),
    }),
    createNoteCommand({
      id: 'save-note',
      label: i18next.t('commands.saveNote'),
      shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.fileSave),
      keywords: ['write'],
      enabled: config.hasActiveNote,
      execute: config.onSave,
    }),
  ]
}

function buildPathNoteCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    ...buildDestructiveNoteCommands(config),
    ...buildPinnedNoteCommands(config),
  ]
}

function buildDestructiveNoteCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    createNoteCommand({
      id: 'delete-note',
      label: i18next.t('commands.deleteNote'),
      shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.noteDelete),
      keywords: ['delete', 'remove'],
      enabled: config.hasActiveNote,
      path: config.activeTabPath,
      run: config.onDeleteNote,
    }),
    createNoteCommand({
      id: 'archive-note',
      label: config.isArchived ? i18next.t('commands.unarchiveNote') : i18next.t('commands.archiveNote'),
      keywords: ['archive'],
      enabled: config.hasActiveNote,
      path: config.activeTabPath,
      run: config.isArchived ? config.onUnarchiveNote : config.onArchiveNote,
    }),
  ]
}

function buildPinnedNoteCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    createNoteCommand({
      id: 'toggle-favorite',
      label: config.isFavorite ? i18next.t('commands.removeFromFavorites') : i18next.t('commands.addToFavorites'),
      shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.noteToggleFavorite),
      keywords: ['favorite', 'star', 'bookmark', 'pin'],
      enabled: config.hasActiveNote && !!config.onToggleFavorite,
      path: config.activeTabPath,
      run: (path) => config.onToggleFavorite?.(path),
    }),
    createNoteCommand({
      id: 'toggle-organized',
      label: config.isOrganized ? i18next.t('commands.markUnorganized') : i18next.t('commands.markOrganized'),
      shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.noteToggleOrganized),
      keywords: ['organized', 'inbox', 'triage', 'done'],
      enabled: config.hasActiveNote && !!config.onToggleOrganized,
      path: config.activeTabPath,
      run: (path) => config.onToggleOrganized?.(path),
    }),
  ]
}

function buildOptionalNoteCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    ...buildRecoveryCommands(config),
    ...buildRetargetingCommands(config),
    ...buildPresentationCommands(config),
  ]
}

function buildRecoveryCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    createNoteCommand({
      id: 'restore-deleted-note',
      label: i18next.t('commands.restoreDeletedNote'),
      keywords: ['restore', 'deleted', 'undelete', 'git', 'checkout'],
      enabled: !!config.canRestoreDeletedNote && !!config.onRestoreDeletedNote,
      execute: () => config.onRestoreDeletedNote?.(),
    }),
  ]
}

function buildRetargetingCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    createNoteCommand({
      id: 'set-note-icon',
      label: i18next.t('commands.setNoteIcon'),
      keywords: ['icon', 'emoji', 'set', 'add', 'change', 'picker'],
      enabled: config.hasActiveNote && !!config.onSetNoteIcon,
      execute: () => config.onSetNoteIcon?.(),
    }),
    createNoteCommand({
      id: 'change-note-type',
      label: i18next.t('commands.changeNoteType'),
      keywords: ['type', 'change', 'retarget', 'section', 'move'],
      enabled: config.hasActiveNote && !!config.onChangeNoteType,
      execute: () => config.onChangeNoteType?.(),
    }),
    createNoteCommand({
      id: 'move-note-to-folder',
      label: i18next.t('commands.moveToFolder'),
      keywords: ['folder', 'move', 'retarget', 'organize'],
      enabled: config.hasActiveNote && !!config.onMoveNoteToFolder && !!config.canMoveNoteToFolder,
      execute: () => config.onMoveNoteToFolder?.(),
    }),
  ]
}

function buildPresentationCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    createNoteCommand({
      id: 'remove-note-icon',
      label: i18next.t('commands.removeNoteIcon'),
      keywords: ['icon', 'emoji', 'remove', 'delete', 'clear'],
      enabled: config.hasActiveNote && !!config.activeNoteHasIcon && !!config.onRemoveNoteIcon,
      execute: () => config.onRemoveNoteIcon?.(),
    }),
    createNoteCommand({
      id: 'open-in-new-window',
      label: i18next.t('commands.openInNewWindow'),
      shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.noteOpenInNewWindow),
      keywords: ['window', 'new', 'detach', 'pop', 'external', 'separate'],
      enabled: config.hasActiveNote,
      execute: () => config.onOpenInNewWindow?.(),
    }),
  ]
}

export function buildNoteCommands(config: NoteCommandsConfig): CommandAction[] {
  return [
    ...buildCoreNoteCommands(config),
    ...buildPathNoteCommands(config),
    ...buildOptionalNoteCommands(config),
  ]
}
