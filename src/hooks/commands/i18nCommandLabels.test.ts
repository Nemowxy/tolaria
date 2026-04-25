import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18next from '../../i18n'
import { buildAiAgentCommands } from './aiAgentCommands'
import { buildFilterCommands } from './filterCommands'
import { buildGitCommands } from './gitCommands'
import { buildNavigationCommands } from './navigationCommands'
import { buildNoteCommands } from './noteCommands'
import { buildSettingsCommands } from './settingsCommands'
import { buildViewCommands } from './viewCommands'

function labelFor(commands: { id: string; label: string }[], id: string) {
  return commands.find((command) => command.id === id)?.label
}

describe('command labels i18n', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('returns English note and git labels', async () => {
    await i18next.changeLanguage('en')

    const noteCommands = buildNoteCommands({
      hasActiveNote: true,
      activeTabPath: '/notes/test.md',
      isArchived: false,
      activeNoteModified: false,
      onCreateNote: vi.fn(),
      onCreateType: vi.fn(),
      onSave: vi.fn(),
      onDeleteNote: vi.fn(),
      onArchiveNote: vi.fn(),
      onUnarchiveNote: vi.fn(),
      onToggleFavorite: vi.fn(),
      onToggleOrganized: vi.fn(),
      onRestoreDeletedNote: vi.fn(),
      canRestoreDeletedNote: true,
      onSetNoteIcon: vi.fn(),
      onChangeNoteType: vi.fn(),
      onMoveNoteToFolder: vi.fn(),
      canMoveNoteToFolder: true,
      activeNoteHasIcon: true,
      onRemoveNoteIcon: vi.fn(),
      onOpenInNewWindow: vi.fn(),
      isFavorite: false,
      isOrganized: false,
    })

    const gitCommands = buildGitCommands({
      modifiedCount: 1,
      canAddRemote: true,
      onAddRemote: vi.fn(),
      onCommitPush: vi.fn(),
      onPull: vi.fn(),
      onResolveConflicts: vi.fn(),
      onSelect: vi.fn(),
    })

    expect(labelFor(noteCommands, 'create-note')).toBe('New Note')
    expect(labelFor(noteCommands, 'create-type')).toBe('New Type')
    expect(labelFor(noteCommands, 'save-note')).toBe('Save Note')
    expect(labelFor(noteCommands, 'archive-note')).toBe('Archive Note')
    expect(labelFor(noteCommands, 'toggle-favorite')).toBe('Add to Favorites')
    expect(labelFor(noteCommands, 'toggle-organized')).toBe('Mark as Organized')
    expect(labelFor(noteCommands, 'restore-deleted-note')).toBe('Restore Deleted Note')
    expect(labelFor(noteCommands, 'set-note-icon')).toBe('Set Note Icon')
    expect(labelFor(noteCommands, 'change-note-type')).toBe('Change Note Type…')
    expect(labelFor(noteCommands, 'move-note-to-folder')).toBe('Move Note to Folder…')
    expect(labelFor(noteCommands, 'remove-note-icon')).toBe('Remove Note Icon')
    expect(labelFor(noteCommands, 'open-in-new-window')).toBe('Open in New Window')

    expect(labelFor(gitCommands, 'commit-push')).toBe('Commit & Push')
    expect(labelFor(gitCommands, 'add-remote')).toBe('Add Remote to Current Vault')
    expect(labelFor(gitCommands, 'git-pull')).toBe('Pull from Remote')
    expect(labelFor(gitCommands, 'resolve-conflicts')).toBe('Resolve Conflicts')
    expect(labelFor(gitCommands, 'view-changes')).toBe('View Pending Changes')
  })

  it('returns Chinese labels for translated command groups', async () => {
    await i18next.changeLanguage('zh')

    const viewCommands = buildViewCommands({
      hasActiveNote: true,
      activeNoteModified: true,
      onSetViewMode: vi.fn(),
      onToggleInspector: vi.fn(),
      onToggleDiff: vi.fn(),
      onToggleRawEditor: vi.fn(),
      onToggleAIChat: vi.fn(),
      zoomLevel: 100,
      onZoomIn: vi.fn(),
      onZoomOut: vi.fn(),
      onZoomReset: vi.fn(),
      onCustomizeNoteListColumns: vi.fn(),
      canCustomizeNoteListColumns: true,
      noteListColumnsLabel: '自定义笔记列表列',
    })

    const navigationCommands = buildNavigationCommands({
      onQuickOpen: vi.fn(),
      onSelect: vi.fn(),
      showInbox: true,
      onGoBack: vi.fn(),
      onGoForward: vi.fn(),
      canGoBack: true,
      canGoForward: true,
    })

    const settingsCommands = buildSettingsCommands({
      onOpenSettings: vi.fn(),
      onOpenFeedback: vi.fn(),
      onOpenVault: vi.fn(),
      onCreateEmptyVault: vi.fn(),
      onRemoveActiveVault: vi.fn(),
      onRestoreGettingStarted: vi.fn(),
      onCheckForUpdates: vi.fn(),
      onInstallMcp: vi.fn(),
      onReloadVault: vi.fn(),
      onRepairVault: vi.fn(),
      vaultCount: 2,
      isGettingStartedHidden: true,
      mcpStatus: 'installed',
    })

    const filterCommands = buildFilterCommands({
      isSectionGroup: true,
      noteListFilter: 'all',
      onSetNoteListFilter: vi.fn(),
    })

    const aiAgentCommands = buildAiAgentCommands({
      onOpenAiAgents: vi.fn(),
      onCycleDefaultAiAgent: vi.fn(),
      selectedAiAgentLabel: 'Claude',
    })

    expect(labelFor(viewCommands, 'view-editor')).toBe('仅编辑器')
    expect(labelFor(viewCommands, 'view-editor-list')).toBe('编辑器 + 笔记列表')
    expect(labelFor(viewCommands, 'view-all')).toBe('完整布局')
    expect(labelFor(viewCommands, 'toggle-inspector')).toBe('切换属性面板')
    expect(labelFor(viewCommands, 'toggle-diff')).toBe('切换差异模式')
    expect(labelFor(viewCommands, 'toggle-raw-editor')).toBe('切换原始编辑器')
    expect(labelFor(viewCommands, 'toggle-ai-panel')).toBe('切换 AI 面板')
    expect(labelFor(viewCommands, 'new-ai-chat')).toBe('新建 AI 聊天')
    expect(labelFor(viewCommands, 'toggle-backlinks')).toBe('切换反向链接')
    expect(labelFor(viewCommands, 'zoom-in')).toBe('放大 (100%)')
    expect(labelFor(viewCommands, 'zoom-out')).toBe('缩小 (100%)')
    expect(labelFor(viewCommands, 'zoom-reset')).toBe('重置缩放')

    expect(labelFor(navigationCommands, 'search-notes')).toBe('搜索笔记')
    expect(labelFor(navigationCommands, 'go-all')).toBe('前往所有笔记')
    expect(labelFor(navigationCommands, 'go-archived')).toBe('前往归档')
    expect(labelFor(navigationCommands, 'go-changes')).toBe('前往更改')
    expect(labelFor(navigationCommands, 'go-pulse')).toBe('前往历史')
    expect(labelFor(navigationCommands, 'go-back')).toBe('后退')
    expect(labelFor(navigationCommands, 'go-forward')).toBe('前进')
    expect(labelFor(navigationCommands, 'go-inbox')).toBe('前往收件箱')

    expect(labelFor(settingsCommands, 'open-settings')).toBe('打开设置')
    expect(labelFor(settingsCommands, 'open-h1-auto-rename-setting')).toBe('打开 H1 自动重命名设置')
    expect(labelFor(settingsCommands, 'open-contribute')).toBe('贡献')
    expect(labelFor(settingsCommands, 'check-updates')).toBe('检查更新')
    expect(labelFor(settingsCommands, 'create-empty-vault')).toBe('创建空 Vault…')
    expect(labelFor(settingsCommands, 'open-vault')).toBe('打开 Vault…')
    expect(labelFor(settingsCommands, 'remove-vault')).toBe('从列表移除 Vault')
    expect(labelFor(settingsCommands, 'restore-getting-started')).toBe('恢复入门 Vault')
    expect(labelFor(settingsCommands, 'install-mcp')).toBe('管理外部 AI 工具…')
    expect(labelFor(settingsCommands, 'reload-vault')).toBe('重新加载 Vault')
    expect(labelFor(settingsCommands, 'repair-vault')).toBe('修复 Vault')

    expect(labelFor(filterCommands, 'filter-open')).toBe('显示开放笔记')
    expect(labelFor(filterCommands, 'filter-archived')).toBe('显示归档笔记')

    expect(labelFor(aiAgentCommands, 'open-ai-agents')).toBe('打开 AI 代理')
    expect(labelFor(aiAgentCommands, 'switch-default-ai-agent')).toBe('切换默认 AI 代理 (Claude)')
  })
})
