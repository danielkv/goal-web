module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    printWidth: 100,
    singleQuote: true,
    plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
    importOrder: ['^solid-js', '^@(.*)$', '^../', '^./'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
}
