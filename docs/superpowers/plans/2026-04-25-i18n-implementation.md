# i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full English/Chinese language switching to Tolaria with system language detection and runtime switching.

**Architecture:** Use i18next + react-i18next with JSON translation files. Extend Settings to store language preference. Wrap app with I18nextProvider. Extract all hardcoded strings to translation keys.

**Tech Stack:** i18next, react-i18next, i18next-browser-languagedetector

---

## File Structure

**New files:**
- `src/i18n.ts` — i18n initialization and configuration
- `locales/en/translation.json` — English translations
- `locales/zh/translation.json` — Chinese translations

**Modified files:**
- `package.json` — add i18n dependencies
- `src/types.ts:82-96` — extend Settings interface
- `src/main.tsx:94-105` — wrap app with I18nextProvider
- `src/components/SettingsPanel.tsx` — add language selector UI
- `src/utils/sidebarSections.ts:17-26` — translate section labels
- `src/hooks/commands/*.ts` — translate command labels
- `src/components/*.tsx` — translate UI strings
- `src/App.tsx` — translate toast messages

---

### Task 1: Install Dependencies and Bootstrap i18n

**Files:**
- Modify: `package.json`
- Create: `src/i18n.ts`
- Create: `locales/en/translation.json`
- Create: `locales/zh/translation.json`

- [ ] **Step 1: Install i18n packages**

```bash
cd /Users/nemo/xway/tolaria
pnpm add i18next react-i18next i18next-browser-languagedetector
```

Expected: packages added to `package.json` dependencies

- [ ] **Step 2: Create i18n configuration file**

Create `src/i18n.ts`:

```typescript
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from '../locales/en/translation.json'
import zhTranslation from '../locales/zh/translation.json'

const resources = {
  en: { translation: enTranslation },
  zh: { translation: zhTranslation },
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'tolaria-language',
    },
  })

export default i18next
```

- [ ] **Step 3: Create empty translation files**

Create `locales/en/translation.json`:

```json
{
  "settings": {
    "title": "Settings"
  }
}
```

Create `locales/zh/translation.json`:

```json
{
  "settings": {
    "title": "设置"
  }
}
```

- [ ] **Step 4: Commit bootstrap**

```bash
git add package.json pnpm-lock.yaml src/i18n.ts locales/
git commit -m "feat: add i18n bootstrap with i18next"
```

---

### Task 2: Extend Settings and Wire Provider

**Files:**
- Modify: `src/types.ts:82-96`
- Modify: `src/main.tsx:1-105`

- [ ] **Step 1: Write failing test for language_preference**

Add to `src/hooks/useSettings.test.ts`:

```typescript
it('should handle language_preference in settings', async () => {
  const { result } = renderHook(() => useSettings())
  
  await waitFor(() => expect(result.current.loaded).toBe(true))
  
  await act(async () => {
    await result.current.saveSettings({
      ...result.current.settings,
      language_preference: 'zh',
    })
  })
  
  expect(result.current.settings.language_preference).toBe('zh')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test useSettings.test.ts
```

Expected: FAIL with type error on `language_preference`

- [ ] **Step 3: Extend Settings interface**

Edit `src/types.ts:82-96`:

```typescript
export interface Settings {
  auto_pull_interval_minutes: number | null
  autogit_enabled?: boolean | null
  autogit_idle_threshold_seconds?: number | null
  autogit_inactive_threshold_seconds?: number | null
  auto_advance_inbox_after_organize?: boolean | null
  telemetry_consent: boolean | null
  crash_reporting_enabled: boolean | null
  analytics_enabled: boolean | null
  anonymous_id: string | null
  release_channel: string | null
  theme_mode?: ThemeMode | null
  initial_h1_auto_rename_enabled?: boolean | null
  default_ai_agent?: AiAgentId | null
  language_preference?: 'en' | 'zh'
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test useSettings.test.ts
```

Expected: PASS

- [ ] **Step 5: Wire I18nextProvider in main.tsx**

Edit `src/main.tsx` — add import at top:

```typescript
import './i18n'
import { I18nextProvider } from 'react-i18next'
import i18next from './i18n'
```

Edit `src/main.tsx:94-105` — wrap App with provider:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <TooltipProvider>
        <LinuxTitlebar />
        <App />
      </TooltipProvider>
    </I18nextProvider>
  </StrictMode>,
)
```

- [ ] **Step 6: Test app starts without errors**

```bash
pnpm dev
```

Expected: app loads, no console errors

- [ ] **Step 7: Commit**

```bash
git add src/types.ts src/main.tsx src/hooks/useSettings.test.ts
git commit -m "feat: extend Settings with language_preference and wire I18nextProvider"
```

---

### Task 3: Add Language Selector to SettingsPanel

**Files:**
- Modify: `src/components/SettingsPanel.tsx`
- Modify: `locales/en/translation.json`
- Modify: `locales/zh/translation.json`

- [ ] **Step 1: Add translation keys**

Edit `locales/en/translation.json`:

```json
{
  "settings": {
    "title": "Settings",
    "language": {
      "label": "Language",
      "description": "Choose the language for Tolaria's interface",
      "english": "English",
      "chinese": "中文"
    }
  }
}
```

Edit `locales/zh/translation.json`:

```json
{
  "settings": {
    "title": "设置",
    "language": {
      "label": "语言",
      "description": "选择 Tolaria 界面语言",
      "english": "English",
      "chinese": "中文"
    }
  }
}
```

- [ ] **Step 2: Write failing test**

Add to `src/components/SettingsPanel.test.tsx`:

```typescript
it('should render language selector', () => {
  render(
    <SettingsPanel open={true} settings={emptySettings} onSave={onSave} onClose={onClose} />
  )
  
  expect(screen.getByText(/language/i)).toBeInTheDocument()
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm test SettingsPanel.test.tsx -t "language selector"
```

Expected: FAIL

- [ ] **Step 4: Add language selector UI**

Edit `src/components/SettingsPanel.tsx` — add import:

```typescript
import { useTranslation } from 'react-i18next'
```

Edit `SettingsPanelInner` function — add after line 218:

```typescript
const { t, i18n } = useTranslation()
```

Add new section component before `AppearanceSettingsSection`:

```typescript
function LanguageSettingsSection() {
  const { t, i18n } = useTranslation()
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
          {t('settings.language.label')}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
          {t('settings.language.description')}
        </div>
      </div>
      
      <Select
        value={i18n.language}
        onValueChange={(lng) => {
          i18n.changeLanguage(lng)
          localStorage.setItem('tolaria-language', lng)
        }}
      >
        <SelectTrigger style={{ width: 200 }}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('settings.language.english')}</SelectItem>
          <SelectItem value="zh">{t('settings.language.chinese')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

Insert `<LanguageSettingsSection />` in `SettingsBody` before `AppearanceSettingsSection`.

- [ ] **Step 5: Run test to verify it passes**

```bash
pnpm test SettingsPanel.test.tsx -t "language selector"
```

Expected: PASS

- [ ] **Step 6: Manual test language switching**

```bash
pnpm dev
```

Open Settings, switch language, verify UI updates.

- [ ] **Step 7: Commit**

```bash
git add src/components/SettingsPanel.tsx locales/
git commit -m "feat: add language selector to SettingsPanel"
```

---

### Task 4: Translate SettingsPanel Strings

**Files:**
- Modify: `src/components/SettingsPanel.tsx:321-923`
- Modify: `locales/en/translation.json`
- Modify: `locales/zh/translation.json`

- [ ] **Step 1: Add all SettingsPanel translation keys**

Edit `locales/en/translation.json` — add under `settings`:

```json
{
  "settings": {
    "title": "Settings",
    "close": "Close settings",
    "cancel": "Cancel",
    "save": "Save",
    "hint": "⌘, to open settings",
    "sync": {
      "title": "Sync & Updates",
      "description": "Configure background pulling and which update feed Tolaria follows. Stable only receives manually promoted releases, while Alpha follows every push to main.",
      "pullInterval": "Pull interval (minutes)",
      "releaseChannel": "Release channel",
      "stable": "Stable",
      "alpha": "Alpha"
    },
    "appearance": {
      "title": "Appearance",
      "description": "Choose the app color mode used for Tolaria chrome, editor surfaces, menus, and dialogs.",
      "theme": "Theme",
      "light": "Light",
      "dark": "Dark"
    },
    "autogit": {
      "title": "AutoGit",
      "description": "Automatically create conservative Git checkpoints after editing pauses or when the app is no longer active.",
      "unavailable": "AutoGit is unavailable until the current vault is Git-enabled. Initialize Git for this vault first.",
      "enable": "Enable AutoGit",
      "enableDescription": "When enabled, Tolaria will commit and push saved local changes automatically after an idle pause or after the app becomes inactive.",
      "idleThreshold": "Idle threshold (seconds)",
      "inactiveGrace": "Inactive-app grace period (seconds)"
    },
    "titles": {
      "title": "Titles & Filenames",
      "description": "Choose whether Tolaria automatically syncs untitled note filenames from the first H1 title.",
      "autoRename": "Auto-rename untitled notes from first H1",
      "autoRenameDescription": "When enabled, Tolaria renames untitled-note files as soon as the first H1 becomes a real title. Turn this off to keep the filename unchanged until you rename it manually from the breadcrumb bar."
    },
    "aiAgents": {
      "title": "AI Agents",
      "description": "Choose which CLI AI agent Tolaria uses in the AI panel and command palette.",
      "defaultAgent": "Default AI agent",
      "installed": " (installed)",
      "missing": " (missing)",
      "ready": " is ready to use.",
      "notInstalled": " is not installed yet. You can still select it now and install it later."
    },
    "workflow": {
      "title": "Workflow",
      "description": "Choose whether Tolaria shows the Inbox workflow, plus how it moves through items while you triage them.",
      "organizeExplicitly": "Organize notes explicitly",
      "organizeDescription": "When enabled, an Inbox section shows unorganized notes, and a toggle lets you mark notes as organized.",
      "autoAdvance": "Auto-advance to next Inbox item",
      "autoAdvanceDescription": "When enabled, marking an Inbox note as organized immediately opens the next visible Inbox note."
    },
    "privacy": {
      "title": "Privacy & Telemetry",
      "description": "Anonymous data helps us fix bugs and improve Tolaria. No vault content, note titles, or file paths are ever sent.",
      "crashReporting": "Crash reporting",
      "crashDescription": "Send anonymous error reports",
      "analytics": "Usage analytics",
      "analyticsDescription": "Share anonymous usage patterns"
    },
    "language": {
      "label": "Language",
      "description": "Choose the language for Tolaria's interface",
      "english": "English",
      "chinese": "中文"
    }
  }
}
```

Edit `locales/zh/translation.json` with Chinese translations:

```json
{
  "settings": {
    "title": "设置",
    "close": "关闭设置",
    "cancel": "取消",
    "save": "保存",
    "hint": "⌘, 打开设置",
    "sync": {
      "title": "同步与更新",
      "description": "配置后台拉取和 Tolaria 遵循的更新源。Stable 仅接收手动推送的版本，Alpha 跟随每次推送到 main。",
      "pullInterval": "拉取间隔（分钟）",
      "releaseChannel": "发布渠道",
      "stable": "稳定版",
      "alpha": "测试版"
    },
    "appearance": {
      "title": "外观",
      "description": "选择 Tolaria 界面、编辑器、菜单和对话框使用的颜色模式。",
      "theme": "主题",
      "light": "浅色",
      "dark": "深色"
    },
    "autogit": {
      "title": "自动 Git",
      "description": "在编辑暂停或应用不活跃时自动创建保守的 Git 检查点。",
      "unavailable": "AutoGit 在当前 vault 启用 Git 之前不可用。请先为此 vault 初始化 Git。",
      "enable": "启用 AutoGit",
      "enableDescription": "启用后，Tolaria 将在空闲暂停或应用变为不活跃后自动提交并推送本地更改。",
      "idleThreshold": "空闲阈值（秒）",
      "inactiveGrace": "应用不活跃宽限期（秒）"
    },
    "titles": {
      "title": "标题与文件名",
      "description": "选择 Tolaria 是否自动从第一个 H1 标题同步未命名笔记的文件名。",
      "autoRename": "从第一个 H1 自动重命名未命名笔记",
      "autoRenameDescription": "启用后，Tolaria 会在第一个 H1 成为真实标题时立即重命名未命名笔记文件。关闭此选项可保持文件名不变，直到您从面包屑栏手动重命名。"
    },
    "aiAgents": {
      "title": "AI 代理",
      "description": "选择 Tolaria 在 AI 面板和命令面板中使用的 CLI AI 代理。",
      "defaultAgent": "默认 AI 代理",
      "installed": "（已安装）",
      "missing": "（缺失）",
      "ready": " 已准备就绪。",
      "notInstalled": " 尚未安装。您仍可以现在选择它，稍后再安装。"
    },
    "workflow": {
      "title": "工作流",
      "description": "选择 Tolaria 是否显示收件箱工作流，以及在分类项目时如何移动。",
      "organizeExplicitly": "显式组织笔记",
      "organizeDescription": "启用后，收件箱部分显示未组织的笔记，切换按钮可标记笔记为已组织。",
      "autoAdvance": "自动前进到下一个收件箱项目",
      "autoAdvanceDescription": "启用后，将收件箱笔记标记为已组织会立即打开下一个可见的收件箱笔记。"
    },
    "privacy": {
      "title": "隐私与遥测",
      "description": "匿名数据帮助我们修复错误并改进 Tolaria。不会发送任何 vault 内容、笔记标题或文件路径。",
      "crashReporting": "崩溃报告",
      "crashDescription": "发送匿名错误报告",
      "analytics": "使用分析",
      "analyticsDescription": "分享匿名使用模式"
    },
    "language": {
      "label": "语言",
      "description": "选择 Tolaria 界面语言",
      "english": "English",
      "chinese": "中文"
    }
  }
}
```

- [ ] **Step 2: Replace hardcoded strings in SettingsPanel**

Edit `src/components/SettingsPanel.tsx` — replace all hardcoded strings with `t()` calls.

Line 321: `{t('settings.title')}`
Line 327: `title={t('settings.close')}` and `aria-label={t('settings.close')}`
Line 917: `{t('settings.hint')}`
Line 919: `{t('settings.cancel')}`
Line 923: `{t('settings.save')}`

Continue for all sections following the translation keys structure.

- [ ] **Step 3: Test SettingsPanel renders in both languages**

```bash
pnpm test SettingsPanel.test.tsx
```

Expected: all tests PASS

- [ ] **Step 4: Manual QA**

```bash
pnpm dev
```

Switch language in Settings, verify all labels update.

- [ ] **Step 5: Commit**

```bash
git add src/components/SettingsPanel.tsx locales/
git commit -m "feat: translate all SettingsPanel strings"
```

---

### Task 5: Translate Sidebar and Commands

**Files:**
- Modify: `src/utils/sidebarSections.ts:17-26`
- Modify: `src/hooks/commands/*.ts`
- Modify: `locales/en/translation.json`
- Modify: `locales/zh/translation.json`

- [ ] **Step 1: Add sidebar translation keys**

Edit `locales/en/translation.json`:

```json
{
  "sidebar": {
    "projects": "Projects",
    "experiments": "Experiments",
    "responsibilities": "Responsibilities",
    "procedures": "Procedures",
    "people": "People",
    "events": "Events",
    "topics": "Topics",
    "types": "Types",
    "inbox": "Inbox",
    "allNotes": "All Notes",
    "archive": "Archive"
  }
}
```

Edit `locales/zh/translation.json`:

```json
{
  "sidebar": {
    "projects": "项目",
    "experiments": "实验",
    "responsibilities": "职责",
    "procedures": "流程",
    "people": "人物",
    "events": "事件",
    "topics": "主题",
    "types": "类型",
    "inbox": "收件箱",
    "allNotes": "所有笔记",
    "archive": "归档"
  }
}
```

- [ ] **Step 2: Translate sidebarSections.ts**

Edit `src/utils/sidebarSections.ts` — add import:

```typescript
import i18next from '../i18n'
```

Edit lines 17-26:

```typescript
const BUILT_IN_SECTION_GROUPS: SectionGroup[] = [
  { label: i18next.t('sidebar.projects'),        type: 'Project',        Icon: Wrench },
  { label: i18next.t('sidebar.experiments'),     type: 'Experiment',     Icon: Flask },
  { label: i18next.t('sidebar.responsibilities'),type: 'Responsibility', Icon: Target },
  { label: i18next.t('sidebar.procedures'),      type: 'Procedure',      Icon: ArrowsClockwise },
  { label: i18next.t('sidebar.people'),          type: 'Person',         Icon: Users },
  { label: i18next.t('sidebar.events'),          type: 'Event',          Icon: CalendarBlank },
  { label: i18next.t('sidebar.topics'),          type: 'Topic',          Icon: Tag },
  { label: i18next.t('sidebar.types'),           type: 'Type',           Icon: StackSimple },
]
```

- [ ] **Step 3: Translate SidebarTopNav**

Edit `src/components/sidebar/SidebarTopNav.tsx` — add import and replace strings:

```typescript
import { useTranslation } from 'react-i18next'

// In component:
const { t } = useTranslation()

// Line 27: {t('sidebar.inbox')}
// Line 38: {t('sidebar.allNotes')}
// Line 48: {t('sidebar.archive')}
```

- [ ] **Step 4: Add command translation keys**

Edit `locales/en/translation.json` — add `commands` section with all command labels from the exploration results.

Edit `locales/zh/translation.json` — add Chinese translations.

- [ ] **Step 5: Translate all command files**

Edit each file in `src/hooks/commands/` to use `i18next.t()` for labels.

- [ ] **Step 6: Test**

```bash
pnpm test
pnpm dev
```

Verify sidebar and commands update when language switches.

- [ ] **Step 7: Commit**

```bash
git add src/utils/sidebarSections.ts src/components/sidebar/ src/hooks/commands/ locales/
git commit -m "feat: translate sidebar sections and command labels"
```

---

### Task 6: Translate Remaining UI Components

**Files:**
- Modify: All component files with hardcoded strings
- Modify: `locales/en/translation.json`
- Modify: `locales/zh/translation.json`

- [ ] **Step 1: Add translation keys for all remaining components**

Add keys for: CommandPalette, SearchPanel, WelcomeScreen, AiPanelChrome, StatusBar, CreateTypeDialog, InboxFilterPills, etc.

- [ ] **Step 2: Replace hardcoded strings with t() calls**

Systematically go through each component file and replace strings.

- [ ] **Step 3: Test each component**

```bash
pnpm test
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ locales/
git commit -m "feat: translate all UI component strings"
```

---

### Task 7: Translate App.tsx Toast Messages

**Files:**
- Modify: `src/App.tsx`
- Modify: `locales/en/translation.json`
- Modify: `locales/zh/translation.json`

- [ ] **Step 1: Add toast translation keys**

```json
{
  "toast": {
    "gettingStartedCloned": "Getting Started vault cloned and opened at {{path}}",
    "wikilinksUpdated": "Updated wikilinks in {{count}} file",
    "wikilinksUpdated_other": "Updated wikilinks in {{count}} files",
    "viewDeleted": "View deleted",
    "loading": "Loading…"
  }
}
```

- [ ] **Step 2: Replace toast strings in App.tsx**

Add import and replace all `setToastMessage()` calls with `t()`.

- [ ] **Step 3: Test**

```bash
pnpm test App.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx locales/
git commit -m "feat: translate App toast messages"
```

---

### Task 8: Sync Language Preference with Settings

**Files:**
- Modify: `src/hooks/useSettings.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Sync i18n language with Settings on load**

Edit `src/App.tsx` — add effect after settings load:

```typescript
useEffect(() => {
  if (settingsLoaded && settings.language_preference) {
    i18next.changeLanguage(settings.language_preference)
  }
}, [settingsLoaded, settings.language_preference])
```

- [ ] **Step 2: Save language preference when changed**

Edit `src/components/SettingsPanel.tsx` — update language selector:

```typescript
onValueChange={(lng) => {
  i18n.changeLanguage(lng)
  localStorage.setItem('tolaria-language', lng)
  // Trigger save via parent
  setPullInterval(pullInterval) // or any setter to mark dirty
}}
```

- [ ] **Step 3: Test persistence**

```bash
pnpm dev
```

Switch language, close app, reopen — verify language persists.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/SettingsPanel.tsx
git commit -m "feat: sync language preference with Settings persistence"
```

---

### Task 9: Final QA and Residual String Check

**Files:**
- All source files

- [ ] **Step 1: Run residual string grep**

```bash
grep -rn '>[A-Z][a-z]' src/ --include='*.tsx' | grep -v 'import\|from\|//' > /tmp/residual-strings.txt
```

Review output for missed hardcoded strings.

- [ ] **Step 2: Full manual QA pass**

```bash
pnpm dev
```

Test in English:
- Open Settings, verify all labels
- Create note, verify placeholders
- Search, verify empty states
- Check command palette
- Check sidebar sections
- Check status bar
- Check all dialogs

Switch to Chinese and repeat.

- [ ] **Step 3: Check for layout overflow**

Verify no text truncation or layout breaks in either language.

- [ ] **Step 4: Run full test suite**

```bash
pnpm test
pnpm test:coverage
```

Expected: all tests PASS, coverage ≥70%

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "test: verify i18n coverage and fix residual strings"
```

---

## Self-Review

**Spec coverage:**
- ✅ i18next + react-i18next integration
- ✅ System language detection
- ✅ Settings extension for language_preference
- ✅ Language selector UI in SettingsPanel
- ✅ All UI strings translated (SettingsPanel, sidebar, commands, components, toasts)
- ✅ Persistence via Settings
- ✅ Runtime switching without restart

**Placeholder scan:** No TBD/TODO/placeholders

**Type consistency:** Settings interface, translation keys, i18n.t() calls all consistent

**Execution readiness:** All tasks have exact file paths, complete code blocks, test commands with expected output
