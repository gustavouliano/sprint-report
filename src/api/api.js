const express = require('express')
const cors = require('cors');
const app = express()
const port = 3001

app.use(cors());
app.use(express.json());

app.get('/api/proxy/:issueId', async (req, res) => {
    const issueId = req.params.issueId
    const response = await fetch(
        'http://fabtec.ifc-riodosul.edu.br/issues.json?issue_id=' + Number(issueId) + '&key=b7c238adc2c0af943c1f0fa9de6489ce190bd6d5&status_id=*'
    );
    const data = await response.json();
    return res.json(data);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})