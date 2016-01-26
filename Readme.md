MkConf
======
Generate configuration files dynamically.

`MkConf` is a tool to generate configuration files out of templates
and environment variables.


Quick start
-----------
```bash
npm install -g github:artsalliancemedia/mk-config
# Use this if SSH is not available on your network:
#npm install -g https://github.com/artsalliancemedia/mk-config/archive/0.0.0.tar.gz

mkconf --help
# Usage: node mkconf
#
# -h, --help           display this help
# -e, --env-map=FILE   JSON map from environment variables to template variables
# -d, --defaults=FILE  JSON file with the default data to pass to the template
# -i, --input=FILE     Read the template from FILE, defaults to stdin
# -o, --output=FILE    Write the rendered data to FILE, defaults to stdout

mkconf --defaults=config.json --env-map=overrides.json --input=config.template > out.config
mkconf --defaults=config.json --env-map=overrides.json --input=config.template --output=out.config
```

### Examples
The following examples are based on the input files listed here:

  * `config.json`:
    ```json
    {
      "db-name": "myapp",
      "bind-ip": "127.0.0.1"
    }
    ```

  * `overrides.json`:
    ```json
    {
      "db-name": "DB_NAME"
    }
    ```

  * `config.template`:
    ```text
    [app]
    bind = {{ bind-ip }}

    [db]
    name = {{ db-name }}
    ```

#### Clean environment
In this example the environment variable `DB_NAME` is not set.
```bash
mkconf --defaults=config.json --env-map=overrides.json --input=config.template --output=out.config
cat out.config
[app]
bind = 127.0.0.1

[db]
name = myapp
```

#### Environment override
If the environment variable `DB_NAME` is instead set,
the value in it will be used instead of the default:
```bash
export DB_NAME="mytest"
mkconf --defaults=config.json --env-map=overrides.json --input=config.template --output=out.config
cat out.config
[app]
bind = 127.0.0.1

[db]
name = mytest
```
