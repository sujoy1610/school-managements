import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

const connectDB = async (): Promise<mysql.Connection> => {
  if (connection) {
    return connection;
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: Number(process.env.MYSQLPORT),
      charset: 'utf8mb4',
    });

    console.log('✅ Connected to Railway MySQL Database');
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export default connectDB;
