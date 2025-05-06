import 'dotenv/config'

export const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    DATABASE_NAME : process.env.DATABASE_NAME,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    AUTHOR: process.env.AUTHOR,
    BUILD_MODE: process.env.BUILD_MODE,

    WEBSITE_DOMAIN_DEV: process.env.WEBSITE_DOMAIN_DEV,
    WEBSITE_DOMAIN_PROD: process.env.WEBSITE_DOMAIN_PROD,

    BREVO_API_KEY: process.env.BREVO_API_KEY,
    ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
    ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE
}