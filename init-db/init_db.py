import os
import pymysql
import time

# Wait for the database to be ready
time.sleep(10)

try:
    conn = pymysql.connect(
        host=os.environ.get('MYSQL_HOST', 'database'),
        user=os.environ['MYSQL_USER'],
        password=os.environ['MYSQL_PASSWORD'],
        database=os.environ['MYSQL_DATABASE'],
        port=int(os.environ.get('MYSQL_PORT', 3306))
    )

    cursor = conn.cursor()

    # SQL statements (ตัดบางส่วนเพื่อความยาว)
    statements = [
        '''CREATE TABLE IF NOT EXISTS Person (
            CitizenID VARCHAR(13) NOT NULL COMMENT 'รหัสบัตรประจำตัวประชาชน',
            FirstName VARCHAR(50) NOT NULL COMMENT 'ชื่อจริง',
            LastName VARCHAR(50) NOT NULL COMMENT 'นามสกุล',
            Gender CHAR(1) COMMENT 'เพศ (M=ชาย, F=หญิง, O=อื่นๆ)',
            PhoneNum VARCHAR(15) UNIQUE COMMENT 'หมายเลขโทรศัพท์มือถือ',
            Address VARCHAR(255) COMMENT 'ที่อยู่',
            ProfileURL VARCHAR(255) COMMENT 'URL รูปภาพโปรไฟล์',
            PRIMARY KEY (CitizenID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'ข้อมูลบุคคลพื้นฐาน';''',

        '''CREATE TABLE IF NOT EXISTS Employee (
            EmpID VARCHAR(10) NOT NULL COMMENT 'รหัสพนักงาน',
            CitizenID VARCHAR(13) NOT NULL UNIQUE COMMENT 'FK อ้างอิง Person',
            EmpPasswordHash VARCHAR(255) NOT NULL COMMENT 'ค่าแฮชของรหัสผ่าน',
            EmpRole VARCHAR(50) NOT NULL COMMENT 'ตำแหน่งงาน',
            EmpSalary DECIMAL(10, 2) COMMENT 'เงินเดือน',
            PRIMARY KEY (EmpID),
            CONSTRAINT fk_employee_person FOREIGN KEY (CitizenID) REFERENCES Person(CitizenID)
                ON DELETE RESTRICT ON UPDATE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'ข้อมูลพนักงาน';''',

        '''CREATE TABLE IF NOT EXISTS Customer (
            CitizenID VARCHAR(13) NOT NULL,
            Point INT NOT NULL DEFAULT 0,
            PRIMARY KEY (CitizenID),
            CONSTRAINT fk_customer_person FOREIGN KEY (CitizenID) REFERENCES Person(CitizenID)
                ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS MenuCategory (
            CategoryID VARCHAR(10) NOT NULL,
            CategoryName VARCHAR(50) NOT NULL UNIQUE,
            CategoryStatus VARCHAR(20) NOT NULL DEFAULT 'Active',
            PRIMARY KEY (CategoryID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS Menu (
            MenuID VARCHAR(10) NOT NULL,
            MenuName VARCHAR(100) NOT NULL UNIQUE,
            MenuPrice DECIMAL(7, 2) NOT NULL,
            MenuDescription VARCHAR(255),
            MenuStatus VARCHAR(20) NOT NULL DEFAULT 'พร้อมขาย',
            MenuURL VARCHAR(255),
            CategoryID VARCHAR(10) NOT NULL,
            PRIMARY KEY (MenuID),
            CONSTRAINT fk_menu_menucategory FOREIGN KEY (CategoryID) REFERENCES MenuCategory(CategoryID)
                ON DELETE RESTRICT ON UPDATE CASCADE,
            INDEX idx_menu_category (CategoryID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS IngredientCategory (
            IngredientCategoryID VARCHAR(10) NOT NULL,
            Name VARCHAR(50) NOT NULL UNIQUE,
            AllowMultipleSelection BOOLEAN NOT NULL DEFAULT FALSE,
            IsCustomizable BOOLEAN NOT NULL DEFAULT TRUE,
            PRIMARY KEY (IngredientCategoryID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS Ingredient (
            IngredientID VARCHAR(10) NOT NULL,
            Name VARCHAR(100) NOT NULL UNIQUE,
            Quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
            Unit VARCHAR(20) NOT NULL,
            CostPerUnit DECIMAL(10, 2) NOT NULL DEFAULT 0,
            AdjustmentPrice DECIMAL(7, 2) NOT NULL DEFAULT 0,
            IngredientCategoryID VARCHAR(10) NOT NULL,
            PRIMARY KEY (IngredientID),
            CONSTRAINT fk_ingredient_ingredientcategory FOREIGN KEY (IngredientCategoryID) REFERENCES IngredientCategory(IngredientCategoryID)
                ON DELETE RESTRICT ON UPDATE CASCADE,
            INDEX idx_ingredient_category (IngredientCategoryID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS DefaultRecipe (
            MenuID VARCHAR(10) NOT NULL,
            IngredientID VARCHAR(10) NOT NULL,
            Quantity DECIMAL(8, 2) NOT NULL,
            IsBaseIngredient BOOLEAN NOT NULL DEFAULT FALSE,
            IsReplaceable BOOLEAN NOT NULL DEFAULT TRUE,
            PRIMARY KEY (MenuID, IngredientID),
            CONSTRAINT fk_defaultrecipe_menu FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
                ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_defaultrecipe_ingredient FOREIGN KEY (IngredientID) REFERENCES Ingredient(IngredientID)
                ON DELETE RESTRICT ON UPDATE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS `Order` (
            OrderID VARCHAR(10) NOT NULL,
            OrderDateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            OrderStatus BOOLEAN NOT NULL DEFAULT FALSE,
            OrderPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
            EmpID VARCHAR(10) NOT NULL,
            CitizenID VARCHAR(13),
            PRIMARY KEY (OrderID),
            CONSTRAINT fk_order_employee FOREIGN KEY (EmpID) REFERENCES Employee(EmpID)
                ON DELETE RESTRICT ON UPDATE CASCADE,
            CONSTRAINT fk_order_customer FOREIGN KEY (CitizenID) REFERENCES Customer(CitizenID)
                ON DELETE SET NULL ON UPDATE CASCADE,
            INDEX idx_order_datetime (OrderDateTime),
            INDEX idx_order_employee (EmpID),
            INDEX idx_order_customer (CitizenID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS OrderItem (
            OrderItemID VARCHAR(15) NOT NULL,
            OrderID VARCHAR(10) NOT NULL,
            MenuID VARCHAR(10) NOT NULL,
            Quantity INT NOT NULL,
            Note VARCHAR(255),
            ItemBasePrice DECIMAL(7, 2) NOT NULL,
            CustomizeCost DECIMAL(7, 2) NOT NULL DEFAULT 0,
            ItemTotalPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
            PRIMARY KEY (OrderItemID),
            CONSTRAINT fk_orderitem_order FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID)
                ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_orderitem_menu FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
                ON DELETE RESTRICT ON UPDATE CASCADE,
            INDEX idx_orderitem_order (OrderID),
            INDEX idx_orderitem_menu (MenuID)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;''',

        '''CREATE TABLE IF NOT EXISTS CustomIngredient (
            OrderItemID VARCHAR(15) NOT NULL,
            IngredientID VARCHAR(10) NOT NULL,
            Quantity DECIMAL(8, 2) NOT NULL,
            CustomizationCost DECIMAL(7, 2) NOT NULL DEFAULT 0,
            PRIMARY KEY (OrderItemID, IngredientID),
            CONSTRAINT fk_customingredient_orderitem FOREIGN KEY (OrderItemID) REFERENCES OrderItem(OrderItemID)
                ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_customingredient_ingredient FOREIGN KEY (IngredientID) REFERENCES Ingredient(IngredientID)
                ON DELETE RESTRICT ON UPDATE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'''
    ]

    for stmt in statements:
        cursor.execute(stmt)

    conn.commit()
    print("✅ Tables created successfully.")

except pymysql.MySQLError as e:
    print(f"❌ Failed to connect or execute SQL: {e}")

finally:
    try:
        cursor.close()
        conn.close()
    except:
        pass