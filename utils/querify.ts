export default function (params: any): URLSearchParams {
    const filtered = new URLSearchParams();

    Object.keys(params).forEach((key: string) => {
        if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => filtered.append(`${key}[]`, value));
            return;
        }

        filtered.append(key, params[key]);
    });

    return filtered;
}