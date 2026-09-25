CREATE TABLE auth.roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE auth.users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    age INTEGER CHECK (age >= 0),
    role_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES auth.roles(id)
);



CREATE TABLE catalog.categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE catalog.products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    category_id INTEGER,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES catalog.categories(id)
);



CREATE TABLE sales.orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING',

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
);

CREATE TABLE sales.order_items (
    order_id INTEGER,
    product_id INTEGER,

    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),

    PRIMARY KEY (order_id, product_id),

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES sales.orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id)
        REFERENCES catalog.products(id)
);



CREATE TABLE inventory.stock_movements (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product
        FOREIGN KEY (product_id)
        REFERENCES catalog.products(id),

    CONSTRAINT chk_movement_type
        CHECK (movement_type IN ('IN', 'OUT'))
);


CREATE TABLE audit.logs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
);

