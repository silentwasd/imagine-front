import type TagResource from "~/resources/TagResource";

export default interface ImageResource {
    id: number;
    path: string;
    preview_path: string;
    created_at: string;

    tags: TagResource[];
}