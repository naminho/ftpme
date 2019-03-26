<p align="center">
  <img src="https://raw.githubusercontent.com/naminho/ftpme/master/logo.png" alt="FTPme">
</p>

# FTPme

<p align="center">
    <img src="https://raw.githubusercontent.com/naminho/ftpme/master/terminal.svg?sanitize=true" alt="FTPme Terminal Demo">
</p>

Uploads Assets (Demos or Documentations) for all your local npm projects to an FTP
server.

* Scans for packages
* Builds assets
* Uploads to FTP
* Store credentials
  * Locally
  * Passwords in macOS Keychain

## Installation

```
npm i -g ftpme
```

## Usage

Navigate to the directory where your projects are located an run:

```
ftpme
```

This will prompt for your credentials, then scan for projects, then ask which
projects are applicable and then build and upload their demo and documentation
content.
