module.exports = {
	help: `*:warning::warning::warning::warning: \`{command}\` command not found*, <@{user}> you can use:\n
	- \`d:push <app-name>\` for deploy an application\n
	- \`d:exec <app-name> <command>\` for execute an remote command in your application\n
	- \`d:list *\` list all registered applications\n
:warning::warning::warning::warning: *error*\n`,

	list: `:information_source::information_source::information_source::information_source: <@{user}> :v:, follow the projects list:\n
{list}
:information_source::information_source::information_source::information_source: *info*\n`,

	loading: `:information_source::information_source::information_source::information_source: <@{user}> I'm running your command...\n`,
	deploying: `:information_source::information_source::information_source::information_source: now I'm running deploy script...\n`,

	done: `:four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover: <@{user}> run \`{command}\` command in the \`{project}\` project, with output:
\`\`\`{output}\`\`\`\n
:four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover: *success*\n`,

	error: `:warning::warning::warning::warning: <@{user}> the \`{command}\` command in \`{project}\` project returned this error:
\`\`\`{error}\`\`\`\n
:warning::warning::warning::warning: *error*\n`,

	appnot: `:warning::warning::warning::warning: <@{user}> the \`{project}\` project not found.\n`,

	kludge: `:warning::warning::warning::warning: <@{user}> :rage:, do not kludge in the \`{project}\` project.\n`,

	remote: `:warning::warning::warning::warning: <@{user}> the \`exec\` command should have an command for run remotely.`
}
