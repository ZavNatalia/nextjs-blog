---
title: 'Turbopack Dev теперь стабилен!'
date: '2024-10-21'
image: 'turbopack-dev-is-now-stable.webp'
excerpt: '"next dev --turbo" теперь стабилен и готов ускорить ваш процесс разработки. Он был использован для совершенствования vercel.com, nextjs.org, v0 и всех других приложений, получив превосходные результаты.'
isFeatured: true
---

После 8 лет использования webpack, Next.js объявляет о стабильном релизе нового сборщика Turbopack:

```
next dev --turbo
```

На крупных приложениях, таких как vercel.com, достигнуты следующие улучшения:

-   До 76.7% быстрее запуск локального сервера
-   До 96.3% быстрее обновление кода с Fast Refresh
-   До 45.8% быстрее начальная компиляция маршрутов без кэширования

## История и мотивация

### Предпосылки

-   Next.js использовался для создания проектов от хобби до enterprise-приложений
-   Webpack был лучшим выбором при запуске Next.js
-   Со временем webpack перестал справляться с потребностями современных веб-разработчиков
-   Сообщество жаловалось на медленную итерацию при ожидании загрузки маршрутов и отражения изменений

### Попытки оптимизации

-   Команда Next.js потратила много времени на оптимизацию webpack
-   Достигнут предел улучшений с существующей архитектурой
-   Требовался новый фундамент для поддержки существующих приложений и будущих инноваций

## Технические улучшения

![A cinematic shot of a high-tech facility with multiple screens displaying code and data. ](multiple-screens-displaying-code-and-data.webp)

### 1. Компиляция маршрутов

#### Проблемы с webpack:

-   Необходимость запуска отдельных компиляторов для сервера и браузера
-   Дублирование парсинга кода
-   Отсутствие параллелизации между CPU
-   Ограничения из-за архитектуры на JavaScript

#### Решения Turbopack:

-   Единый компилятор для всех сред выполнения
-   Использование "target transitions" для эффективной обработки Server и Client Components
-   Параллелизация работы across CPUs благодаря Rust
-   Оптимизированная работа с файловой системой
-   Улучшенное разрешение модулей
-   Пропуск работы для модулей без side-effects

### 2. Fast Refresh

#### Проблемы webpack:

-   Производительность ограничена количеством JavaScript модулей
-   При ~30,000 модулей минимум 1 секунда overhead на любое изменение
-   Линейное масштабирование с количеством модулей

#### Улучшения в Turbopack:

-   Скорость обновления зависит только от размера изменений
-   Использование Turbo Engine для инкрементальных вычислений
-   Архитектура основана на десятилетиях исследований (включая webpack, Salsa, Parcel, Adapton)
-   Обновление за миллисекунды даже в крупных приложениях

### 3. Продвинутая трассировка

Из-за роста популярности Next.js стало сложнее воспроизводить проблемы с производительностью компилятора и использованием памяти, поскольку пользователи не могут поделиться кодом или приложения требуют дополнительной настройки.

Чтобы решить эту проблему, они добавили трассировку во внутренние механизмы Next.js. Однако с webpack было трудно отличить использование памяти компилятором от самого приложения, так как всё работает в одном экземпляре Node.js.

С Turbopack они изначально внедрили инструментирование в Turbo Engine, позволяющее собирать временные показатели и отслеживать распределение памяти для каждой функции.

Эта продвинутая трассировка предоставляет всю необходимую информацию для глубокого анализа замедлений и использования памяти без необходимости полного кода приложения.

Для обработки этих трасс они создали производительный просмотрщик, специально разработанный для анализа замедлений и использования памяти в Turbopack, что улучшило производительность ранних приложений.

Теперь этот инструмент доступен для самостоятельного использования в Next.js. Вы можете сгенерировать трассу Turbopack и использовать команду _next internal turbo-trace-server .next/trace-turbopack_ для её анализа.

### 4. Стабильность компиляции

-   Более предсказуемое время компиляции
-   Вариативность в пределах нескольких процентов
-   Улучшенное соответствие между development и production сборками

## Текущий статус и поддержка

### Что стабильно:

-   Команда _next dev --turbo_
-   Поддержка App Router и Pages Router
-   Работа со всеми стабильными функциями Next.js

### Поддержка webpack лоадеров:

-   @svgr/webpack
-   babel-loader
-   url-loader
-   file-loader
-   raw-loader
-   tsconfig-paths-webpack-plugin

### CSS и CSS-in-JS поддержка

#### Поддерживается:

-   Tailwind CSS
-   @emotion/react
-   Sass
-   styled-components
-   Bootstrap
-   Antd
-   node-sass
-   JSS
-   theme-ui
-   Chakra UI
-   aphrodite

#### Временно не поддерживается:

-   Less
-   @vanilla-extract/css
-   StyleX

## Производительность и оптимизации

### Текущие результаты:

-   Значительное улучшение по сравнению с webpack
-   Отсутствие persistent кэширования (в разработке)
-   25-35% снижение использования памяти (RC 2 vs RC 1)
-   30-50% быстрее начальная компиляция для больших страниц

### Breaking changes:

**Причина создания Turbopack** — необходимость максимально соответствовать поведению webpack, чего не могли обеспечить существующие решения.

**Удаление некоторых функций:** Чтобы обеспечить перспективность Turbopack в Next.js, пришлось убрать некоторые возможности. Эти функции по-прежнему доступны при использовании webpack.

**Основные изменения:**

1. **Конфигурация _webpack()_ не поддерживается.** Turbopack не является webpack и имеет другую структуру конфигурации, хотя поддерживает многие схожие функции, включая загрузчики и псевдонимы.

2. **Файл _.babelrc_ не трансформирует код автоматически.** По умолчанию Turbopack использует SWC. Вы можете добавить _babel-loader_, но SWC всегда запускается для оптимизаций, что позволяет использовать единое синтаксическое дерево (AST).

3. **Некоторые редко используемые функции CSS Modules не поддерживаются.** Обработка CSS переключена на Lightning CSS — более быстрый компилятор, поддерживающий трансформации, минификацию и CSS Modules. Однако не поддерживаются псевдоселекторы _:global_ и _:local_, директива _@value_ и правила _:import_ / _:export_.

**Вклад в Lightning CSS:** Команда улучшила проект, добавив настройки для CSS Modules и улучшив сообщения об ошибках.

**Экспериментальные функции:** Фокус на стабильных функциях Next.js; полный список изменений доступен в документации.

## Дорожная карта

### Ближайшие релизы:

1. Persistent кэширование:

    - Сохранение результатов между перезапусками
    - Fast Refresh эффект для открытия ранее скомпилированных маршрутов
    - Улучшенная производительность сборки

2. Production сборки (96% тестов пройдено):
    - Оптимизации CSS чанкинга
    - Улучшенный tree shaking
    - Module ID хэширование
    - Оптимизация экспортов
    - Content-based хэширование имён файлов

### Долгосрочные планы:

-   Рекомендованное использование в create-next-app
-   Становление дефолтным сборщиком в Next.js
-   Поддержка популярных webpack плагинов
-   Standalone версия вне Next.js

## Статус Production оптимизаций

### Реализовано:

-   SWC Minify для JS
-   Lightning CSS минификация
-   Production JS Runtime
-   Глобальные оптимизации приложения

### В процессе:

-   CSS чанкинг
-   Расширенный tree shaking
-   Module ID хэширование
-   Оптимизация экспортов

### Планируется:

-   Scope hoisting
-   Оптимизированный JS чанкинг
-   Content-based хэширование файлов

---

_Authors of the original post: Maia Teegarden, Tim Neutkens, Tobias Koppers_