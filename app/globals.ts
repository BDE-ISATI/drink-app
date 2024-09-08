export async function send(where :string,body: Object, method: string, alert_and_reload = true): Promise<Response> {

    let req = await fetch(`https://g3q87iuiw0.execute-api.eu-west-3.amazonaws.com/Prod/${where}/update`, {
        method: method,
        body: JSON.stringify(body),
    })

    let resp = await req.json()

    if (alert_and_reload) {
        location.reload();
    }

    return req
}