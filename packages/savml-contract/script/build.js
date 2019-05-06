import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import re from 'rollup-plugin-re'
import uglify from 'rollup-plugin-uglify'
import json from 'rollup-plugin-json'
import typescript from 'rollup-plugin-typescript2'
import builtins  from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals';

export default [{
  input: 'src/index.ts',
  output: [
    {format: 'umd', name:'SavmlContract', file: 'dist/savml-contract.umd.js'},
  ],
  external: [
    'punycode',
    'yaml'
  ],
  plugins: createPlugins()
}]

function createPlugins () {
  return [
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true,
    }),
    json(),
    resolve({
      jsnext: true,
      module: true,
      main: true,
    }),
    globals(),
    // builtins(),
    commonjs({
      include: [
        'node_modules/**',
        process.env.ENTRYMODULE + '/**',
      ]
    }),

  ]  
}
