import UserService from "../services/UserService.js";

export const getUserProfile = async (req, res) => {
    
    try {
        const result = await UserService.getUserProfile(req.user.userId);
        return res.status(200).json({
            message: "User retreived successfully",
            data: result,
            success: true
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    const {first_name, last_name, email, phone_number } = req.body;
    const updateData = {
        first_name,
        last_name,
        email,
        phone_number
    }
    try {
        const result = await UserService.updateUserProfile(req.user.userId, updateData);
        return res.status(200).json({
            message: "User profile updated",
            data: result,
            success: true
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            success: false
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        if(req.user.isAdmin !== 'Y') {
            return res.status(403).json({
                message: "Forbidden for normal users. Admin access only",
                success: false
            });
        }
        const result = await UserService.getUserById(req.params.id);
        return res.status(200).json({
            message: "User retreived successfully",
            data: result,
            success: true
        });
    } catch (error) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        if(req.user.isAdmin !== 'Y') {
            return res.status(403).json({
                message: "Forbidden for normal users. Admin access only",
                success: false
            });
        }
        const result = await UserService.getAllUsers();
        return res.status(200).json({
            message: "Users retreived successfully",
            data: result,
            success: true
        });
    } catch (error) {
        return res.status(404).json({
            message: "Users not found",
            success: false
        });
    }
};

// Missing - Delete current user's account
export const deleteAccount = async (req, res) => {
    try {
      await UserService.softDeleteUser(req.user.userId);
      return res.status(200).json({
        message: "Account deleted successfully",
        success: true
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
        success: false
      });
    }
  };
  
  // Missing - Admin delete specific user
  export const deleteUser = async (req, res) => {
    try {
      if(req.user.isAdmin !== 'Y') {
        return res.status(403).json({
          message: "Forbidden for normal users. Admin access only",
          success: false
        });
      }
      await UserService.softDeleteUser(req.params.id);
      return res.status(200).json({
        message: "User deleted successfully", 
        success: true
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
        success: false
      });
    }
  };