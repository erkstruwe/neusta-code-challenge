export function methodNotAllowedResponse(req, res) {
    res.status(405).json(null)
}
