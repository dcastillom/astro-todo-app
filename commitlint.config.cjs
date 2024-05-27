const fs = require('fs')
const path = require('path')

/**
 * Retrieves the scope enumeration for commitlint configuration.
 * @returns {Promise<string[]>} An array of scope values.
 */
async function getScopeEnum() {
  const src = await fs.readdirSync(
    './src',
    { withFileTypes: true },
    (err, files) => files
  )
  const root = await fs.readdirSync(
    '.',
    { withFileTypes: true },
    (err, files) => files
  )

  const formatScope = (name) =>
    name.replace(/\./g, '-').replace(/^(-)/, '').toLowerCase()

  const scopes = [
    ...src
      .filter((file) => file.isDirectory())
      .map((folder) => formatScope(folder.name)),
    ...root
      .filter((file) => file.isDirectory())
      .map((folder) => formatScope(folder.name)),
    ...root
      .filter((file) => !file.isDirectory())
      .map((file) => formatScope(path.parse(file.name).name))
      .map((file) => formatScope(path.parse(file).name)),
  ]

  return [...new Set(scopes)].sort()
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'hotfix',
        'perf',
        'refactor',
        'release',
        'revert',
        'style',
        'test',
      ],
    ],
    'subject-max-length': [2, 'always', 40],
    'subject-case': [2, 'always', ['lower-case']],
    'scope-enum': async () => [2, 'always', await getScopeEnum()],
    'scope-empty': [1, 'never'],
    'type-empty': [2, 'never'],
  },
}
