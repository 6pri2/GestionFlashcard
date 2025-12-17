import express from 'express'
import authRouter from './routers/authRouter.js'
import collectionRouter from './routers/collectionRouter.js'
import logger from "./middleware/logger.js"

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(logger)

app.use('/auth', authRouter)
app.use('/collection', collectionRouter)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})