const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log('Test environment is: ' + env)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'haj642430@abv.bg',
    userPassword: 'parola123'
}

// switching between env

if(env === 'qa') {
    config.userEmail = 'hajtest@abv.bg',
    config.userPassword = 'parola123412121235'
}

if(env === 'prod') {
    config.userEmail = 'haj22test@abv.bg',
    config.userPassword = 'par22ola123412121235'
}

export {config}