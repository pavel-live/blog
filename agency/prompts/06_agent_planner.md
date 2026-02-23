## 06_agent_planner (техлид‑планировщик)

Полный промпт: `../agents/06_agent_planner.md`

Роль: на основе ТЗ и архитектуры разложить работу на конкретные задачи для разработчика.

### Что давать планировщику

- Утверждённое ТЗ:  
  `agency/tz/...`
- Утверждённая архитектура по фиче:  
  `agency/architecture/...`
- При необходимости — ссылки на исходный код и документацию.

### Что ожидать

- Общий план в `agency/plans/`, например:  
  `agency/plans/blog_feature_tags_PLAN_YYYYMMDD.md`
- Набор детальных задач в `agency/task_descriptions/`, например:  
  `agency/task_descriptions/task_1_2_blog_feature_tags_....md`

### Пример текстового запроса

```text
Ты работаешь по промпту из ../agents/06_agent_planner.md.

ТЗ: agency/tz/blog_feature_tags_TZ_example.md.
Архитектура решения: agency/architecture/blog_feature_tags_ARCH_example.md.
Описание проекта: agency/PROJECT_OVERVIEW.md.

Сформируй:
- файл общего плана в agency/plans/;
- набор файлов задач в agency/task_descriptions/.

Верни пути ко всем созданным файлам.
```

