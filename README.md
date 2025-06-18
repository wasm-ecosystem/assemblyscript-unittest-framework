# Assemblyscript Unittest Framework

<div align="center">
  <a href="https://deepwiki.com/wasm-ecosystem/assemblyscript-unittest-framework">
    <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
  </a>
  <a href="https://www.npmjs.com/package/assemblyscript-unittest-framework">
    <img src="https://img.shields.io/npm/v/assemblyscript-unittest-framework.svg?color=007acc&logo=npm" alt="npm" />
  </a>
  <a href="https://discord.gg/assemblyscript">
    <img
      src="https://img.shields.io/discord/721472913886281818.svg?label=discord&logo=discord&logoColor=ffffff&color=7389D8"
      alt="Discord online"
    />
  </a>
</div>

A comprehensive AssemblyScript testing solution, offering developers a robust suite of features to ensure their code performs as expected:

- Function Mocking
- Coverage statistics
- Expectations

Documentation: https://wasm-ecosystem.github.io/assemblyscript-unittest-framework/

## Architecture

- `assembly/` written in Assemblyscript, provides user-accessible testing APIs such as test, inspect, mock, etc.
- `src/` written in Typescript, implements the test functionality.
