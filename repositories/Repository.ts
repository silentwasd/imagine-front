import ApiClient from "~/services/ApiClient";

export default class Repository {
    protected client: ApiClient;

    constructor() {
        this.client = new ApiClient();
    }
}