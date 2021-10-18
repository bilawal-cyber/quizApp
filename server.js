const app = require('./index')
let port =process.env.PORT || 5000
app.listen(port, (err) => {
    if (err) throw err
    console.log(`Server is running on http://127.0.0.1:${port}`)
})