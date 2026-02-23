## 08_agent_developer (разработчик)

Полный промпт: `../agents/08_agent_developer.md`

Роль: реализовать конкретную задачу по описанию от планировщика, написать тесты и предоставить отчёт.

### Что давать разработчику

- Файл задачи из `agency/task_descriptions/...`, например:  
  `agency/task_descriptions/task_1_2_blog_feature_tags_example.md`
- Ссылки на изменяемые файлы кода (маршруты, контроллеры, шаблоны и т.п.).
- При необходимости — `CONTENT_RULES.md` (для SEO/структуры страниц).

### Что ожидать

- Предложенные изменения кода (патчи / фрагменты).
- Файл отчёта о тестировании в `agency/test_reports/`, например:  
  `agency/test_reports/test_report_task_1_2_blog_feature_tags_example.md`

### Пример текстового запроса

```text
Ты работаешь по промпту из ../agents/08_agent_developer.md.

Задача: см. agency/task_descriptions/task_1_2_blog_feature_tags_example.md.
Правила контента и SEO: см. agency/CONTENT_RULES.md.

Предложи изменения в коде (с указанием файлов) и создай отчёт
о тестировании в agency/test_reports/test_report_task_1_2_blog_feature_tags_example.md.
Верни текст отчёта и описания всех изменений.
```

