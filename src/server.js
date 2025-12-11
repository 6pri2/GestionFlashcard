import express from 'express'
import usersRouter from './routers/authRouter'

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(logger)

app.use('/auth', authRouter)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})