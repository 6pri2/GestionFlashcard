const logger = (req, res, next ) => {
    const { method, host } = req
    const time = new Date().toLocaleTimeString('fr-FR')

    console.log(`${time} : ${method} - ${host}`)

    //Si dernier middleware dans la pile => res.send()
    //sinon toujours appeler next()
    next()

}

export default logger