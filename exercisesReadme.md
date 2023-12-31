##### Ці ендпоінти дозволяють користувачу вести облік виконаних вправ за різні дати, а також видаляти та отримувати інформацію про ці події.

---

# Endpoint запит GET/api/exercises?query=01/09/2023 -Цей ендпоінт дозволяє користувачу отримати список вправ, які він виконав у вказану дату. Для цього необхідно вказати дату (у форматі dd/mm/YYYY). Він повертає список вправ, які були виконані користувачем в обрану дату. Додайте параметр query: Для передачі дати додайте параметр query до URL-адреси в форматі ?query={date}. Замініть {date} на відповідну дату у форматі dd/mm/YYYY.

---

# Endpoint /api/exercises запит POST - Цей ендпоінт дозволяє користувачу зберігати інформацію про вправу, яку він виконав у вказану дату. Для цього необхідно вказати ідентифікатор вправи (exercise ID), дату (у форматі dd/mm/YYYY), тривалість вправи (у хвилинах) та кількість калорій, спалених під час цієї вправи. Усі поля є обов'язковими для заповнення.Вкажіть дані для вправи: У вкладці "Body" (Тіло) внизу вікна Postman ви можете вказати JSON-об'єкт, який містить дані про вправу, включаючи ідентифікатор вправи (exercise ID), дату, тривалість та кількість калорій. Обов'язково заповніть всі ці поля відповідно до вашого формату даних.

<!-- Приклад:
{
    "exercise_id": 12345,
    "date": "15/09/2023",
    "duration_minutes": 30,
    "calories_burned": 200
} -->

---

# Endpoint запит DELETE/api/exercises?exerciseId=12345&date=01/09/2023 - Цей ендпоінт дозволяє користувачу видаляти інформацію про вправу, яку він виконав в обрану дату. Для видалення необхідно вказати ідентифікатор вправи (exercise ID) та дату (у форматі dd/mm/YYYY), за яку необхідно видалити запис про вправу. Додайте параметри в URL: Для передачі ідентифікатора вправи (exercise ID) та дати додайте їх до URL-адреси в форматі ?exerciseId={exercise_id}&date={date}. Замініть {exercise_id} та {date} на відповідні значення.

---

# Endpoint запит PATCH/api/exercises?exerciseId=12345&date=15/09/2023 - Цей ендпоiнт дозволяє користувачу оновлювати даннi про вправу яку він виконав в обрану дату. Додайте параметри в URL: Для оновлення даних, можливо, вам знадобиться вказати ідентифікатор вправи (exercise ID) та дату (дату) у URL-адресі. Додайте їх до URL-адреси в форматі ?exerciseId={exercise_id}&date={date}. Замініть {exercise_id} та {date} на відповідні значення.

<!-- Приклад
{
    "duration_minutes": 45,
    "calories_burned": 300
} -->
