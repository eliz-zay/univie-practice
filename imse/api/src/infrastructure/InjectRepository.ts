import { Inject, Provider } from "@nestjs/common";

export function InjectRepository<T>(entity: new (...args: any[]) => T) {
  return Inject(`StorageConsidering${entity.name}Repository`);
}

export function proxyRepositoryProvider<Base>(sqlRepository: new (...args: any[]) => Base, nosqlRepository: new (...args: any[]) => Base): Provider<Base> {
  const providerNameEnd = sqlRepository.name.replace('Sql', '').replace('NoSql', '');
  const providerName = `StorageConsidering${providerNameEnd}`;

  return {
    provide: providerName,
    useFactory: (sqlRepositoryInstance, nosqlRepositoryInstance) => {
      const methods = Reflect.ownKeys(sqlRepository.prototype);

      const repository: Base = {} as Base;
      methods.forEach((method) => {
        repository[method] = (...args: any[]) => process.env.STORAGE_MODE === 'sql' ? sqlRepositoryInstance[method](...args) : nosqlRepositoryInstance[method](...args);
      });

      return repository as Base;
    },
    inject: [sqlRepository, nosqlRepository],
  };
}