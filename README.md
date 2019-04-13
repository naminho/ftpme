<p></p>
<p align="center">
  <img src="https://raw.githubusercontent.com/naminho/ftpme/master/logo.png" alt="FTPme">
</p>

# FTPme

<p align="center">
    <img src="http://naminho.ch/ftpme/terminal.svg" alt="FTPme Terminal Demo">
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

First this will prompt for your credentials to connect to the FTP server. Credentials will be stored locally in case you want to use them again. The password can optionally be stored as well. Then it will scan the current directory for packages (directories containing a package.json file) and prompt for which to consider. Then the dependencies are updated and the desired scripts will be run. Last but not least ftpme will prompt for the folders to be uploaded (scanning up to a depth of two folders) and upload them.
