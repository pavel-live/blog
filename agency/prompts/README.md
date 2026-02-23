## Промпты агентов для блога

Эта папка содержит привязку ролей агентов к этому блогу и ссылки на исходные промпты из репозитория `agents`.

### Где лежат оригинальные промпты

Соседний репозиторий с полными текстами ролей:

- `../agents/00_agent_development.md`
- `../agents/01_orchestrator.md`
- `../agents/02_analyst_prompt.md`
- `../agents/03_tz_reviewer_prompt.md`
- `../agents/04_architect_prompt.md`
- `../agents/05_architecture_reviewer_prompt.md`
- `../agents/06_agent_planner.md`
- `../agents/07_agent_plan_reviewer.md`
- `../agents/08_agent_developer.md`
- `../agents/09_agent_code_reviewer.md`

### Как использовать из репозитория блога

В типичном сценарии:

1. Открываешь нужный файл из `../agents/...`.
2. Берёшь его как системный промпт / префикс для `cursor-agent` или Cursor.
3. Дополняешь ссылками на файлы из папки `agency/` этого блога (`PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`, конкретные задачи и т.д.).

Файлы в этой папке (`prompts/*.md`) дают краткое описание каждой роли применительно к блогу и пример команды запуска.

