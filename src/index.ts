import express, {NextFunction, Request, Response} from 'express'
import {client, runDb} from "./db";
import {app} from "./app";

const PORT = 5000
app.set('trust proxy', true)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello!')
})


const startApp = async () => {
    await runDb()
    app.listen(5000, () => {
        console.log(`START on PORT ${5000}`)
    })

}
startApp()
