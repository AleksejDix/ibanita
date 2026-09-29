# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 4.x     | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Ibanita, please report it
privately. **Do not open a public GitHub issue.**

Send a report to: **<INSERT_SECURITY_CONTACT_EMAIL>**

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof-of-concept
- The affected version(s)
- Any suggested mitigation, if known

## Response

- You will receive an acknowledgement within **72 hours**.
- A fix or mitigation plan will be provided within **14 days** for confirmed
  issues.
- Once a fix is released, a security advisory will be published on GitHub and
  credit given to the reporter (unless anonymity is requested).

## Scope

In scope:

- Validation/extraction logic that could yield incorrect results for valid input
- Regex patterns vulnerable to ReDoS
- Any issue allowing arbitrary code execution via library inputs

Out of scope:

- Vulnerabilities in dependencies (please report to the upstream project)
- Issues requiring a modified build of the library
