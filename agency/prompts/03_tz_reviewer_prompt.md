## 03_tz_reviewer_prompt (ревьюер ТЗ)

Полный промпт: `../agents/03_tz_reviewer_prompt.md`

Роль: проверить качество технического задания, которое подготовил аналитик.

### Что давать ревьюеру ТЗ

- Файл ТЗ из `agency/tz/`, например:  
  `agency/tz/blog_feature_tags_TZ_example.md`
- Описание проекта:  
  `agency/PROJECT_OVERVIEW.md`

### Что ожидать

- Файл с замечаниями по ТЗ (можно сохранять рядом, например):  
  `agency/tz/blog_feature_tags_TZ_review_1.md`
- Флаги/описание критичности замечаний.

### Пример текстового запроса

```text
Ты работаешь по промпту из ../agents/03_tz_reviewer_prompt.md.

Проверь ТЗ в agency/tz/blog_feature_tags_TZ_example.md
на полноту, непротиворечивость и соответствие описанию проекта
из agency/PROJECT_OVERVIEW.md.

Верни путь к файлу с review и отметь, есть ли критичные замечания.
```

