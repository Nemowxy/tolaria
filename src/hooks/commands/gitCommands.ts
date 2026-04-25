import type { CommandAction } from './types'
import i18next from '../../i18n'
import type { SidebarSelection } from '../../types'

interface GitCommandsConfig {
  modifiedCount: number
  canAddRemote: boolean
  onAddRemote?: () => void
  onCommitPush: () => void
  onPull?: () => void
  onResolveConflicts?: () => void
  onSelect: (sel: SidebarSelection) => void
}

export function buildGitCommands(config: GitCommandsConfig): CommandAction[] {
  const { modifiedCount, canAddRemote, onAddRemote, onCommitPush, onPull, onResolveConflicts, onSelect } = config
  return [
    { id: 'commit-push', label: i18next.t('commands.commitPush'), group: 'Git', keywords: ['git', 'save', 'sync'], enabled: modifiedCount > 0, execute: onCommitPush },
    { id: 'add-remote', label: i18next.t('commands.addRemote'), group: 'Git', keywords: ['git', 'remote', 'connect', 'origin', 'no remote'], enabled: canAddRemote && !!onAddRemote, execute: () => onAddRemote?.() },
    { id: 'git-pull', label: i18next.t('commands.pullFromRemote'), group: 'Git', keywords: ['git', 'pull', 'fetch', 'download', 'sync', 'remote'], enabled: true, execute: () => onPull?.() },
    { id: 'resolve-conflicts', label: i18next.t('commands.resolveConflicts'), group: 'Git', keywords: ['conflict', 'merge', 'git', 'sync'], enabled: true, execute: () => onResolveConflicts?.() },
    { id: 'view-changes', label: i18next.t('commands.viewChanges'), group: 'Git', keywords: ['modified', 'diff'], enabled: true, execute: () => onSelect({ kind: 'filter', filter: 'changes' }) },
  ]
}
