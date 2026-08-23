export abstract class BaseRepository<
  TCreate,
  TUpdate,
  TResult
> {
  abstract findAll(): Promise<TResult[]>;

  abstract findById(id: string): Promise<TResult | null>;

  abstract create(data: TCreate): Promise<TResult>;

  abstract update(
    id: string,
    data: TUpdate
  ): Promise<TResult>;

  abstract delete(id: string): Promise<TResult>;
}