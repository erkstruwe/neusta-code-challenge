jasmine.getExpressResponse = () => {
    const expressResponseFunctions = ['status', 'send', 'json', 'error']
    const response = jasmine.createSpyObj('expressResponse', expressResponseFunctions)
    expressResponseFunctions.forEach((expressResponseFunction) => {
        response[expressResponseFunction].and.returnValue(response)
    })
    return response
}
