# Monty caching proxy with mutable responses.

## Todo
 - Use middleware to extract response reliably, maybe using- https://github.com/philippotto/transformer-proxy
 - Store responses in a DB/redis/whatever.
 - Test Monty works with it. It won't, we'll need to look at
    - https
    - storing and sending headers. Maybe rewriting ones that involve date.
    - query strings
