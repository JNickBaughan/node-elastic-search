const express = require("express");
const bodyParser = require("body-parser")
const { Client } = require("@elastic/elasticsearch")
const data = require("./data.js")

const middlewares = [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true })
]

const app = express();
app.use(...middlewares);

const elasticClient = new Client({
    node: "http://localhost:9200"
})

const index = "elastic-search.test";
const alias = "elastic-search.test.alias"

let indexHasBeenCreated = false;

const createIndex = async () => {
    await elasticClient.indices.create({ index, body: {
        mappings: {
            properties: { id: { type: "keyword"}, name: { type: "keyword"}}
        }
    }})
}

const setAlias = async () => {
    
    const aliasesResult = await elasticClient.cat.aliases({
        format: "json",
        name: alias
    })
    
    const indexesPointedToByAlias = aliasesResult.body.map(a => a.index);
    
    if(indexesPointedToByAlias && indexesPointedToByAlias?.length){
        
        await elasticClient.indices.deleteAlias({
            index: indexesPointedToByAlias,
            name: alias
        })
    }
    
    await elasticClient.indices.putAlias({
        index,
        name: alias
    });
    
    return true;
}

const createIndexIfNotExist = async () => {
    
    if(indexHasBeenCreated){
        return true;
    }

    const indexExists = await elasticClient.indices.exists({
        index
    })

    if(!indexExists.body){
        await createIndex();
        await setAlias();

        indexHasBeenCreated = true;
    }
}

const indexData = async (data) => {
    await createIndexIfNotExist();
    await elasticClient.index({
        index, 
        id: data.id,
        body: data
    })
}


app.get("/index-all", async (req, res) => {
    const all = data.map(async d => {
        await indexData(d);
    });

    await Promise.all(all);
    res.send(200);
})

app.listen(5000, () => {
    console.log(`app started on port 5000`)
})



