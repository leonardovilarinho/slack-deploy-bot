require('dotenv').config()
const botkit = require('botkit')
const messages = require('./messages')
const commands = require('./commands')
const express = require('express')
const app = express()

const { DEBUG, TOKEN } = process.env

if (!TOKEN) {
	console.error('[ERR] slack token not found')
	process.exit(1)
}

const controller = botkit.slackbot({
	debug: DEBUG || false,
})

const bot = controller.spawn({
	token: process.env.TOKEN
})

bot.startRTM((err, bot, payload) => {
  if (err) {
  	console.error('[ERR] in connection with slack')
  	process.exit(1)
  }
})

controller.hears(['d:'], 'ambient', async (bot, message) => {
	const { text } = message
	const messageBody = text.split(/:(.+)/).map(i => i.trim())
	const commandBody = messageBody.length > 1 ? messageBody[1].split(' ').map(i => i.trim()) : []
	const command = commandBody.filter((i, k) => k !== 0 && k !== 1)

	if (messageBody.length <= 1 || commandBody.length <= 1 || !(commandBody[0] in commands)) {
		return bot.reply(
			message,
			messages.help
				.replace('{command}', text)
				.replace('{user}', message.user)
		)
	}

	const commandName = commandBody[0]
	const projectName = commandBody[1]
	
	await bot.reply(
		message,
		messages.loading
			.replace('{user}', message.user)
			.replace('{project}', projectName)
	)

	setTimeout(async () => {
		await commands[commandName](bot, message, command.join(' '), projectName)
	}, 1000)
})


app.get('*', (req, res) => {
  res.send('hello world')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
})