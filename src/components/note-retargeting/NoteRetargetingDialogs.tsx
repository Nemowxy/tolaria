import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { VaultEntry } from '../../types'
import type { RetargetOption } from './RetargetNoteDialog'
import { RetargetNoteDialog } from './RetargetNoteDialog'

interface NoteRetargetingDialogsProps {
  dialogState: { kind: 'type' | 'folder'; notePath: string } | null
  dialogEntry: VaultEntry | null
  typeOptions: RetargetOption[]
  folderOptions: RetargetOption[]
  onClose: () => void
  onSelectType: (type: string) => boolean | Promise<boolean>
  onSelectFolder: (folderPath: string) => boolean | Promise<boolean>
}

function typeDialogDescription(entry: VaultEntry | null, t: TFunction): string {
  return entry
    ? t('noteRetargeting.typeDescriptionWithEntry', { title: entry.title })
    : t('noteRetargeting.typeDescriptionWithoutEntry')
}

function folderDialogDescription(entry: VaultEntry | null, t: TFunction): string {
  return entry
    ? t('noteRetargeting.folderDescriptionWithEntry', { title: entry.title })
    : t('noteRetargeting.folderDescriptionWithoutEntry')
}

export function NoteRetargetingDialogs({
  dialogState,
  dialogEntry,
  typeOptions,
  folderOptions,
  onClose,
  onSelectType,
  onSelectFolder,
}: NoteRetargetingDialogsProps) {
  const { t } = useTranslation()
  return (
    <>
      <RetargetNoteDialog
        open={dialogState?.kind === 'type'}
        title={t('noteRetargeting.changeNoteTypeTitle')}
        description={typeDialogDescription(dialogEntry, t)}
        searchPlaceholder={t('noteRetargeting.searchTypes')}
        emptyMessage={t('noteRetargeting.noTypesAvailable')}
        options={typeOptions}
        onClose={onClose}
        onSelect={onSelectType}
        testIdPrefix="retarget-note-type"
      />
      <RetargetNoteDialog
        open={dialogState?.kind === 'folder'}
        title={t('noteRetargeting.moveToFolderTitle')}
        description={folderDialogDescription(dialogEntry, t)}
        searchPlaceholder={t('noteRetargeting.searchFolders')}
        emptyMessage={t('noteRetargeting.noFoldersAvailable')}
        options={folderOptions}
        onClose={onClose}
        onSelect={onSelectFolder}
        testIdPrefix="retarget-note-folder"
      />
    </>
  )
}
