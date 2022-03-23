const CheckDataJson = (data) => {
  try {
    if (data) {
      return data;
    }
    return '';
  } catch (error) {
    return '';
  }
};

export { CheckDataJson };
