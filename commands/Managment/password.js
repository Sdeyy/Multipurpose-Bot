const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const passwordDB = require('../../Models/password.js');

module.exports = {
    name: "secret",
    description: "Commands password access.",
    options: [
        {
            name: "set",
            description: "Set password.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "password",
                    description: "Password",
                    type: "STRING",
                    required: true
                },
            ]
        },
        {
            name: "check",
            description: "Check password.",
            type: "SUB_COMMAND",
        },
        {
            name: "remove",
            description: "Remove a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to remove",
                    type: "USER",
                    required: true
                },
            ]
        },
        {
            name: "login",
            description: "Login.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "pass",
                    description: "Password.",
                    type: "STRING",
                    required: true
                },

            ],
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("password")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const Sub = interaction.options.getSubcommand(["set", "login", "check", "remove"]);
        const user = interaction.user;
        const aUser = interaction.options.getMember("user");
        const password = interaction.options.getString("password");
        const pass = interaction.options.getString("pass");

        const data = await passwordDB.findOne({guildID: interaction.guild.id})
        
            switch(Sub){

                case "set":

                    if(interaction.user.id != client.config.OWNERID) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

                const passAlert = new MessageEmbed()
                .setColor('ORANGE')
                .setTitle('⚠️ SECURIY ALERT')
                .setDescription(`Hey ${interaction.user.username}, the system password was changed, the new password is **${password}**`)

            if(!data){
                const passCreate = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setDescription(`Hey <@${interaction.user.id}>, the password was set successfully\n\nPassword: **${password}**`)
                passwordDB.create({ guildID: interaction.guild.id, password: password});

                user.send({embeds: [passAlert]});
                interaction.reply({embeds: [passCreate], ephemeral: true});
            } else {

                const passChanged = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setDescription(`Hey <@${interaction.user.id}>, the password was successfully changed\n\nNew Password: **${password}**`)

                user.send({embeds: [passAlert]});
                interaction.reply({embeds: [passChanged], ephemeral: true});
                await passwordDB.findOneAndUpdate({ guildID: interaction.guild.id, password: password })
            }

            break;
            case "check":

                if(!data) return;
                if(interaction.user.id != client.config.OWNERID ) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});
                const userwAccess = data.access;
                const passCheck = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setDescription(`The password is **${data.password}**\n\n**Users With Access**\n${userwAccess}`)

                interaction.reply({embeds: [passCheck], ephemeral: true})


            break;
            case "login":

                if(!data) return interaction.reply('No data found!');

                const owner = interaction.guild.members.cache.get(interaction.guild.ownerId);
                const check = await passwordDB.findOne({ guildID: interaction.guild.id, password: pass});
                const checkuser = await passwordDB.findOne({ guildID: interaction.guild.id, password: pass, access: interaction.user.id})

                if(checkuser) return interaction.reply('You already have access!');
                if(check){
                    const success = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`Successfully login.`)

                    const alertW = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('⚠️ SECURIY ALERT')
                    .setDescription(`The user ${interaction.user.tag} ||${interaction.user.id}|| accessed the list of users with secret permissions`)
                    if(client.config.PASSWORD.SEND_ALERT) {
                    owner.send({embeds: [alertW]});
                    }
                    interaction.reply({ embeds: [success], ephemeral: true})

                    check.access.push(`${interaction.user.id}`);
                    check.save();
                } else {
                    if(client.config.PASSWORD.SEND_ALERT) {
                    const alertE = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('⚠️ SECURIY ALERT')
                    .setDescription(`The ${interaction.user.tag} ||${interaction.user.id}|| user is trying to enter the list of users with secret permissions.`)
                    owner.send({ embeds: [alertE]});
                }
                    const wrong = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('Wrong Password.')

                    interaction.reply({ embeds: [wrong], ephemeral: true})
                }

            break;
            case "remove":

            if(interaction.user.id != client.config.OWNERID ) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

            const removeSuccess = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`User ${aUser} successfully removed`)

            const checks = await passwordDB.findOne({ guildID: interaction.guild.id, access: aUser.id});

            if(!checks) return interaction.reply({content: 'This user is not in the list!', ephemeral: true})

            let array = data.access;

            array = array.filter(x => x !== aUser.id)
            data.access = array;

            interaction.reply({embeds: [removeSuccess], ephemeral: true})
            await data.save();

            break;
         }
        }
    }
