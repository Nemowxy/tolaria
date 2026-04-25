import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CreateTypeDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => boolean | void | Promise<boolean | void>
  initialName?: string
}

interface CreateTypeDialogFormProps {
  initialName: string
  onClose: () => void
  onCreate: (name: string) => boolean | void | Promise<boolean | void>
}

function CreateTypeDialogForm({ initialName, onClose, onCreate }: CreateTypeDialogFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState(initialName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const created = await onCreate(trimmed)
    if (created !== false) onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t('createType.typeNameLabel')}
        </label>
        <Input
          autoFocus
          placeholder={t('createType.typeNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
        />
        <p className="text-xs text-muted-foreground">
          {t('createType.typeNameHint')}
        </p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          {t('common.create')}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CreateTypeDialog({ open, onClose, onCreate, initialName = '' }: CreateTypeDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false} className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>{t('createType.title')}</DialogTitle>
          <DialogDescription>
            {t('createType.description')}
          </DialogDescription>
        </DialogHeader>
        <CreateTypeDialogForm
          key={initialName}
          initialName={initialName}
          onClose={onClose}
          onCreate={onCreate}
        />
      </DialogContent>
    </Dialog>
  )
}
