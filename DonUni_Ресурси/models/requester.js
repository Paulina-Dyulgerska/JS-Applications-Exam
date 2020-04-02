const baseURL = `https://jsadvancedexam.firebaseio.com`;

function createAuthorization(type) {
    return type === 'Basic'
        // ? `Basic ${btoa(`${appKey}:${appSecret}`)}` 
        ? `Basic Og==`
        : `Kinvey ${sessionStorage.getItem('authtoken')}`
}

function createHeaders(httpMethod, data, type) {
    const headers = {
        method: httpMethod,
        headers: {
            "Authorization": createAuthorization(type),
            // "Authorization": "Basic Og==",
            "Content-Type": "application/json",
        }
    }

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        headers.body = JSON.stringify(data);
    }

    return headers;
}

function handleError(e) {
    if (!e.ok) {
        throw new Error(e.statusText);
    }
    return e;
}

function serializeData(x) {
    return x.json();
}

function fetchData(url, headers) {
    return fetch(url, headers)
        .then(handleError)
        .then(serializeData)
}

function serializeTemplate(x) {
    return x.text();
}

function fetchTemplate(url, headers) {
    return fetch(url, headers)
        .then(handleError)
        .then(serializeTemplate)
}

export function get() { //endPoint sega e 'books.json'
    const headers = createHeaders('GET');
    const url = `${baseURL}`;

    return fetchData(url, headers);
}

export function post(endPoint, data) { //endPoint sega e 'books.json'
    const headers = createHeaders('POST', data);
    const url = `${baseURL}${endPoint}`;

    return fetchData(url, headers);
}

export function put(endPoint, id, data) { //endPoint sega e 'books'
    const headers = createHeaders('PUT', data);
    const url = `${baseURL}${endPoint}/${id}.json`;

    return fetchData(url, headers);
}

export function patch(endPoint, id, data) { //endPoint sega e 'books'
    const headers = createHeaders('PATCH', data);
    const url = `${baseURL}${endPoint}/${id}.json`;

    return fetchData(url, headers);
}

export function del(endPoint, id) { //endPoint sega e 'books'
    const headers = createHeaders('DELETE');
    const url = `${baseURL}${endPoint}/${id}.json`;

    return fetchData(url, headers);
}

export function getTemplate(url) {
    const headers = createHeaders('GET');

    return fetchTemplate(url, headers);
}