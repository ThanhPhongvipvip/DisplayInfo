INSERT INTO auth.roles (name)
VALUES
    ('ADMIN'),
    ('STAFF'),
    ('CUSTOMER');

INSERT INTO auth.users
    (username, password, email, age, role_id)
VALUES
    ('phong', '123456', 'phong@gmail.com', 21, 1),
    ('nam', '123456', 'nam@gmail.com', 22, 2),
    ('an', '123456', 'an@gmail.com', 20, 3),
    ('minh', '123456', 'minh@gmail.com', 25, 3),
    ('long', '123456', 'long@gmail.com', 19, 3);

INSERT INTO catalog.categories (name)
VALUES
    ('Laptop'),
    ('Phone'),
    ('Keyboard'),
    ('Mouse');

INSERT INTO catalog.products
    (name, price, quantity, category_id)
VALUES
    ('Dell Inspiron 15', 18000000, 10, 1),
    ('MacBook Air M4', 25000000, 5, 1),
    ('iPhone 17', 22000000, 8, 2),
    ('Samsung Galaxy S26', 20000000, 12, 2),
    ('Keychron K2', 2500000, 20, 3),
    ('Logitech MX Master 3S', 2200000, 15, 4),
    ('Gaming Mouse', 800000, 30, 4);

INSERT INTO sales.orders (user_id, status)
VALUES
    (1, 'COMPLETED'),
    (2, 'PENDING'),
    (1, 'COMPLETED'),
    (3, 'CANCELLED');

INSERT INTO sales.order_items
    (order_id, product_id, quantity, price)
VALUES
    (1, 1, 1, 18000000),
    (1, 6, 1, 2200000),

    (2, 3, 1, 22000000),
    (2, 7, 2, 800000),

    (3, 5, 1, 2500000),
    (3, 6, 1, 2200000),

    (4, 4, 1, 20000000);

INSERT INTO inventory.stock_movements
    (product_id, quantity, movement_type)
VALUES
    (1, 10, 'IN'),
    (1, 2, 'OUT'),
    (2, 5, 'IN'),
    (3, 8, 'IN'),
    (3, 1, 'OUT'),
    (6, 15, 'IN');

INSERT INTO audit.logs
    (user_id, action, description)
VALUES
    (1, 'LOGIN', 'User logged in'),
    (1, 'CREATE_ORDER', 'Created order #1'),
    (2, 'LOGIN', 'User logged in'),
    (3, 'CREATE_ORDER', 'Created order #4');