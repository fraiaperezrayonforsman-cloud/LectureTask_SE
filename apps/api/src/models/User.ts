import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import openDb from '../db/db'; 

export const createUser = async (values: PlatformUser): Promise<PlatformUser | null> => {
  const db = await openDb();
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(values.password!, 10);

    // Insert into the 'users' table
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      values.email,
      hashedPassword
    );

    // Retrieve the newly created user (exclude password for security)
    const user = await db.get<PlatformUser>(
      'SELECT id, email FROM users WHERE id = ?',
      result.lastID
    );

    return user || null;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  } finally {
    await db.close();
  }
};

export const findUserById = async (id: string): Promise<PlatformUser | null> => {
  const db = await openDb();
  const user = await db.get<PlatformUser>('SELECT * FROM users WHERE id = ?', id);
  await db.close();
  return user || null;
};

/**
 * Compares a plain text password with a hashed password.
 *
 * This function uses bcrypt to asynchronously compare a plain text password with a hashed password 
 * to determine if they match.
 *
 * @param {string} password - The plain text password to be compared. (input from user when trying to login)
 * @param {string} hashedPassword - The hashed password to compare against. (encrypted password stored in database)
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the passwords match, 
 *                               and `false` otherwise.
 */
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword); 
};
