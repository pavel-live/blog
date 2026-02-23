## 07_agent_plan_reviewer (ревьюер плана)

Полный промпт: `../agents/07_agent_plan_reviewer.md`

Роль: убедиться, что план и список задач полностью покрывают ТЗ и архитектуру и достаточно детализированы.

### Что давать ревьюеру плана

- Файл плана из `agency/plans/...`.
- Все файлы задач из `agency/task_descriptions/...`.
- ТЗ и архитектуру по фиче.

### Что ожидать

- Файл review плана, например:  
  `agency/plans/blog_feature_tags_PLAN_review_1.md`
- Перечень непокрытых юзер-кейсов и недостающих задач (если есть).

### Пример текстового запроса

```text
Ты работаешь по промпту из ../agents/07_agent_plan_reviewer.md.

Проверь план agency/plans/blog_feature_tags_PLAN_example.md
и задачи из agency/task_descriptions/ на:
- покрытие всех юзер-кейсов ТЗ;
- достаточную детализацию;
- наличие описаний для всех задач.

Сформируй файл review в agency/plans/blog_feature_tags_PLAN_review_1.md.
```

