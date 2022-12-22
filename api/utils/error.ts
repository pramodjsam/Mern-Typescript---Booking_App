class ErrorHandler extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const createError = (status: number, message: string) => {
  const err = new ErrorHandler(status, message);
  return err;
};
