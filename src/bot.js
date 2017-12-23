const Eris = require('eris')
const Config = require('../config.json')

let token = Config.bot.token
let bot = new Eris.CommandClient(token, {}, {
    name: 'Vitreus Color Bot',
    description: 'A Discord bot that allows users to change their chat colors.',
    owner: 'Techfoxis',
    prefix: '!'
})

bot.registerCommand('Ping', 'pong', {
    caseInsensitive: true,
    description: 'Pong!'
})
bot.registerCommand('Color', (msg, args) => {
    let member = msg.member
    let guild = member.guild
    let roleIds = guild.roles.map(x => {
        return x.id
    }) 

    for (let roleId of roleIds) {
        var role = guild.roles.find(x => x.id == roleId)

        for (let index = 0; index < Config.colors.length; index++) {
            serializedColorRole = Config.colors[index]

            if (role.name == serializedColorRole.name) {
                member.removeRole(role.id, "Clearfix Colors")
            }
        }
    }

    try {
        color = args.join(" ")

        let newRole = guild.roles.find(x => x.name.toLowerCase() == color.toLowerCase())
        member.addRole(newRole.id)

        bot.createMessage(msg.channel.id, `Hey! I've changed your color to ${color}. I have no eyes, but I bet you look great in it! :wink:`)
    } catch (error) {
        let colors = Config.colors.map(serializedRole => {
            return serializedRole.name
        })

        bot.createMessage(msg.channel.id, `Oi! That's not a color, but these are!\n\`\`\`${colors.join(', ')}.\`\`\``)
    }

}, {
    caseInsensitive: true,
    guildOnly: true,
    description: 'Sets Chat Color',
    usage: "!color <color>"
})

bot.on("ready", x => {
    console.log("ColorBot is ready!")
    createColorRoles()
})

bot.connect()

function createColorRoles() {

    bot.guilds.forEach(guild => {

        for (let index = 0; index < Config.colors.length; index++) {
            let serializedRole = Config.colors[index];

            var role = guild.roles.find(role => {
                if (role.name == serializedRole.name) {
                    return true;
                }
            })

            if (role == null) {
                console.log("Role does not exist; Creating " + serializedRole.name);
                guild.createRole({name: serializedRole.name, color: parseInt(serializedRole.color)});
            }
        }

    })

}