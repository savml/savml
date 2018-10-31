import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import re from 'rollup-plugin-re'
import uglify from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'

export default [{
  input: 'src/index.ts',
  output: [
    {format: 'umd', name:'SavmlContract', file: 'dist/savml-contract.umd.js'},
  ],
  external: [
    "yaml",
  ],
  plugins: createPlugins()
}]

function createPlugins () {
  return [
    typescript({
      
    }),
    resolve({
      module: true
    }),
    commonjs({
      include: [
        'node_modules/**',
        process.env.ENTRYMODULE + '/**',
      ]
    }),
  ]  
}