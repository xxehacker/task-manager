import { API_ENDPOINTS } from "./apiPath";
import AXIOS_INSTANCE from "./axiosInstance";

export const uploadImage = async (profilePic) => {
  const formData = new FormData();
  formData.append("profile", profilePic);

  try {
    const response = await AXIOS_INSTANCE.post(
      API_ENDPOINTS.AUTH.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error uploading the profile image", error);
    throw new Error("Error uploading the profile image");
  }
};
