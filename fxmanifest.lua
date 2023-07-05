fx_version 'cerulean'
lua54 'yes'
game 'gta5'

shared_scripts {
    '@ox_lib/init.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'src/server/dist/index.js',
}

client_scripts {
    'src/client/data.lua',
    'src/client/client.lua',
}