export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const addThousandSeperator = (number) => {
  if (number == null || isNaN(number)) return "";

  const [istegerPart, fractionalPart] = number.toString().split("."); // Split the number into integer and fractional parts
  const formattedInteger = istegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas to the integer part
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};
