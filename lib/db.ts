import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

const connectDB = async (): Promise<mysql.Connection> => {
  if (connection) return connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,   // ✅ Added port
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Sujoy@2000',
      database: process.env.DB_NAME || 'schoolsdb',
      charset: 'utf8mb4',
    });

    console.log('✅ Connected to MySQL Database');
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export default connectDB;
