const Discord = require("discord.js");
const auth = require("./auth");
const bot = new Discord.Client();
const fortnite = require("fortnite-api");

let auth_discord_ftn = [];
let fn = key => {
    let temp = {}
    if ((temp = auth_discord_ftn.find(x => Object.keys(x).find(y => y === key))))
        temp = temp[Object.keys(temp)[0]]
    return temp
}

let inscrit = [];

let fortniteAPI = new fortnite([
    auth.fortniteEmail,
    auth.fortnitePassword,
    auth.fortniteCliKey,
    auth.fortniteGameKey
], {
        debug: true
    });

bot.on('ready', () => {
    console.log("Bot Connecté");
});

bot.on('message', (message, user) => {
    if (message.content === 'ping') {
        message.reply('pong !')
        console.log
    }
});

bot.on('message', (message) => {
    if (message.content.startsWith("!tournoi") && message.channel.name === "bot_tournoi") {
        let member = message.member;
        let args = message.content.split(" ");
        let pseudo = args[1];
        let plateforme = args[2];

        if (pseudo == undefined || plateforme == undefined) {
            member.createDM().then(channel => {
                return channel.send("**Vous n'avez pas spécifié de pseudonyme ou de plateforme**");
            })
        }

        else {
            fortniteAPI.login().then(() => {
                if (fortniteAPI.checkPlayer(pseudo, plateforme)) {
                    fortniteAPI.getStatsBR(pseudo, plateforme, "alltime")
                        .then(stats => {
                            let role = member.guild.roles.find("name", plateforme.toUpperCase());
                            member.addRole(role).catch(console.error);
                            let ftnAccountId = stats.info.accountId;
                            console.log(ftnAccountId);
                           
                            if (member.roles.has(member.guild.roles.find("name", "Certifié").id)){
                                member.removeRole(member.guild.roles.find("name", "Certifié").id);
                                message.author.sendMessage("Votre compte n'est plus Certificé car vous vous êtes inscrit sous un nouveau Pseudo");
                            }

                            if (stats.lifetimeStats.matches >= 1000) {

                                // Ajout des élements pour authentifier
                                if (stats.lifetimeStats['k/d'] >= 2) {
                                    auth_discord_ftn.push({ [member.id]: ftnAccountId });
                                }

                                if (stats.lifetimeStats['k/d'] >= 2 && stats.lifetimeStats['k/d'] <= 3.99) {
                                    role = member.guild.roles.find('name', '+2');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("Vos rôles ont été ajoutés, \n Pour vous authentifier, vous devez désormais taper la commande **!auth votreidfortnite** en DM \n Si vous ne savez pas comment obtenir cet id, regardez dans le channel **#aide**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("```Le joueur " + pseudo + " est inscrit au tournoi !```");

                                } else if (stats.lifetimeStats['k/d'] >= 4 && stats.lifetimeStats['k/d'] <= 5.99) {
                                    role = member.guild.roles.find('name', '+4');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("Vos rôles ont été ajoutés, \n Pour vous authentifier, vous devez désormais taper la commande **!auth votreidfortnite** en DM \n Si vous ne savez pas comment obtenir cet id, regardez dans le channel **#aide**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("```Le joueur " + pseudo + " est inscrit au tournoi !```");


                                } else if (stats.lifetimeStats['k/d'] >= 6 && stats.lifetimeStats['k/d'] <= 7.99) {
                                    role = member.guild.roles.find('name', '+6');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("Vos rôles ont été ajoutés, \n Pour vous authentifier, vous devez désormais taper la commande **!auth votreidfortnite** en DM \n Si vous ne savez pas comment obtenir cet id, regardez dans le channel **#aide**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("```Le joueur " + pseudo + " est inscrit au tournoi !```");

                                } else if (stats.lifetimeStats['k/d'] >= 8) {
                                    role = member.guild.roles.find('name', '+8');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("Vos rôles ont été ajoutés, \n Pour vous authentifier, vous devez désormais taper la commande **!auth votreidfortnite** en DM \n Si vous ne savez pas comment obtenir cet id, regardez dans le channel **#aide**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("```Le joueur " + pseudo + " est inscrit au tournoi !```");

                                } else {
                                    member.createDM().then(channel => {
                                        return channel.send("**Désolé, votre KDA est trop bas pour participer à ce tournoi**");
                                    })
                                    member.setNickname(pseudo);
                                }

                            } else {
                                member.createDM().then(channel => {
                                    return channel.send("**Désolé vous n'avez pas joué suffisamment de games pour participer à ce tournoi**");
                                })
                            }
                        })
                        .catch(err => {
                            member.createDM().then(channel => {
                                return channel.send("*Plateforme ou pseudo invalide*");
                            })
                        });
                }
            });
        }
    }

    if (message.content.startsWith("!auth")) {
        
        if (message.channel.type === "dm") {
            
            let args = message.content.split(" ");
            let role = bot.guilds.get('472356854232514560').roles.find(role => role.name === "Certifié");
            bot.guilds.get('472356854232514560').members.get(message.author.id).addRole(role);
            let id = args[1];

            if (id === fn(message.author.id)) {
                message.author.createDM().then(channel => {
                    return channel.send("*Compte certifié*");
                })

                inscrit.push(message.author.username);
           
            } else {
                message.author.createDM().then(channel => {
                    return channel.send("**L'identifiant est erroné, si vous avez besoin d'aide, renseignez vous sur le channel '#aide**");
                })
            }
        
        } else {
            message.author.sendMessage("Votre clé d'authentification doit être envoyé par DM, et non dans un Channel").then(() => {
                message.delete(1000);
            }).catch()
        }
    }

    if (message.content.startsWith("!inscrits")){
        message.reply("Les inscrits sont: "+ inscrit);
    }
});

bot.on('guildMemberAdd', (member) => {
    member.createDM().then(channel => {
        return channel.send("**Bienvenue sur le serveur** pour obtenir ton Rôle, utilise la commande **'!tournoi pseudoepicgames plateforme {pc/ps4/xb1}**' dans le channel **#bot_tournoi** \n Exemple : **!tournoi JugurthaK pc**");
    }).catch(console.error)
})

bot.login(auth.discordToken);
