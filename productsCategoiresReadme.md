## Endpoint - /api/products/categories По замовчуванню віддає список всіх продуктів.

--- Endpoint - /api/products/categories?title=query Віддає список продуктів, відфільтрованих по
назві. Працює по частковому пошуку - із запитом cheese віддасть всі продукти, які в title містять
слово cheese. ---

--- Endpoint - /api/products/categories?category=query Віддасть список, відфільтрований по
категоріям. ---

--- Endpoint - /api/products/categories?category=query&title=query Віддасть список відфільтрований
по двом полям - title та category. ---
