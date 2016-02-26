## Online Book

https://github.com/getify/You-Dont-Know-JS

## Useful service

1. Sign NDA (used with Enjoy at Melo Park)
https://www.hellosign.com/

## Scaffolding tool

1. fastshell  https://github.com/HosseinKarami/fastshell
2. headstart  git://github.com/flovan/headstart

## Watchman reset

```bash
brew install jq

(for root in $(watchman watch-list | jq -r '.roots | .[]'); do watchman watch-del "$root" ; done)

watchman shutdown-server
brew update
brew reinstall watchman
```

