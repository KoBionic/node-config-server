# Contribute to Node Config Server

## Setup VS Code debugger

In order to be able to properly launch the server with VS Code's integrated debugger, a *launch.json* such as below should be added to a *.vscode* folder under project root:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "TS: Server Debugging",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}",
      "args": [
        "${workspaceFolder}/src/bin/www.ts"
      ],
      "runtimeArgs": [
        "--nolazy",
        "--require",
        "${workspaceFolder}/node_modules/ts-node/register"
      ],
      "protocol": "inspector",
      "sourceMaps": true,
      "env": {
        "NODE_ENV": "development",
        "CPUS_NUMBER": "1",
        "LOG_LEVEL": "debug",
        "LOG_NAME": "debug"
      }
    }
  ]
}
```
