Orchestrate Cli
===============

A command line utility for [Orchestrate.io](http://orchestrate.io).

Installation
============

`npm install -g orchestrate-cli`

Using Orchestrate-Cli
====================

In order to interact with Orchestrate's api, you need to have a valid
API key. An API key is specific to an application and can be found on
Orchestrate's dashboard page once you setup an account. Once you have a
valid API key, set it as an evironment variable on your path with the
following command:

`export ORCHESTRATE_API_KEY=key`

Now, every time you run a command you'll be working with a specific
application. If you want to work on a different application, just run the
command again with a new api key.

Complete documentation for the api can be found [here](https://orchestrate.io/docs/api/).

# Output

Responses from Orchestrate are formatted using the [prettyjson](https://github.com/rafeca/prettyjson) package, which formats json in a coloured YAML-style.

```
count:   4
results:
  -
    path:
      collection: users
      key:        wayne
      ref:        a2b753f69da817d1
    value:
      name: Wayne Campbell
    reftime: 1403985744473
  -
  ...
```

# Commands

## Help

`orchestrate --help`

Prints out a list of available commands.

`orchestrate <command> --help`

Prints out help for the specified command.

## Key/Value

### Get

`orchestrate get <collection> <key>`

Get's the latest value assigned to a key.

Example:

`orchestrate get users wayne`

### Put

`orchestrate put <collection> <key> <json> <options...>`

Creates or updates the value at the collection/key specified.

Options:

`-u, --update [ref]`

Stores the value for the key if the value for this header matches the current ref value.

`-c, --create`

Stores the value for the key if no key/value already exists.

Examples:

`orchestrate put users wayne '{"name":"Wayne Campbell"}'`

`orchestrate put users wayne '{"name":"Wayne Campbell"}' --update cb02c69c2a7f0df7`

`orchestrate put users wayne '{"name":"Wayne Campbell"}' --create`

### Delete

`orchestrate delete <collection> <key> <options>`

Deletes the value of a key to a null object. If the purge parameter is supplied the object and its ref history will be permanently deleted.

Options:

`-p, --purge`

Example:

`orchestrate delete users wayne -p`

### List

`orchestrate list <collection> <options...>`

Returns a paginated, lexicographically ordered list of items contained in a collection.

Options:

`-l, --limit [limit]`

the number of results to return. (Default: 10)

`-s, --startKey`

the start of the key range to paginate from including the specified value if it exists.

Examples:

`orchestrate list users`

`orchestrate list users --limit 2 --startKey w`

## Search

`orchestrate search <collection> <query> <options...>`

Returns a list of items in a collection matching a lucene query.

Options:

`-l, --limit [limit]`

the number of results to return. (default: 10, max: 100)

`-o, --offset [offset]`

the starting position of the results. (default: 0)

Examples:

`orchestrate search users "*"`

Returns all users in the collection.

`orchestrate search users "Wayne"`

Searches through all of the key/value pairs in a collection for the
keyword "Garth".

`orchestrate search users "value.name: 'Wayne'"`

Only searches by the name key on each item in a collection.

## Events

### Get

`orchestrate get-event <collection> <key> <type> <options...>`

Returns an individual event.

Options:

`-t, --timestamp`

the event timestamp.

Example:

`orchestrate get-event users wayne update`

### List

`orchestrate list-events <collection> <key> <type> <options...>`

Returns a paginated list of events, optionally limited to specified time range in reverse chronological order.

Options:

`-s, --start [start]`

the inclusive start of a range to query.

`-e, --end [end]`

the non-inclusive start of a range to query.

Example:

`orchestrate list-events users wayne update`

lists all of the update events for wayne in the users collection

`orchestrate list-events users wayne update -s 1403988738520 -e 1403989963791`

## Graph

### Get

`orchestrate get-graph <collection> <key> <kind1> <options...>`

Returns relation’s collection, key, ref, and values. The “kind” parameter(s) indicate which relations to walk and the depth to walk.

Options:

`-w, --walk [kind2]`

the relation to walk to.

Examples:

`orchestrate get-graph users wayne friends`

Returns friends of Wayne.

`orchestrate get-graph users wayne friends -w friends`

Returns friends of Wayne's friends.

### Put

`orchestrate put-relation <collection> <key> <kind> <toCollection>
<toKey>`

Creates a relationship between two objects. Relations can span collections.

Example:

`orchestrate put-relation users wayne friends users garth`

### Delete

`orchestrate delete-relation <collection> <kind> <toCollection>
<toKey>`

Deletes a relationship between two objects.

Example:

`orchestrate delete-relation users wayne friend users garth`

## Seed

`orchestrate seed <collection> <file> <key>`

Seeds a collection with the contents of a .json file. `<file>` is the path to the file relative to where the command is executed. `<key>` is a property on each of the objects in the .json file to use as the objects' key.

Example:

`orchestrate seed users users.json name`

## Ping

`orchestrate ping`

Validates the active API key.





