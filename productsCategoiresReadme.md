## Endpoint - /api/categories GET-запит віддає список всіх продуктів.

## Endpoint - /api/products GET-запит віддає список всіх продуктів.

--- Endpoint - /api/products/title=query Віддає список продуктів, відфільтрованих по назві. Працює
по частковому пошуку - із запитом cheese віддасть всі продукти, які в title містять слово cheese.

---

--- Endpoint - /api/products/category=query Віддасть список, відфільтрований по категоріям. Також
працює по частковому співпаданні в назві категорії. ---

--- Endpoint - /api/products/category=query&title=query Віддасть список відфільтрований по двом
полям - title та category. ---
