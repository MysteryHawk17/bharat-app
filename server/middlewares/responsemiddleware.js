const successResponse = (res, data, message) => {
    res.status(200).json({ data: data, message: message })
}
const errorResponse = (res, message, statusCode) => {
    res.status(statusCode).json({ message: message })
}
const internalServerError = (res, message) => {
    res.status(500).json({ message: message })
}
const notFoundError = (res, message) => {
    res.status(404).json({ message: message })
}
const validationError = (res, message) => {
    res.status(400).json({ message: message })
}
module.exports = {successResponse,errorResponse,internalServerError,notFoundError,validationError}  