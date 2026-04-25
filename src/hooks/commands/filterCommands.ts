import type { CommandAction } from './types'
import i18next from '../../i18n'
import type { NoteListFilter } from '../../utils/noteListHelpers'

interface FilterCommandsConfig {
  isSectionGroup: boolean
  noteListFilter?: NoteListFilter
  onSetNoteListFilter?: (filter: NoteListFilter) => void
}

export function buildFilterCommands(config: FilterCommandsConfig): CommandAction[] {
  const { isSectionGroup, noteListFilter, onSetNoteListFilter } = config
  return [
    { id: 'filter-open', label: i18next.t('commands.showOpenNotes'), group: 'Navigation', keywords: ['filter', 'open', 'active', 'pill'], enabled: !!isSectionGroup && noteListFilter !== 'open', execute: () => onSetNoteListFilter?.('open') },
    { id: 'filter-archived', label: i18next.t('commands.showArchivedNotes'), group: 'Navigation', keywords: ['filter', 'archived', 'pill'], enabled: !!isSectionGroup && noteListFilter !== 'archived', execute: () => onSetNoteListFilter?.('archived') },
  ]
}
