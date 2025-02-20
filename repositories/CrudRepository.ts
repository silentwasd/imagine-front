import Repository from "~/repositories/Repository";
import type Collection from "~/types/api/Collection";
import type Resource from "~/types/api/Resource";

export default abstract class CrudRepository<T, ID> extends Repository {
    protected abstract baseUrl: string;
    protected postFiles: boolean = false;
    protected putFiles: boolean  = false;

    public list<C = Collection<T>>(key: string) {
        return this.client.getData<C>(key, this.baseUrl);
    }

    public fetchList<C = Collection<T>>(data?: any) {
        return this.client.get<C>(this.baseUrl + (data ? ('?' + querify(data).toString()) : ''));
    }

    public lazyList<C = Collection<T>>(request: () => any) {
        return this.client.getLazyFetch<C>(
            () => `${this.baseUrl}?${querify(request()).toString()}`
        );
    }

    public store<R = void>(data: Partial<T>): Promise<R> {
        return this.client.post<R>(this.baseUrl, data, this.postFiles);
    }

    public show<R = Resource<T>>(key: string, id: ID) {
        return this.client.getData<R>(key, `${this.baseUrl}/${id}`);
    }

    public get<R = Resource<T>>(id: ID) {
        return this.client.get<R>(`${this.baseUrl}/${id}`);
    }

    public update<R = void>(data: Partial<T>): Promise<R> {
        return this.client.put<R>(`${this.baseUrl}/${this.getId(data)}`, data, this.putFiles);
    }

    public remove(id: ID): Promise<void> {
        return this.client.delete<void>(`${this.baseUrl}/${id}`);
    }

    protected getId(data: T): ID {
        return (data as any).id;
    }
}