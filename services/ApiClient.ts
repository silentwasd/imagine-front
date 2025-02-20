export default class ApiClient {
    protected baseURL: string;
    protected overrideToken: string | null;

    constructor(baseURL: string = '', overrideToken: string | null = null) {
        const config = useRuntimeConfig();

        if (!baseURL)
            this.baseURL = config.public.apiUrl;
        else
            this.baseURL = baseURL;

        this.overrideToken = overrideToken;
    }

    protected accessMiddleware(options: any): any {
        const {state: token} = useToken();

        if (this.overrideToken || token.value) {
            if (!options.hasOwnProperty('headers'))
                options.headers = {};

            options.headers.Authorization = `Bearer ${this.overrideToken ?? token.value}`;
        }

        return options;
    }

    private buildFormData(data: any): FormData {
        const form = new FormData();

        for (const key in data) {
            if (data[key] === null || data[key] === undefined)
                continue;

            if (Array.isArray(data[key])) {
                data[key].forEach((item: any, index: number) => form.append(`${key}[${index}]`, item));
            } else {
                let item = data[key];

                if (item === true || item === false)
                    item = item === true ? 1 : 0;

                form.append(key, item);
            }
        }

        return form;
    }

    public get<Type>(request: string): Promise<Type> {
        return $fetch<Type>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL,
                headers: {
                    Accept: 'application/json'
                }
            }
        ));
    }

    public getFile(request: string): Promise<Blob> {
        return $fetch<Blob>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL
            }
        ));
    }

    public post<Type>(request: string, data: any = {}, asMultipart: boolean = false): Promise<Type> {
        const headers: any = {};

        if (asMultipart)
            data = this.buildFormData(data);

        return $fetch<Type>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL,
                headers: {
                    Accept: 'application/json',
                    ...headers
                },
                method : 'POST',
                body   : data
            }
        ));
    }

    public put<Type>(request: string, data: any = {}, asMultipart: boolean = false): Promise<Type> {
        const headers: any = {};

        if (asMultipart) {
            data = this.buildFormData(data);
            data.append('_method', 'PUT');
        }

        return $fetch<Type>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL,
                headers: {
                    Accept: 'application/json',
                    ...headers
                },
                method : asMultipart ? 'POST' : 'PUT',
                body   : data
            }
        ));
    }

    public patch<Type>(request: string, data: any = {}, asMultipart: boolean = false): Promise<Type> {
        const headers: any = {};

        if (asMultipart) {
            data = this.buildFormData(data);
            data.append('_method', 'PATCH');
        }

        return $fetch<Type>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL,
                headers: {
                    Accept: 'application/json',
                    ...headers
                },
                method : asMultipart ? 'POST' : 'PATCH',
                body   : data
            }
        ));
    }

    public delete<Type>(request: string, data: any = {}, asMultipart: boolean = false): Promise<Type> {
        const headers: any = {};

        if (asMultipart) {
            data = this.buildFormData(data);
            data.append('_method', 'DELETE');
        }

        return $fetch<Type>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL,
                headers: {
                    Accept: 'application/json',
                    ...headers
                },
                method : asMultipart ? 'POST' : 'DELETE',
                body   : data
            }
        ));
    }

    public getData<Type>(key: string, request: string) {
        return useAsyncData<Type>(key, () => this.get<Type>(request));
    }

    public getLazyFetch<Type>(request: () => string) {
        return useLazyFetch<Type>(request, this.accessMiddleware(
            {
                baseURL: this.baseURL,
                headers: {
                    Accept: 'application/json'
                }
            }
        ));
    }

    public upload(request: string, map: (data: any) => any = (data) => data) {
        let xhr: XMLHttpRequest;

        const progress      = ref<number>(0);
        const buildFormData = this.buildFormData;

        function send(data: any): Promise<XMLHttpRequest> {
            return new Promise((resolve, reject) => {
                xhr = new XMLHttpRequest();

                const config = useRuntimeConfig();
                const {state: token}  = useToken();

                xhr.open('POST', `${config.public.apiUrl}${request}`, true);

                if (token.value)
                    xhr.setRequestHeader('Authorization', `Bearer ${token.value}`);

                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        progress.value = (event.loaded / event.total) * 100;
                    }
                };

                xhr.onload = function () {
                    if ([200, 201].includes(xhr.status)) {
                        resolve(xhr);
                    } else {
                        reject(xhr);
                    }
                };

                xhr.onerror = function () {
                    reject(xhr);
                };

                progress.value = 0;

                xhr.send(buildFormData(map(data)));
            });
        }

        function abort() {
            xhr.abort();
        }

        return {send, abort, progress};
    }
}