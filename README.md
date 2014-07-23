s2cover
=============

A tiny cli for extracting [node-s2](https://github.com/mapbox/node-s2) cell covers with cell info and index order visualization. The output looks like this:

![img](https://dl.dropbox.com/s/y5gtb3m6413uehu/Screenshot%202014-07-21%2017.00.07.png)

###install

```sh
npm install s2cover -g
```

###usage

```sh
# read a geojson file
s2cover ./poly.geojson | geojsonio
```

```sh
# pipe in geojson
cat poly.geojson | s2cover | geojsonio
```

###options
```sh
-h --help : show options and usage
-l --line : draw a hilburt curve throught the cells by index order
-c --color color the cells from white->purple by index order
```
