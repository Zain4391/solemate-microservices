/**
 * @fileoverview TokenService is a service that carries out user authentication and password hashing.
 * @module services/UserService
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import supabase from "../config/Database.js";

class UserService {

    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase.from("Users").select().eq("u_id", userId).is('deleted_at', null);
            if(error) {
                throw new Error(error.message);
            }
            if(data.length === 0) {
                throw new Error("User not found!");
            }
            const user = data[0];
            const {password, ...userWithoutPassword} = user;
            return {
                message: "User found successfully",
                user: userWithoutPassword
            }
        } catch (error) {
            console.log(error);
            throw error.message;
        }
    }

    async updateUserProfile(userId, updateData) {
        try {
            const { error } = await supabase.from("Users").update(updateData).eq("u_id", userId).is('deleted_at', null);
            if(error) {
                throw new Error(error.message);
            }
            return {
                message: "Profile updated successfully"
            }
        } catch (error) {
            console.log(error);
            throw error.message;  
        }
    }

    async softDeleteUser(userId) {
        try {
          // Check user exists and is not already deleted
          const { data: existingUser } = await supabase
            .from("users") // Fix table name here too
            .select("u_id")
            .eq("u_id", userId)
            .is('deleted_at', null)
            .single();
            
          if (!existingUser) {
            throw new Error("User not found or already deleted");
          }
          
          const { error } = await supabase
            .from("Users") // Fix table name here too
            .update({ deleted_at: new Date().toISOString() })
            .eq("u_id", userId);
            
          if (error) {
            throw new Error(error.message);
          }
          
          return {
            message: "User deleted successfully"
          };
        } catch (error) {
          throw error;
        }
      }

    async getAllUsers() {
        try {
            const { data, error } = await supabase.from("Users").select("u_id, first_name, last_name, email, phone_number, is_admin").is('deleted_at', null);
            if(error) {
                throw new Error(error.message);
            }
            if(data.length === 0) {
                throw new Error("Databse empty");
            }
            return {
                message: "Users retreived successfully",
                users: data
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const { data, error } = await supabase.from("Users").select().eq("u_id", userId).is('deleted_at', null);
            if(error) {
                throw new Error(error.message);
            }
            if(data.length === 0) {
                throw new Error("User not found!");
            }
            const user = data[0];
            const {password, ...userWithoutPassword } = user;
            return {
                message: "User found successfully",
                user: userWithoutPassword
            }
        } catch (error) {
            console.log(error);
            throw error.message;
        }
    }
}

export default new UserService();