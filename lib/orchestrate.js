var program       = require('commander');
var packageConfig = require('../package');
var db            = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var prettyjson    = require('prettyjson');
var chalk         = require('chalk');

program
  .version(packageConfig.version);

///////////////////////////////////////////////////////////////////////////////
// Key/Value

program
  .command('get <collection> <key>')
  .description('Get the latest value assigned to a key.')
  .action(function(collection, key) {
    db.get(collection, key)
    .then(function(res) {
      console.log(prettyjson.render(res.body));
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

program
  .command('put <collection> <key> <json>')
  .description('Creates or updates the value at the collection/key specified.')
  .option('-u, --update [update]', 'Stores the value for the key if the '+
          'value for this header matches the current ref value.')
  .option('-c, --create', 'Stores the value for the key if no key/value' +
          ' already exists.')
  .action(function(collection, key, json, options) {
    var update;

    if (options.update) {
      update = options.update;
    } else if (options.create) {
      update = !options.create;
    }

    db.put(collection, key, JSON.parse(json), update)
    .then(function(res) {
      console.log(chalk.green('>> ') + res.statusCode);
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

program
  .command('delete <collection> <key>')
  .description('Deletes the value of a key to a null object.')
  .option('-p, --purge', 'If true the KV object and all of its ref history ' +
          'will be permanently deleted. This operation cannot be undone.')
  .action(function(collection, key, options) {
    db.remove(collection, key, options.purge)
    .then(function(res) {
      console.log(chalk.green('>> ') + res.statusCode);
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

//TODO: support pagination
program
  .command('list <collection>')
  .description('Returns a paginated, lexicographically ordered list of items '+
               'contained in a collection.')
  .option('-l, --limit [limit]', 'the number of results to return. ' +
          '(default: 10, max: 100)')
  .option('-s, --startKey [startKey]', 'the start of the key range to ' +
          'paginate from including the specified value if it exists.')
  .action(function(collection, options) {
    db.list(collection, options)
    .then(function(res) {
      console.log(prettyjson.render(res.body));
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

///////////////////////////////////////////////////////////////////////////////
// Search

program
  .command('search <collection> <query>')
  .description('Returns list of items matching the lucene query.')
  .option('-l, --limit [limit]', 'the number of results to return. ' +
          '(default: 10, max: 100)', 10)
  .option('-o, --offset [offset]', 'the starting position of the results. ' +
          '(default: 0)', 0)
  .action(function(collection, query, options) {

    db.newSearchBuilder()
    .collection(collection)
    .limit(options.limit)
    .offset(options.offset)
    .query(query)

    .then(function(res) {
      console.log(prettyjson.render(res.body));
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

///////////////////////////////////////////////////////////////////////////////
// Events

// TODO: not working
program
  .command('get-event <collection> <key> <type>')
  .description('Returns an individual event.')
  .option('-t, --timestamp [timestamp]', 'the event timestamp.')
  .action(function(collection, key, type, options) {

    db.newEventReader()
    .from(collection, key)
    .start(options.timestamp)
    .end(options.timestamp+1)
    .type(type)

    .then(function(res) {
      console.log(prettyjson.render(res.body));
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

// post-event

// put-event

program
  .command('list-events <collection> <key> <type>')
  .description('Returns a paginated list of events, optionally limited to ' +
               'specified time range in reverse chronological order.')
  .option('-s, --start [start]', 'the inclusive start of a range to query.')
  .option('-e, --end [end]', 'the non-inclusive start of a range to query.')
  .action(function(collection, key, type, options) {

    if (options.startEvent && options.endEvent) {
      db.newEventReader()
      .from(collection, key)
      .start(options.start)
      .end(options.end)
      .type(type)

      .then(function(res) {
        console.log(prettyjson.render(res.body));
      })
      .fail(function(err) {
        console.log(chalk.red('>> ') + err.body.message);
      });
    } else {
      db.newEventReader()
      .from(collection, key)
      .type(type)

      .then(function(res) {
        console.log(prettyjson.render(res.body));
      })
      .fail(function(err) {
        console.log(chalk.red('>> ') + err.body.message);
      });
    }
  });

// delete-event

///////////////////////////////////////////////////////////////////////////////
// Graph

program
  .command('get-graph <collection> <key> <kind1>')
  .description('Returns relation’s collection, key, ref, and values. The ' +
               '“kind” parameter(s) indicate which relations to walk and ' +
               'the depth to walk.')
  .option('-w, --walk [kind2]', 'relation to walk to.')
  .action(function(collection, key, kind1, options) {

    db.newGraphReader()
    .get()
    .from(collection, key)
    .related(kind1, options.walk)

    .then(function(res) {
      console.log(prettyjson.render(res.body));
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

program
  .command('put-relation <collection> <key> <kind> <toCollection> <toKey>')
  .description('Creates a relationship between two objects. Relations can ' +
               'span collections.')
  .action(function(collection, key, kind, toCollection, toKey) {

    db.newGraphBuilder()
    .create()
    .from(collection, key)
    .related(kind)
    .to(toCollection, toKey)

    .then(function(res) {
      console.log(chalk.green('>> ') + res.statusCode);
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

program
  .command('delete-relation <collection> <key> <kind> <toCollection> <toKey>')
  .description('Deletes a relationship between two objects.')
  .action(function(collection, key, kind, toCollection, toKey) {

    db.newGraphBuilder()
    .remove()
    .from(collection, key)
    .related(kind)
    .to(toCollection, toKey)

    .then(function(res) {
      console.log(chalk.green('>> ') + res.statusCode);
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });

program
  .command('seed <collection> <path> <key>')
  .description('Seeds a collection with the contents of a .json file.')
  .action(function(collection, path, id) {
    //check file type
    var json = require(process.cwd() + path);

    if (!json.length) {
      db.put(collection, json[key], json)
      .then(function(res) {
        console.log(chalk.green('>> ') + json[key] + ' created.');
      })
      .fail(function(err) {
        console.log(chalk.red('>> ') + err.body.message);
      });
    }

    json.forEach(function(item) {
      var key = item[id];

      db.put(collection, key, item)
      .then(function(res) {
        console.log(chalk.green('>> ') + key + ' created.');
      })
      .fail(function(err) {
        console.log(chalk.red('>> ') + err.body.message);
      });
    });

  });

///////////////////////////////////////////////////////////////////////////////
// Ping

program
  .command('ping')
  .description('Validates an API key.')
  .action(function() {

    db.ping()
    .then(function(res) {
      console.log(chalk.green('>> ') + 'You have a valid API key.');
    })
    .fail(function(err) {
      console.log(chalk.red('>> ') + err.body.message);
    });
  });


program
  .parse(process.argv);

