export default interface IMigrationUseCase {
  invoke(): Promise<void>;
}
