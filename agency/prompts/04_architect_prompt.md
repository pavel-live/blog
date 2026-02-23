## 04_architect_prompt (архитектор)

Полный промпт: `../agents/04_architect_prompt.md`

Роль: спроектировать архитектурное решение под задачу блога на основе утверждённого ТЗ.

### Что давать архитектору

- Утверждённое ТЗ:  
  `agency/tz/...`
- Описание проекта:  
  `agency/PROJECT_OVERVIEW.md`
- Текущая архитектура:  
  `agency/ARCHITECTURE.md`

### Что ожидать

- Файл с архитектурой по фиче, например:  
  `agency/architecture/blog_feature_tags_ARCH_example.md`
- Возможные блокирующие вопросы по архитектуре.

### Пример текстового запроса

```text
Ты работаешь по промпту из ../agents/04_architect_prompt.md.

ТЗ: см. agency/tz/blog_feature_tags_TZ_example.md.
Описание проекта: см. agency/PROJECT_OVERVIEW.md.
Текущая архитектура: см. agency/ARCHITECTURE.md.

Спроектируй архитектуру решения для страницы тегов и сохрани её
в agency/architecture/blog_feature_tags_ARCH_YYYYMMDD.md.
Верни путь к файлу и список блокирующих вопросов (если есть).
```

