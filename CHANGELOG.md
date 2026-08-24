# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Project scaffold: Next.js 16 App Router, Tailwind v4, Vitest with jsdom.
- Rule engine type model: recursive `RuleNode` tree and the `EvalResult` trace
  that mirrors it, including per-group `blamed` ids.
- Operator catalogue mapping each field type to the operators it accepts, with
  UI labels and value arity.
- Explanation module turning a comparison into a readable sentence.
- JSON serialization with structural parsing of untrusted input.
- E-commerce demo schema and five sample records, each shaped to fail a common
  rule in a different way.
- Specifications for the tree operations, the evaluator and the validator.
