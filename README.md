aframe-simple-sun-sky
===

An [A-Frame](https://aframe.io) sky primitive using a simple (and fast) gradient away from the sun patch.
Saves your GPU power for the terrain!
Does *not* include any directional lighting.  You may need to set sun-position on other elements to match.

Any of the properties may be animated.
When the sun goes below the horizon, you might want to switch to a different sky.

Basic use:
```html
<a-simple-sun-sky sun-position="1 0.1 0"></a-simple-sun-sky>
```

Setting colors:
```html
<a-simple-sun-sky sun-position="-1 1 -1" light-color="#87cefa" dark-color="#00bfff"></a-simple-sun-sky>
```
