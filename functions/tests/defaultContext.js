module.exports = {
  res: jest.fn(),
  done: jest.fn(),
  logger: {
    error: jest.fn(),
    info: jest.fn()
  }
};
