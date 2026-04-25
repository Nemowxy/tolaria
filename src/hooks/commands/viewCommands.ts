import { APP_COMMAND_IDS, getAppCommandShortcutDisplay } from '../appCommandCatalog'
import type { CommandAction } from './types'
import type { ViewMode } from '../useViewMode'
import { requestNewAiChat } from '../../utils/aiPromptBridge'
import i18next from '../../i18n'

interface ViewCommandsConfig {
  hasActiveNote: boolean
  activeNoteModified: boolean
  onSetViewMode: (mode: ViewMode) => void
  onToggleInspector: () => void
  onToggleDiff?: () => void
  onToggleRawEditor?: () => void
  onToggleAIChat?: () => void
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onCustomizeNoteListColumns?: () => void
  canCustomizeNoteListColumns?: boolean
  noteListColumnsLabel: string
}

export function buildViewCommands(config: ViewCommandsConfig): CommandAction[] {
  const {
    hasActiveNote, activeNoteModified,
    onSetViewMode, onToggleInspector, onToggleDiff, onToggleRawEditor, onToggleAIChat,
    zoomLevel, onZoomIn, onZoomOut, onZoomReset,
    onCustomizeNoteListColumns, canCustomizeNoteListColumns, noteListColumnsLabel,
  } = config

  return [
    { id: 'view-editor', label: i18next.t('commands.editorOnly'), group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewEditorOnly), keywords: ['layout', 'focus'], enabled: true, execute: () => onSetViewMode('editor-only') },
    { id: 'view-editor-list', label: i18next.t('commands.editorList'), group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewEditorList), keywords: ['layout'], enabled: true, execute: () => onSetViewMode('editor-list') },
    { id: 'view-all', label: i18next.t('commands.fullLayout'), group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewAll), keywords: ['layout', 'sidebar'], enabled: true, execute: () => onSetViewMode('all') },
    { id: 'toggle-inspector', label: i18next.t('commands.toggleProperties'), group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewToggleProperties), keywords: ['properties', 'inspector', 'panel', 'right', 'sidebar'], enabled: true, execute: onToggleInspector },
    { id: 'toggle-diff', label: i18next.t('commands.toggleDiff'), group: 'View', keywords: ['diff', 'changes', 'git', 'compare', 'version'], enabled: hasActiveNote && activeNoteModified, execute: () => onToggleDiff?.() },
    { id: 'toggle-raw-editor', label: i18next.t('commands.toggleRawEditor'), group: 'View', keywords: ['raw', 'source', 'markdown', 'frontmatter', 'code', 'textarea'], enabled: hasActiveNote && !!onToggleRawEditor, execute: () => onToggleRawEditor?.() },
    { id: 'toggle-ai-panel', label: i18next.t('commands.toggleAiPanel'), group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewToggleAiChat), keywords: ['ai', 'agent', 'chat', 'assistant', 'contextual'], enabled: true, execute: () => onToggleAIChat?.() },
    { id: 'new-ai-chat', label: i18next.t('commands.newAiChat'), group: 'View', keywords: ['ai', 'agent', 'chat', 'assistant', 'new', 'fresh', 'conversation', 'reset'], enabled: true, execute: requestNewAiChat },
    { id: 'toggle-backlinks', label: i18next.t('commands.toggleBacklinks'), group: 'View', keywords: ['backlinks', 'references', 'links', 'mentions', 'incoming'], enabled: hasActiveNote, execute: onToggleInspector },
    { id: 'customize-note-list-columns', label: noteListColumnsLabel, group: 'View', keywords: ['all notes', 'inbox', 'columns', 'chips', 'properties', 'note list'], enabled: !!(canCustomizeNoteListColumns && onCustomizeNoteListColumns), execute: () => onCustomizeNoteListColumns?.() },
    { id: 'zoom-in', label: `${i18next.t('commands.zoomIn')} (${zoomLevel}%)`, group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewZoomIn), keywords: ['zoom', 'bigger', 'larger', 'scale'], enabled: zoomLevel < 150, execute: onZoomIn },
    { id: 'zoom-out', label: `${i18next.t('commands.zoomOut')} (${zoomLevel}%)`, group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewZoomOut), keywords: ['zoom', 'smaller', 'scale'], enabled: zoomLevel > 80, execute: onZoomOut },
    { id: 'zoom-reset', label: i18next.t('commands.resetZoom'), group: 'View', shortcut: getAppCommandShortcutDisplay(APP_COMMAND_IDS.viewZoomReset), keywords: ['zoom', 'actual', 'default', '100'], enabled: zoomLevel !== 100, execute: onZoomReset },
  ]
}
