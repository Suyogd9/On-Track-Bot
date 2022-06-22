module.exports = class AbstractHandler {
  constructor(inputString) {
    this.inputString = inputString;
  }

  isValid() {
    throw new Error("Not Implemented");
  }

  handle(args) {
    throw new Error("Not Implemented");
  }
}
