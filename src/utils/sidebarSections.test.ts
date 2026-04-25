import { describe, it, expect, beforeEach } from 'vitest'
import i18next from '../i18n'
import { getBuiltInSectionGroups } from './sidebarSections'

describe('getBuiltInSectionGroups i18n', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('returns English labels when language is en', async () => {
    await i18next.changeLanguage('en')
    const groups = getBuiltInSectionGroups()

    expect(groups.find(g => g.type === 'Project')?.label).toBe('Projects')
    expect(groups.find(g => g.type === 'Experiment')?.label).toBe('Experiments')
    expect(groups.find(g => g.type === 'Responsibility')?.label).toBe('Responsibilities')
    expect(groups.find(g => g.type === 'Procedure')?.label).toBe('Procedures')
    expect(groups.find(g => g.type === 'Person')?.label).toBe('People')
    expect(groups.find(g => g.type === 'Event')?.label).toBe('Events')
    expect(groups.find(g => g.type === 'Topic')?.label).toBe('Topics')
    expect(groups.find(g => g.type === 'Type')?.label).toBe('Types')
  })

  it('returns Chinese labels when language is zh', async () => {
    await i18next.changeLanguage('zh')
    const groups = getBuiltInSectionGroups()

    expect(groups.find(g => g.type === 'Project')?.label).toBe('项目')
    expect(groups.find(g => g.type === 'Experiment')?.label).toBe('实验')
    expect(groups.find(g => g.type === 'Responsibility')?.label).toBe('职责')
    expect(groups.find(g => g.type === 'Procedure')?.label).toBe('流程')
    expect(groups.find(g => g.type === 'Person')?.label).toBe('人物')
    expect(groups.find(g => g.type === 'Event')?.label).toBe('事件')
    expect(groups.find(g => g.type === 'Topic')?.label).toBe('主题')
    expect(groups.find(g => g.type === 'Type')?.label).toBe('类型')
  })

  it('updates labels when language changes', async () => {
    await i18next.changeLanguage('en')
    let groups = getBuiltInSectionGroups()
    expect(groups.find(g => g.type === 'Project')?.label).toBe('Projects')

    await i18next.changeLanguage('zh')
    groups = getBuiltInSectionGroups()
    expect(groups.find(g => g.type === 'Project')?.label).toBe('项目')
  })
})
