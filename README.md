s2Cover
=============

A tiny cli for extracting [node-s2](https://github.com/mapbox/node-s2) cell covers with cell info, and index order visualization.

###install

```sh
npm install s2cover -g
```

###usage

```sh
s2Cover ./poly.geojson | geojsonio
```

```sh
cat poly.geojson | s2Cover | geojsonio
```