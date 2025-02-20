import Repository from "~/repositories/Repository";
import type Resource from "~/types/api/Resource";

export default abstract class SingletonCrudRepository<T, ID> extends Repository {
    protected abstract baseUrl: string;
    protected postFiles: boolean = false;
    protected putFiles: boolean  = false;

    public store<R = void>(data: T): Promise<R> {
        return this.client.post<R>(this.baseUrl, data, this.postFiles);
    }

    public show<R = Resource<T>>(key: string) {
        return this.client.getData<R>(key, `${this.baseUrl}`);
    }

    public get<R = Resource<T>>(): Promise<R> {
        return this.client.get<R>(`${this.baseUrl}`);
    }

    public update<R = void>(data: T): Promise<R> {
        return this.client.put<R>(`${this.baseUrl}`, data, this.putFiles);
    }

    public remove(id: ID): Promise<void> {
        return this.client.delete<void>(`${this.baseUrl}`);
    }
}