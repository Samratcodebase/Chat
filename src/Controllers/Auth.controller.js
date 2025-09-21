const Login = (req, res) => {
  res.status(200).json({
    message: "Login Route",
    sucess: true,
  });
};

const SignUp = (req, res) => {
  res
    .status(200)
    .json({ message: "Account Creation Succesfull", sucess: true });
};
export { Login, SignUp };
