/**
 * A simple replace text plugin in babel, such as `webpack.DefinePlugin`
 * 
 * Docs: https://github.com/jamiebuilds/babel-handbook
 */
function definePlugin({ types: t }) {
    const regExclude = /node_modules/;
    return {
        visitor: {
            Identifier(path, state) {
                const { node, parent, scope } = path;
                const { filename, opts } = state;
                const key = node.name;
                const value = opts[key];

                if (key === 'constructor' || value === undefined) { // don't replace
                    return;
                }
                if (t.isMemberExpression(parent)) { // not {"__DEV__":name}
                    return;
                }
                if (t.isObjectProperty(parent) && parent.value !== node) { // error
                    return;
                }
                if (scope.getBinding(key)) { // should in global
                    return;
                }
                if (regExclude.test(filename)) { // exclude node_modules
                    return;
                }
                switch (typeof value) {
                    case 'boolean':
                        path.replaceWith(t.booleanLiteral(value));
                        break;
                    case 'string':
                        path.replaceWith(t.stringLiteral(value));
                        break;
                    default:
                        console.warn('definePlugin only support string/boolean, so `%s` will not be replaced', key);
                        break;
                }
            },
        },
    };
}

module.exports = definePlugin;
