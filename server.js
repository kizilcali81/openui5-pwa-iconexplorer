const port = process.env.PORT || 8819
const express = require('express')
express()
	.use(express.static('src'))
	.listen(port, () => console.log(`openui5 icon explorer pwa sample is live on port ${port}`))