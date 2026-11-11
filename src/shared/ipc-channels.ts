// Nomes dos canais IPC usados por main, preload e renderer.
export const IPC = {
  groups: {
    list: 'groups.list',
    create: 'groups.create',
    update: 'groups.update',
    remove: 'groups.remove',
    reorder: 'groups.reorder'
  },
  habits: {
    list: 'habits.list',
    create: 'habits.create',
    update: 'habits.update',
    archive: 'habits.archive',
    remove: 'habits.remove',
    reorder: 'habits.reorder'
  },
  completions: {
    range: 'completions.range',
    set: 'completions.set',
    clear: 'completions.clear'
  },
  stats: {
    habit: 'stats.habit',
    overview: 'stats.overview'
  },
  settings: {
    get: 'settings.get',
    set: 'settings.set'
  },
  data: {
    exportJson: 'data.exportJson',
    importJson: 'data.importJson',
    backupNow: 'data.backupNow'
  }
} as const
