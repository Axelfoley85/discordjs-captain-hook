import dotenv from 'dotenv'
dotenv.config()

export const config = {
    clientId: process.env.clientId || 'foo',
    guildId: process.env.guildId || '7565',
    token: process.env.token || 'foo',
    hookChannel: process.env.hookChannel || '0000',
    voteChannel: process.env.voteChannel || '000',
    adminChannel: process.env.adminChannel || '1234',
    debugChannel: process.env.debugChannel || '5678',
    attendanceChannel: process.env.attendanceChannel || '0000',
    wMGeneralChannel: process.env.wMGeneralChannel || '0000',
    wMCharacterSheetsChannel: process.env.wMCharacterSheetsChannel || '0000',
    wMCharacterIntroductionChannel: process
        .env.wMCharacterIntroductionChannel || '0000',
    wMDiscussionChannel: process.env.wMDiscussionChannel || '0000',
    default: {
        username: process.env.username || null,
        password: process.env.password || null,
        database: process.env.database || 'test.sqlite',
        host: process.env.host || 'test.sqlite',
        dialect: process.env.dialect || 'sqlite'
    },
    timezone: process.env.timezone || 'Europe/Berlin'
}
