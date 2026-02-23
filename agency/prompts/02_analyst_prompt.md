## 02_analyst_prompt (аналитик)

Полный промпт: `../agents/02_analyst_prompt.md`

Роль: создать детальное **ТЗ** для задачи блога на основе краткой постановки.

### Что давать аналитику

- Файл задачи из `agency/tasks/`, например:  
  `agency/tasks/blog_feature_tags_example.md`
- Описание проекта:  
  `agency/PROJECT_OVERVIEW.md`
- (Опционально) выдержки из `CONTENT_RULES.md`, если задача затрагивает структуру контента.

### Что ожидать от аналитика

- Файл ТЗ в `agency/tz/`, например:  
  `agency/tz/blog_feature_tags_TZ_YYYYMMDD.md`
- Список блокирующих вопросов в том же файле или отдельным списком.

### Пример текстового запроса к аналитику

```text
Ты работаешь по промпту из ../agents/02_analyst_prompt.md.

Постановка задачи: см. файл agency/tasks/blog_feature_tags_example.md.
Описание проекта: см. agency/PROJECT_OVERVIEW.md.
Правила контента и SEO: см. agency/CONTENT_RULES.md.

Сформируй ТЗ в отдельном md-файле в папке agency/tz/ и верни путь к нему
и список блокирующих вопросов (если они есть).
```

