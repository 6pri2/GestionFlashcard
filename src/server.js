import express from 'express'
import authRouter from './routers/authRouter.js'
import collectionRouter from './routers/collectionRouter.js'
import flashcardRouter from './routers/flashcardRouter.js'
import adminRouter from './routers/adminRouter.js' 
import logger from "./middleware/logger.js"

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(logger)

app.use('/auth', authRouter)
app.use('/collection', collectionRouter)
app.use('/flashcard',flashcardRouter)
app.use('/admin', adminRouter) 

if (process.env.NODE_ENV !== 'test') { //Ajout d'une condition pour ne pas lancer le serveur lorsque les tests automatique sont en cours d'execution
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}else {
  console.log('Server not started: running in test mode');
}

export default app;