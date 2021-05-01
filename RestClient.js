export class RestClient{
    headers = { 'Content-Type': 'application/json' }
    constructor(headers){
        this.headers = Object.assign(this.headers, headers)
    }
    async post(url, body){
        console.log('dingo sending this body', body.stuff)
        const requestOptions = {
            headers: { 
                'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }
        const fetchResponse = await fetch(url, requestOptions);
        if(!fetchResponse.ok){
            throw new Error(`Error Posting Data to Server`, fetchResponse)
        }
        return fetchResponse.json();
    }

    async get(url){
        const requestOptions = {
            headers: { 
                'Content-Type': 'application/json' },
            method: 'GET'
        }
        const fetchResponse = await fetch(url, requestOptions);
        if(!fetchResponse.ok){
            throw new Error('Error Getting Data From Server', fetchResponse);
        }
        return fetchResponse.json();

    }

    async put(){

    }

    async delete(url){
        const requestOptions = {
            headers: { 
            'Content-Type': 'application/json' },
            method: 'DELETE'
        }
        const fetchResponse = await fetch(url, requestOptions);
        if(!fetchResponse.ok){
            throw new Error('Error Getting Data From Server', fetchResponse);
        }
        return fetchResponse.json();

    }
}