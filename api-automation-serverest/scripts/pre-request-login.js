const postRequest = {
    url: pm.environment.get("baseUrl") + "/login",
    method: "POST",
    body: {
        mode: "raw",
        options: {
            raw: {
                language: "json"
            }
        },
        raw: JSON.stringify({
            email: "fulano@qa.com",
            password: "teste"
        })
    }
}

pm.sendRequest(postRequest, function (err, res){
    let responseJson = res.json()
    let auth = responseJson["authorization"].split(" ")
    console.log(auth[1])
    pm.environment.set("token", auth[1])
})