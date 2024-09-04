import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const createAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while creating access and refresh Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // retrive user data

  const { fullName, password, email, username } = req.body;
  console.log("email", email);

  // validation of empty feilds

  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All feild are required");
  }

  // Check existed User

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user with same email and username already exist");
  }

  // images check : multer

  console.log("complete images files", req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar file is required");
  }

  // images check : cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "avatar file is required");
  }

  // create entry of user in db

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  console.log("complete user", user);

  // Remove password and refresh Token

  const createdUser = await User.findById(user._id).select(
    "-passowrd -refreshToken"
  );
  console.log("complete Createduser", createdUser);

  // check user is created in db

  if (!createdUser) {
    throw new apiError(500, "something went wrong while registring user");
  }

  // get res

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "user Created SuccessFully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get values form req.body

  const { username, email, password } = req.body;
  
  //   check email and password
  
  if (!(username && email)) {
    throw new apiError(400, "username and email is not valid");
  }
  
  //   find User
  
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(404, "User is not Found");
  }
  
  //   check correct password
  
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(400, "Invalid Credentials");
  }
  
  // get access and refresh Token
  
  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    user._id
  );
  
  // get LoggedIn user and remove password and token
  
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secured: true,
  };
  
  // send resposne and set cookies
  
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user LoggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async(req , res)=>{

})

export { registerUser, loginUser , logoutUser };
