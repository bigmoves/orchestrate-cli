orchestrate-cli
===============

A command line interface for the [Orchestrate.io](http://orchestrate.io) API.

Built with the Orchestrate [Node Client](https://github.com/orchestrate-io/orchestrate.js).

## Installation

```
npm install -g orchestrate-cli
```

## Getting Started

Set your API key as an environment variable on your current path.

```
export ORCHESTRATE_API_KEY=token
```

### Output

orchestrate-cli formats responses from Orchestrate using the [prettyjson](https://github.com/rafeca/prettyjson) npm package, which makes JSON responses easier to read in the command-line.

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
      location: Aurora, Illinois
    reftime: 1403985744473
  -
  ...
```

### API Docs

Complete documentation for the Orchestrate.io API can be found [here](https://orchestrate.io/docs/api/).

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

**Example:**

`orchestrate get users wayne`

### Put

`orchestrate put <collection> <key> <json> <options...>`

Creates or updates the value at the collection/key specified.

**Options:**

`-u, --update [ref]`

Stores the value for the key if the specified ref value matches the current ref value.

`-c, --create`

Stores the value for the key if no key/value already exists.

**Examples:**

`orchestrate put users wayne '{"name":"Wayne Campbell"}'`

Note that the json argument must be wrapped with single quotes.

`orchestrate put users wayne '{"name":"Wayne Campbell"}' --update cb02c69c2a7f0df7`

`orchestrate put users wayne '{"name":"Wayne Campbell"}' --create`

### Delete

`orchestrate delete <collection> <key> <options>`

Deletes the value of a key to a null object. If the purge parameter is supplied the object and its ref history will be permanently deleted.

**Options:**

`-p, --purge`

**Example:**

`orchestrate delete users wayne -p`

### List

`orchestrate list <collection> <options...>`

Returns a paginated, lexicographically ordered list of items contained in a collection.

**Options:**

`-l, --limit [limit]`

the number of results to return. (Default: 10)

`-s, --startKey`

the start of the key range to paginate from including the specified value if it exists.

**Examples:**

`orchestrate list users`

Lists the first 10 documents in the users collection.

`orchestrate list users --limit 2 --startKey w`

Limits the results to 2 documents starting from the key "w".

## Search

`orchestrate search <collection> <query> <options...>`

Returns a list of items in a collection matching a lucene query.

**Options:**

`-l, --limit [limit]`

the number of results to return. (default: 10, max: 100)

`-o, --offset [offset]`

the starting position of the results. (default: 0)

**Examples:**

`orchestrate search users "*" --limit 20`

Searches all documents in the users collection, limiting the results to 20.

`orchestrate search users "Wayne"`

Searches all documents and values in the users collection for the keyword "Wayne".

`orchestrate search users "value.location: 'Aurora'"`

Searches all documents with value.location matching the keyword.

## Events

### Get

`orchestrate get-event <collection> <key> <type> <options...>`

Returns an individual event.

**Options:**

`-t, --timestamp`

the event timestamp.

**Example:**

`orchestrate get-event users wayne updates`

### List

`orchestrate list-events <collection> <key> <type> <options...>`

Returns a paginated list of events, optionally limited to specified time range in reverse chronological order.

**Options:**

`-s, --start [start]`

the inclusive start of a range to query.

`-e, --end [end]`

the non-inclusive start of a range to query.

**Example:**

`orchestrate list-events users wayne update`

Lists all of the update events for the key "wayne" in the users collection.

`orchestrate list-events users wayne update -s 1403988738520 -e 1403989963791`

Lists all of the update events for the key "wayne" within a specific time range.

## Graph

### Get

`orchestrate get-graph <collection> <key> <kind1> <options...>`

Returns relation’s collection, key, ref, and values. The “kind” parameter(s) indicate which relations to walk and the depth to walk.

**Options:**

`-w, --walk [kind2]`

the relation to walk to.

**Examples:**

`orchestrate get-graph users wayne friends`

Lists friends of Wayne.

`orchestrate get-graph users wayne friends -w friends`

Lists friends of Waynes' friends.

### Put

`orchestrate put-relation <collection> <key> <kind> <toCollection> <toKey>`

Creates a relationship between two objects. Relations can span collections.

**Example:**

`orchestrate put-relation users wayne friends users garth`

### Delete

`orchestrate delete-relation <collection> <kind> <toCollection> <toKey>`

Deletes a relationship between two objects.

**Example:**

`orchestrate delete-relation users wayne friend users garth`

## Seed data

*Use with caution. Each object in the .json file is uploaded to
Orchestrate with a separate api request.*

`orchestrate seed <collection> <file> <key>`

Seed a collection with the contents of a .json file. `<file>` is the path to the file relative to where the command is executed. `<key>` is a value relative to each of the objects in the .json file to use as the objects' key.

**Example:**

*users.json*

```
[
  {
    "name": "chad",
    "email": "chadtmiller15@gmail.com"
  },
  ...
]
```

`orchestrate seed users users.json email`

## Ping

`orchestrate ping`

Validates the active API key.

