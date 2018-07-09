const node_ssh = require('node-ssh')
const messages = require('./messages')
const apps = require('../apps')

const deniedCommands = [
	':(){ :|: & };:', ' /', 'rm ', 'sudo ', 'su ', 'mkfs', '> /dev/sd', 'dd if=', 'mv ~ /dev/null', 'wget',
	'halt', 'shutdown'
]

const connectInApp = async (bot, message, appName, command, notUi = false, alias = null, pre = false) => {
	if (!(appName in apps)) throw messages.appnot
	const ssh = new node_ssh()

	await ssh.connect(apps[appName]).then(async () => {
		await ssh.execCommand(command, { cwd: apps[appName].path }).then(async result => {
	    await ssh.dispose()

	    const msg = result.stderr || result.stdout

	    if (notUi) return

	    if (msg.includes('exit code 1') || (result.stderr && !('jest' in apps[appName]))) {
	    	throw messages.error.replace('{command}', alias || command).replace('{error}', msg)
	    }

	    bot.reply(
				message,
				messages.done
					.replace('{user}', message.user)
					.replace('{command}', alias || command)
					.replace('{project}', appName)
					.replace('{output}', result.stdout || result.stderr)
			)

			if (pre) setTimeout(() => bot.reply(message, messages.deploying), 1200)
	  })
	})
}

const makePreDeploy = (app) => {
	if (!(app in apps)) throw messages.appnot

	const gitRepo = apps[app].git
	const str = `git clone ${gitRepo} .temp-deploy && cd .temp-deploy && git pull`

	return `${str} && bash pre-deploy.sh && cd .. && rm -rf .temp-deploy && git pull`
}

module.exports = {
	exec: (bot, message, body, app) => new Promise(async (resolve, reject) => {
		try {
			body = body.replace(app, '').trim()
			if (body === '') throw messages.remote

			if (!deniedCommands.every(i => !body.includes(i))) throw messages.kludge

			await connectInApp(bot, message, app, body)
			setTimeout(() => resolve(), 1000)
		} catch(e) {
			bot.reply(message, e.replace('{user}', message.user).replace('{project}', app))
		}
	}),

	push: (bot, message, body, app) => new Promise(async (resolve, reject) => {
		try {
			await connectInApp(bot, message, app, makePreDeploy(app), false, 'bash pre-deploy.sh', true)
			await connectInApp(bot, message, app, 'bash deploy.sh')

			setTimeout(() => resolve(), 1000)
		} catch(e) {
			await connectInApp(bot, message, app, 'rm -rf .temp-deploy', true)
			bot.reply(message, e.replace('{user}', message.user).replace('{project}', app))
		}
	}),

	list: (bot, message, body, app) => new Promise(async (resolve, reject) => {

		const list = Object.keys(apps).reduce((ac, it) => `      - \`${it}\`\n${ac}`, '')

		await bot.reply(message, messages.list.replace('{user}', message.user).replace('{list}', list))
		setTimeout(() => resolve(), 1000)
	}),

}
