import CrudRepository from "~/repositories/CrudRepository";
import type ImageResource from "~/resources/ImageResource";

export default class ImageRepository extends CrudRepository<ImageResource, any> {
    protected baseUrl: string = '/images';
    protected override postFiles: boolean = true;

    public upload() {
        return this.client.upload(`${this.baseUrl}`, (data: any) => ({image: data}));
    }
}