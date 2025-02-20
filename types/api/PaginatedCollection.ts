import type Collection from "~/types/api/Collection";

export default interface PaginatedCollection<T> extends Collection<T> {
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        from: number;
        to: number;
        total: number;
    }
}