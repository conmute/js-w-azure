import { CosmosClient } from "@azure/cosmos"

const config = {
    endpoint: process.env.AZURE_COSMOS_ENDPOINT_URL,
    key:  process.env.AZURE_COSMOS_RW_PRIMARY_KEY,
    database: process.env.AZURE_COSMOS_DB_NAME,
    container: process.env.AZURE_COSMOS_CONTAINER_NAME,
}

const client = new CosmosClient({
    endpoint: config.endpoint,
    key: config.key,
});

export const db = client.database(config.database);

export const containers = {
    main: db.container('delve_main'),
    test: db.container('test'),
}
