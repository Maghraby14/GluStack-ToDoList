// lib/mutations.ts
import { supabase } from './db';


export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
  
};
export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const createUserRecord = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      password, // ⚠️ Don’t store plaintext passwords in production!
    })
    .select() // ← This makes Supabase return the inserted row(s)
    .single(); // ← Optional: Use this if you expect only one inserted row

  if (error) {
    throw new Error(error.message);
  }
  return data;
 
  
};
export const addTasks = async ({
  userId , 
  listId, 
  taskName, 
  taskDescription, 
  taskDueDate,
  
}:{
  userId: string;
  listId: string;
  taskName: string;
  taskDescription: string;
  taskDueDate: Date;
  
})=>{

}
export const createTaskList = async ({
  userId,
  listName,
}: {
  userId: string;
  listName: string;

}) => {
  const payload = {
    user_id: userId,
    title: listName,
  };

  const { data, error } = await supabase
    .from("todolists")
    .insert([payload]) // insert expects an array
    .select(); // returns all inserted rows

  if (error) {
    throw new Error(`Failed to create task list: ${error.message}`);
  }

  return data;
};
export const getTaskLists = async ({
  userId,
}: {
  userId: string;
}) => {
  const { data, error } = await supabase
    .from("todolists")
    .select('*')
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to fetch task lists: ${error.message}`);
  }

  return data;
};



export const findUserRecord = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password) // avoid storing passwords in plain text in production!
    .single(); // returns one row, not an array

  if (error) {
    throw new Error(error.message);
  }
  console.log('User Data', data);
  return data;
  
  
};
