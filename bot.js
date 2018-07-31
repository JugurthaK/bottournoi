const Discord = require("discord.js");
const auth = require ("./auth");
const bot = new Discord.Client();
const fortnite = require("fortnite-api");


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

bot.on('message', (message) => {
    if (message.content === 'ping') {
        message.reply('pong !')
    }
});

bot.on('message', (message) => {
    if (message.content.startsWith("!tournoi") && message.channel.name === "bot_tournoi") {
        var member = message.member;
        var args = message.content.split(" ");
        var pseudo = args[1];
        var plateforme = args[2];

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

                            if (stats.lifetimeStats.matches >= 1000) {

                                if (stats.lifetimeStats['k/d'] >= 2 && stats.lifetimeStats['k/d'] <= 3.99) {
                                    role = member.guild.roles.find('name', '+2');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("**Vos rôles ont été ajoutés**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("``````Le joueur " + pseudo + " est inscrit au tournoi !``````");

                                } else if (stats.lifetimeStats['k/d'] >= 4 && stats.lifetimeStats['k/d'] <= 5.99) {
                                    role = member.guild.roles.find('name', '+4');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("**Vos rôles ont été ajoutés**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("```Le joueur " + pseudo + " est inscrit au tournoi !```");

                                } else if (stats.lifetimeStats['k/d'] >= 6 && stats.lifetimeStats['k/d'] <= 7.99) {
                                    role = member.guild.roles.find('name', '+6');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("**Vos rôles ont été ajoutés**");
                                    })
                                    member.setNickname(pseudo);
                                    message.reply("```Le joueur " + pseudo + " est inscrit au tournoi !```");

                                } else if (stats.lifetimeStats['k/d'] >= 8) {
                                    role = member.guild.roles.find('name', '+8');
                                    member.addRole(role).catch(console.error);
                                    member.createDM().then(channel => {
                                        return channel.send("**Vos rôles ont été ajoutés**");
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
});

bot.on('guildMemberAdd', (member) => {
    member.createDM().then(channel => {
        return channel.send("**Bienvenue sur le serveur** pour obtenir ton Rôle, utilise la commande **'!tournoi pseudoepicgames plateforme {pc/ps4/xb1}**' dans le channel **#bot_tournoi** \n Exemple : **!tournoi JugurthaK pc**");
    }).catch(console.error)
})

bot.login(auth.discordToken);
