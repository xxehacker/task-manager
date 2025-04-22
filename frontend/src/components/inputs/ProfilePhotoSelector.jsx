import React from "react";
import { LuUser, LuUpload, LuTrash, LuLoader } from "react-icons/lu";

function ProfilePhotoSelector({ image, setImage }) {
  const inputRef = React.useRef(null);
  //   console.log(inputRef)
  const [previewurl, setPreviewUrl] = React.useState(null);

  // this function has written for updating the state when the image uploaded.
  const handleImageChange = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      // update the image state
      setImage(file);
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounde-full relative cursor-pointer">
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-green-500 rounded-full absolute -bottom-1 -right-1 cursor-pointer "
            onClick={onChooseFile}
          >
            <LuUpload className="text-2xl text-green-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewurl}
            alt="profile pic"
            className="w-16 h-16  rounded-full object-cover "
          />
          <button
            type="button"
            className="w-8 h-8  flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;
