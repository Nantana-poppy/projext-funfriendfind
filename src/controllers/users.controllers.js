import { editUserProfile, getMyTrips, getUserProfile } from "../services/users.services.js";

export async function getUserProfileController(req, res, next) {
  try {
    const { userId } = req.params;

    const user = await getUserProfile(userId);

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function editUserProfileController(req, res, next) {
  try {
    const { userId } = req.params;
    const updatedUser = await editUserProfile(userId, req.body);

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyTripsController(req, res, next) {
  try {
    const userId = req.user.id;

    const trips = await getMyTrips(userId);

    res.status(200).json({
      status: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
}
