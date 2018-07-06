const node_ssh = require('node-ssh')
const messages = require('./messages')
const apps = require('../apps')

const deniedCommands = [
	':(){ :|: & };:', ' /', 'rm ', 'sudo ', 'su ', 'mkfs', '> /dev/sd', 'dd if=', 'mv ~ /dev/null', 'wget',
	'halt', 'shutdown'
]

const connectInApp = async (bot, message, appName, command) => {
	if (!(appName in apps)) throw 'Ooh no :cry:, <@{user}> the `{project}` app not exists.'
	const ssh = new node_ssh()

	await ssh.connect(apps[appName]).then(async () => {
		await ssh.execCommand(command, { cwd: apps[appName].path }).then(async result => {
	    await ssh.dispose()

	    await bot.reply(
				message,
				messages.done
					.replace('{user}', message.user)
					.replace('{command}', command)
					.replace('{project}', appName)
					.replace('{output}', result.stdout || result.stderr)
			)
	  })
	})
}

module.exports = {
	exec: (bot, message, body, app) => new Promise(async (resolve, reject) => {
		try {
			body = body.replace(app, '').trim()
			if (body === '') throw '<@{user}> the `exec` command should have an command for run remotely.'

			if (!deniedCommands.every(i => !body.includes(i))) {
				throw 'Nooo <@{user}> :rage:, do not kludge in the `{project}` project.'
			}
			await connectInApp(bot, message, app, body)
			setTimeout(() => resolve(), 1000)
		} catch(e) {
			await bot.reply(message, e.replace('{user}', message.user).replace('{project}', app))
		}
	}),

	push: (bot, message, body, app) => new Promise(async (resolve, reject) => {
		try {
			await connectInApp(bot, message, app, 'bash deploy.sh')

			setTimeout(() => resolve(), 1000)
		} catch(e) {
			await bot.reply(message, e.replace('{user}', message.user).replace('{project}', app))
		}
	}),

	list: (bot, message, body, app) => new Promise(async (resolve, reject) => {

		const list = Object.keys(apps).reduce((ac, it) => `${ac}  - ${it}\n`, '')

		await bot.reply(message, list.replace('{user}', message.user))
		setTimeout(() => resolve(), 1000)
	}),

}
