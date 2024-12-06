# Changelog

## 0.3.10

- Do more `routing-data` clearing out, since 0.3.9 had still some parts in it

## 0.3.9

- The emitted attribute `routing-data` has been removed again, because parsing of `routing-url`
  can now be done by `DBPLitElement` itself

## 0.3.8

- Fix broken welcome page because of undefined `activeView`

## 0.3.7

- Add `routing-url` routing handling

## 0.3.6

- Add emitted attributes `routing-url` and `routing-data` to propagate a routing change 
