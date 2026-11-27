class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)  // taking message from Error class
        this.statusCode = statusCode
        this.data = null //read (if suppose user don't exist then there is no data to send so frontend has to check if there is data or not 
        // but instead if we use data = null there is only 2 possibilities if data is there or null will be there)
        this.message = message
        this.success = false; // if it is detecting the success flag it should be considered as false
        this.errors = errors

        if (stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export { ApiError }  