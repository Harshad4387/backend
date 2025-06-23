class apierror extends Error {
    constructor(
        statuscode ,
        message = "something went wrong",
        errors = []
    )
    {
        super(message);
        this.statuscode = statuscode ,
        this.message = message,
        this.success = false ,
        this.errors = errors
    }
}

module.exports = apierror;