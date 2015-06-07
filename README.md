# HelloPhoenix

### Requirements

Install `azk`, instructions: 
    http://docs.azk.io/en/installation/index.html

### Start

Run the application with:

```bash
$ azk start --open; azk logs --tail
```

### Logs

Run:

```bash
$ azk logs --follow
```

### Tests

Start and reprovision test system:

```bash
$ azk start test --reprovision; azk logs --follow
```

Stop log and test system:

```bash
# Press `Ctrl+C` to end logs
azk stop test
```
