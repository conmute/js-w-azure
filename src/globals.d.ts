declare namespace NodeJS {
    interface ProcessEnv {
        readonly AZURE_AD_B2C_TENANT_NAME: string
        readonly AZURE_AD_B2C_CLIENT_ID: string
        readonly AZURE_AD_B2C_TENANT_ID: string
        readonly AZURE_AD_B2C_CLIENT_SECRET: string
        readonly AZURE_AD_B2C_PRIMARY_USER_FLOW: string

        readonly AZURE_COSMOS_ENDPOINT_URL: string
        readonly AZURE_COSMOS_RW_PRIMARY_KEY: string
        readonly AZURE_COSMOS_R_PRIMARY_KEY: string
        readonly AZURE_COSMOS_DB_NAME: string

        readonly AZURE_BLOB_STORAGE_ACCOUNT_NAME: string
        readonly AZURE_BLOB_STORAGE_KEY: string
        readonly AZURE_BLOB_STORAGE_CONNECTION_STRING: string
        readonly AZURE_BLOB_STORAGE_URL: string

        readonly LINKEDIN_CLIENT_ID: string
        readonly LINKEDIN_CLIENT_SECRET: string

        readonly NEXTAUTH_SECRET: string
        readonly NEXTAUTH_URL: string

        readonly ACCESS_CONFIG_SECRET: string
    }
}
