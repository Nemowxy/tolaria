import { ArrowUpRight, Bot, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18next from '../i18n'
import type { ClaudeCodeStatus } from '../hooks/useClaudeCodeStatus'
import { openExternalUrl } from '../utils/url'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

const CLAUDE_CODE_INSTALL_URL = 'https://docs.anthropic.com/en/docs/claude-code'

interface ClaudeCodeOnboardingPromptProps {
  status: ClaudeCodeStatus
  onContinue: () => void
}

function getPromptCopy(status: ClaudeCodeStatus) {
  if (status === 'installed') {
    return {
      accentClassName: 'bg-[var(--feedback-success-bg)] text-[var(--feedback-success-text)]',
      description: i18next.t('onboarding.claudeCode.installed.description'),
      icon: <CheckCircle2 className="size-7" />,
      title: i18next.t('onboarding.claudeCode.installed.title'),
    }
  }

  if (status === 'missing') {
    return {
      accentClassName: 'bg-[var(--feedback-warning-bg)] text-[var(--feedback-warning-text)]',
      description: i18next.t('onboarding.claudeCode.missing.description'),
      icon: <Bot className="size-7" />,
      title: i18next.t('onboarding.claudeCode.missing.title'),
    }
  }

  return {
    accentClassName: 'bg-muted text-muted-foreground',
    description: i18next.t('onboarding.claudeCode.checkingStatus.description'),
    icon: <Loader2 className="size-7 animate-spin" />,
    title: i18next.t('onboarding.claudeCode.checkingStatus.title'),
  }
}

export function ClaudeCodeOnboardingPrompt({
  status,
  onContinue,
}: ClaudeCodeOnboardingPromptProps) {
  const { t } = useTranslation()
  const copy = getPromptCopy(status)

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-sidebar px-6 py-10"
      data-testid="claude-onboarding-screen"
    >
      <Card className="w-full max-w-2xl border-border bg-background shadow-sm">
        <CardHeader className="items-center gap-5 text-center">
          <div className={`flex size-16 items-center justify-center rounded-2xl ${copy.accentClassName}`}>
            {copy.icon}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              {copy.title}
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground" data-testid="claude-onboarding-description">
              {status === 'installed' && '✅ '}
              {status === 'missing' && '🤖 '}
              {copy.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-center">
          {status === 'missing' && (
            <p className="text-sm leading-6 text-muted-foreground">
              {t('onboarding.claudeCode.missing.installHint')}
            </p>
          )}
        </CardContent>

        <CardFooter className="justify-center gap-3">
          {status === 'missing' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => void openExternalUrl(CLAUDE_CODE_INSTALL_URL)}
              data-testid="claude-onboarding-install"
            >
              {t('onboarding.claudeCode.installButton')}
              <ArrowUpRight className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            onClick={onContinue}
            disabled={status === 'checking'}
            data-testid="claude-onboarding-continue"
          >
            {status === 'missing' ? t('onboarding.claudeCode.continueWithout') : status === 'installed' ? t('onboarding.claudeCode.continue') : t('onboarding.claudeCode.checking')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
