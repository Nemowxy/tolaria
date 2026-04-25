import {
  AI_AGENT_DEFINITIONS,
  isAiAgentInstalled,
  type AiAgentId,
  type AiAgentsStatus,
} from '../../lib/aiAgents'
import {
  isVaultAiGuidanceStatusChecking,
  vaultAiGuidanceNeedsRestore,
  type VaultAiGuidanceStatus,
} from '../../lib/vaultAiGuidance'
import type { CommandAction } from './types'
import i18next from '../../i18n'

interface AiAgentCommandsConfig {
  aiAgentsStatus?: AiAgentsStatus
  vaultAiGuidanceStatus?: VaultAiGuidanceStatus
  selectedAiAgent?: AiAgentId
  selectedAiAgentLabel?: string
  onOpenAiAgents?: () => void
  onRestoreVaultAiGuidance?: () => void
  onCycleDefaultAiAgent?: () => void
  onSetDefaultAiAgent?: (agent: AiAgentId) => void
}

function explicitSwitchCommands({
  aiAgentsStatus,
  selectedAiAgent,
  onSetDefaultAiAgent,
}: Pick<AiAgentCommandsConfig, 'aiAgentsStatus' | 'selectedAiAgent' | 'onSetDefaultAiAgent'>): CommandAction[] {
  if (!aiAgentsStatus || !selectedAiAgent || !onSetDefaultAiAgent) return []

  return AI_AGENT_DEFINITIONS
    .filter((definition) => definition.id !== selectedAiAgent)
    .filter((definition) => isAiAgentInstalled(aiAgentsStatus, definition.id))
    .map((definition) => ({
      id: `switch-ai-agent-${definition.id}`,
      label: `${i18next.t('commands.switchAiAgentTo')} ${definition.label}`,
      group: 'Settings' as const,
      keywords: ['ai', 'agent', 'default', 'switch', 'claude', 'codex', definition.shortLabel.toLowerCase()],
      enabled: true,
      execute: () => onSetDefaultAiAgent(definition.id),
    }))
}

function restoreGuidanceCommands({
  vaultAiGuidanceStatus,
  onRestoreVaultAiGuidance,
}: Pick<AiAgentCommandsConfig, 'vaultAiGuidanceStatus' | 'onRestoreVaultAiGuidance'>): CommandAction[] {
  if (!vaultAiGuidanceStatus || !onRestoreVaultAiGuidance) return []
  if (isVaultAiGuidanceStatusChecking(vaultAiGuidanceStatus)) return []
  if (!vaultAiGuidanceNeedsRestore(vaultAiGuidanceStatus)) return []

  return [
    {
      id: 'restore-vault-ai-guidance',
      label: i18next.t('commands.restoreTolariaAiGuidance'),
      group: 'Settings',
      keywords: ['ai', 'agent', 'guidance', 'restore', 'repair', 'claude', 'codex', 'agents'],
      enabled: true,
      execute: () => onRestoreVaultAiGuidance(),
    },
  ]
}

export function buildAiAgentCommands({
  aiAgentsStatus,
  vaultAiGuidanceStatus,
  selectedAiAgent,
  selectedAiAgentLabel,
  onOpenAiAgents,
  onRestoreVaultAiGuidance,
  onCycleDefaultAiAgent,
  onSetDefaultAiAgent,
}: AiAgentCommandsConfig): CommandAction[] {
  const commands: CommandAction[] = [
    {
      id: 'open-ai-agents',
      label: i18next.t('commands.openAiAgents'),
      group: 'Settings',
      keywords: ['ai', 'agent', 'agents', 'assistant', 'claude', 'codex', 'settings'],
      enabled: !!onOpenAiAgents,
      execute: () => onOpenAiAgents?.(),
    },
  ]

  commands.push(...restoreGuidanceCommands({
    vaultAiGuidanceStatus,
    onRestoreVaultAiGuidance,
  }))

  const switchCommands = explicitSwitchCommands({
    aiAgentsStatus,
    selectedAiAgent,
    onSetDefaultAiAgent,
  })
  if (aiAgentsStatus && selectedAiAgent) {
    return [...commands, ...switchCommands]
  }

  commands.push({
    id: 'switch-default-ai-agent',
    label: selectedAiAgentLabel ? `${i18next.t('commands.switchDefaultAiAgent')} (${selectedAiAgentLabel})` : i18next.t('commands.switchDefaultAiAgent'),
    group: 'Settings',
    keywords: ['ai', 'agent', 'default', 'switch', 'claude', 'codex'],
    enabled: !!onCycleDefaultAiAgent,
    execute: () => onCycleDefaultAiAgent?.(),
  })

  return commands
}
