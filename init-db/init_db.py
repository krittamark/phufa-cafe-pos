import os
import pymysql
import time

# รอ database พร้อม
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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50),
        salary DECIMAL(10,2)
    );
    """)

    conn.commit()
    print("✅ Table created successfully.")

except pymysql.MySQLError as e:
    print(f"❌ Failed to connect or execute SQL: {e}")

finally:
    try:
        cursor.close()
        conn.close()
    except:
        pass