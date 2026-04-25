import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { McpStatus } from '../hooks/useMcpStatus'
import i18next from '../i18n'

interface McpSetupDialogProps {
  open: boolean
  status: McpStatus
  busyAction: 'connect' | 'disconnect' | null
  onClose: () => void
  onConnect: () => void
  onDisconnect: () => void
}

function isConnected(status: McpStatus): boolean {
  return status === 'installed'
}

function actionCopy(status: McpStatus) {
  if (isConnected(status)) {
    return {
      description: i18next.t('mcpSetup.connected.description'),
      primaryLabel: i18next.t('mcpSetup.connected.primaryLabel'),
      secondaryLabel: i18next.t('mcpSetup.connected.secondaryLabel'),
      title: i18next.t('mcpSetup.connected.title'),
    }
  }

  return {
    description: i18next.t('mcpSetup.notConnected.description'),
    primaryLabel: i18next.t('mcpSetup.notConnected.primaryLabel'),
    secondaryLabel: null,
    title: i18next.t('mcpSetup.notConnected.title'),
  }
}

export function McpSetupDialog({
  open,
  status,
  busyAction,
  onClose,
  onConnect,
  onDisconnect,
}: McpSetupDialogProps) {
  const { t } = useTranslation()
  const copy = actionCopy(status)
  const connectBusy = busyAction === 'connect'
  const disconnectBusy = busyAction === 'disconnect'
  const buttonsDisabled = busyAction !== null || status === 'checking'

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent showCloseButton={false} className="sm:max-w-[520px]" data-testid="mcp-setup-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck size={18} />
            {copy.title}
          </DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            {t('mcpSetup.body.entryFilesPrefix')} <code className="rounded bg-muted px-1 py-0.5 text-xs">tolaria</code> {t('mcpSetup.body.entryFilesSuffix')}
          </p>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-3 font-mono text-xs text-foreground">
            <div>~/.claude.json</div>
            <div>~/.claude/mcp.json</div>
            <div>~/.cursor/mcp.json</div>
          </div>
          <p>
            {t('mcpSetup.body.explanationPrefix')} <code className="rounded bg-muted px-1 py-0.5 text-xs">~/.claude.json</code>{t('mcpSetup.body.explanationSuffix')}
          </p>
        </div>

        <DialogFooter className="flex-row items-center justify-end gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={buttonsDisabled}>
            {t('mcpSetup.cancel')}
          </Button>
          {copy.secondaryLabel ? (
            <Button
              type="button"
              variant="destructive"
              onClick={onDisconnect}
              disabled={buttonsDisabled}
              data-testid="mcp-setup-disconnect"
            >
              {disconnectBusy ? t('mcpSetup.disconnecting') : copy.secondaryLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            autoFocus
            onClick={onConnect}
            disabled={buttonsDisabled}
            data-testid="mcp-setup-connect"
          >
            {connectBusy ? t('mcpSetup.connecting') : copy.primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
