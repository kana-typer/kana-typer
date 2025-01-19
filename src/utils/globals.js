export const isDev = () => process.env?.NODE_ENV === 'development'

export const isProd = () => process.env?.NODE_ENV === 'production' || process.env?.NODE_ENV === undefined

export const isTest = () => process.env?.NODE_ENV === 'test'
