export default abstract class UseCaseBase {
  abstract invoke(): AsyncGenerator<string>;
}
