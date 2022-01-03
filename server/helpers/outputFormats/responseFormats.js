/**
 * @param resultCode httpStatus Code,
 * @data data Data send to client
 */

export function respondFormat(resultCode, data, message) {
    return {
        result: resultCode,
        data,
        message
    }

}