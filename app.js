const Discord = require("discord.js");
const bot = new Discord.Client();
const request = require("request");

bot.on('ready', () => {
    console.log("Bot Connecté");
});

bot.on('message', (message) => {
    if (message.content === 'ping') {
        message.reply('pong !')
    }
});

bot.on('message', (message) => {
    if (message.content.startsWith("!tournoi") && message.channel.id == '472403117783121920') {
        var member = message.member;
        var args = message.content.split(" ");
        var pseudo = args[1];
        var plateforme = args[2];


        if (pseudo == undefined || plateforme == undefined) {
            member.createDM().then(channel => {
                return channel.send("**Vous n'avez pas spécifié de pseudonyme ou de plateforme**");
            })
        } else {

            var options = {
                method: "GET",
                url: `https://fortnite.y3n.co/v2/player/${pseudo}`,
                headers: {
                    'User-Agent': 'node js request',
                    'X-Key': 'GvHZrXutfChSYUyzS9jt'
                }
            }

            request(options, (error, res, body) => {
                if (!error && res.statusCode == 200) {
                    var stats = JSON.parse(body);

                    // gestion des plateformes
                    if (plateforme == "ps4") {
                        var reqFortnite = stats.br.stats.ps4.all.kpd;
                        var reqFortniteKills = stats.br.stats.ps4.all.matchesPlayed;

                        var role = member.guild.roles.find('name', 'PS4');
                        member.addRole(role).catch(console.error);
                    } else if (plateforme == "pc") {
                        var reqFortnite = stats.br.stats.pc.all.kpd;
                        var reqFortniteKills = stats.br.stats.pc.all.matchesPlayed;

                        var role = member.guild.roles.find('name', 'PC');
                        member.addRole(role).catch(console.error);

                    } else if (plateforme == "xb1") {
                        var reqFortnite = stats.br.stats.xb1.all.kpd;
                        var reqFortniteKills = stats.br.stats.xb1.all.matchesPlayed;
                        var role = member.guild.roles.find('name', 'XB1');
                        member.addRole(role).catch(console.error);
                    } else {
                        member.createDM().then(channel => {
                            return channel.send("La **plateforme selectionnée est invalide**, je vous rappelle que les trois choix sont pc / ps4 / xb1");
                        })
                    }

                    // gestion des kills & KDA
                    if (reqFortniteKills >= 1000) {
                        if (reqFortnite >= 2 && reqFortnite <= 3.99) {
                            var role = member.guild.roles.find('name', '+2');
                            member.addRole(role).catch(console.error);
                            member.createDM().then(channel => {
                                return channel.send("**Vos rôles ont été ajoutés**");
                            })
                            member.setNickname(pseudo);
                            message.reply("Le joueur "+pseudo+" est inscrit au tournoi !");
                        } else if (reqFortnite >= 4 && reqFortnite <= 5.99) {
                            var role = member.guild.roles.find('name', '+4');
                            member.addRole(role).catch(console.error);
                            member.createDM().then(channel => {
                                return channel.send("**Vos rôles ont été ajoutés**");
                            })
                            member.setNickname(pseudo);
                            message.reply("Le joueur "+pseudo+" est inscrit au tournoi !");
                        } else if (reqFortnite >= 6 && reqFortnite <= 7.99) {
                            var role = member.guild.roles.find('name', '+6');
                            member.addRole(role).catch(console.error);
                            member.createDM().then(channel => {
                                return channel.send("**Vos rôles ont été ajoutés**");
                            })
                            member.setNickname(pseudo);
                            message.reply("Le joueur "+pseudo+" est inscrit au tournoi !");
                        } else if (reqFortnite >= 8) {
                            var role = member.guild.roles.find('name', '+8');
                            member.addRole(role).catch(console.error);
                            member.createDM().then(channel => {
                                return channel.send("**Vos rôles ont été ajoutés**");
                            })
                            member.setNickname(pseudo);
                            message.reply("Le joueur "+pseudo+" est inscrit au tournoi !");
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
                } else {
                    member.createDM().then(channel => {
                        channel.send("Désolé une erreur s'est produite, contactez l'administrateur avec ce code: " + res.statusCode);
                        return channel.send("Si le code est 404, dans ce cas, vérifiez bien que vous avez renseigné **votre pseudo Epic Games** et non pas votre pseudo PSN/XB1");
                    })
                }
            });

        }
    }
})

bot.on('guildMemberAdd', (member) => {
    member.createDM().then(channel => {
        channel.send("**Bienvenue sur le serveur** pour obtenir ton Rôle, utilise la commande **'!tournoi pseudoepicgames plateforme {pc/ps4/xb1}**' dans le channel **#bot_tournoi**");
        return channel.send("Exemple : **!tournoi JugurthaK pc**");
    }).catch(console.error)
})

bot.login("NDcyMzU1MjE0MTQyMjEwMDcw.DjzEUQ.ElX_5HReuEK7hoMss5GvyiI7LHg");