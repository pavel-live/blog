## 05_architecture_reviewer_prompt (ревьюер архитектуры)

Полный промпт: `../agents/05_architecture_reviewer_prompt.md`

Роль: проверить архитектурное решение на соответствие ТЗ и текущему устройству блога.

### Что давать ревьюеру архитектуры

- Файл архитектуры:  
  `agency/architecture/...`
- ТЗ:  
  `agency/tz/...`
- Описание проекта и общая архитектура:  
  `agency/PROJECT_OVERVIEW.md`, `agency/ARCHITECTURE.md`

### Что ожидать

- Файл с review архитектуры, например:  
  `agency/architecture/blog_feature_tags_ARCH_review_1.md`
- Отметки о критичности замечаний.

### Пример текстового запроса

```text
Ты работаешь по промпту из ../agents/05_architecture_reviewer_prompt.md.

Проверь архитектуру из agency/architecture/blog_feature_tags_ARCH_example.md
на соответствие ТЗ (agency/tz/blog_feature_tags_TZ_example.md)
и текущей архитектуре блога (agency/ARCHITECTURE.md).

Сформируй файл review в agency/architecture/blog_feature_tags_ARCH_review_1.md
и отметь, есть ли критичные замечания.
```

