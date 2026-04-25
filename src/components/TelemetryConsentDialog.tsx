import { ShieldCheck } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { OnboardingShell } from './OnboardingShell'
import { Button } from './ui/button'

interface TelemetryConsentDialogProps {
  onAccept: () => void
  onDecline: () => void
}

export function TelemetryConsentDialog({ onAccept, onDecline }: TelemetryConsentDialogProps) {
  const { t } = useTranslation()

  return (
    <OnboardingShell
      className="fixed inset-0 z-50"
      contentClassName="w-full rounded-lg border border-border bg-background shadow-[0_18px_55px_var(--shadow-dialog)]"
      style={{ background: 'var(--shadow-overlay)' }}
      contentStyle={{
        width: 'min(440px, 100%)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
      }}
      testId="telemetry-consent-shell"
    >
      <>
        <ShieldCheck size={40} weight="duotone" style={{ color: 'var(--primary)' }} />

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
            {t('telemetry.title')}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.6, marginTop: 8 }}>
            {t('telemetry.body')}
          </p>
        </div>

        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.6, width: '100%' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 500, color: 'var(--foreground)' }}>{t('telemetry.whatWeCollect')}</p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>{t('telemetry.collectStackTraces')}</li>
            <li>{t('telemetry.collectAppVersion')}</li>
          </ul>
          <p style={{ margin: '10px 0 6px', fontWeight: 500, color: 'var(--foreground)' }}>{t('telemetry.whatWeNeverCollect')}</p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>{t('telemetry.neverCollectVault')}</li>
            <li>{t('telemetry.neverCollectPersonal')}</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 4 }}>
          <Button
            type="button"
            variant="outline"
            style={{ flex: 1, fontSize: 13, padding: '10px 16px' }}
            onClick={onDecline}
            data-testid="telemetry-decline"
            autoFocus
          >
            {t('telemetry.noThanks')}
          </Button>
          <Button
            type="button"
            style={{ flex: 1, fontSize: 13, padding: '10px 16px', fontWeight: 500 }}
            onClick={onAccept}
            data-testid="telemetry-accept"
          >
            {t('telemetry.allowReporting')}
          </Button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--muted-foreground)', margin: 0, textAlign: 'center' }}>
          {t('telemetry.changeAnytime')}
        </p>
      </>
    </OnboardingShell>
  )
}
