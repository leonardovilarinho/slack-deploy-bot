module.exports = {
	help: `*Ooh no :cry:, your command \`{command}\` hasn\'t founded*.\n<@{user}> you can use:\n
	- \`d:push <app-name>\` for deploy an application\n
	- \`d:exec <app-name>\` for execute an remote command in your application\n\n
	`,

	loading: 'Okay <@{user}> :v:, I\'m doing this action in `{project}` project.\n\n',

	done: '*Hey* :eyes:, at the request of <@{user}> I just ran the `{command}` command in the `{project}` project. Output:\n\`\`\`{output}\`\`\`\n',
}
