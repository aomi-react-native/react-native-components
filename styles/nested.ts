const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export default hasSymbol ? Symbol.for('nested') : '__THEME_NESTED__';
