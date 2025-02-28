export const handleMongooseError = (error, data, next) => {
  error.status = 400;
  next();
};

export const validateAtUpdate = function (next) {
  const updatedFields = Object.keys(this.getUpdate());
  if (!updatedFields.includes("verificationToken")) {
    this.options.runValidators = true;
  }
  next();
};
