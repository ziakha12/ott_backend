class apiResponse {
    constructor(statuscode, message='success', success, data){
        this.statuscode = statuscode,
        this.data = data
        this.message = message
        this.success = statuscode < 400
    }
}

export {apiResponse}