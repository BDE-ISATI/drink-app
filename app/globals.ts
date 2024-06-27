export async function send(body: Object, method: string, alert_and_reload = true): Promise<Response> {

    let req = await fetch("https://rnwlvwlnab.execute-api.eu-west-3.amazonaws.com/Prod/users/update", {
        method: method,
        body: JSON.stringify(body),
    })

    let resp = await req.json()

    if (alert_and_reload) {
        //alert(resp.message)
        location.reload();
    }

    return req
}