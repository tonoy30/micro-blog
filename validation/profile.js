const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle need to be 2 to 40 characters.";
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required.";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "Status fields is required.";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills fields is required.";
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid url";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid url";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid url";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid url";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid url";
    }
  }
  if (!isEmpty(data.reddit)) {
    if (!Validator.isURL(data.reddit)) {
      errors.reddit = "Not a valid url";
    }
  }
  if (!isEmpty(data.stackoverflow)) {
    if (!Validator.isURL(data.stackoverflow)) {
      errors.stackoverflow = "Not a valid url";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
