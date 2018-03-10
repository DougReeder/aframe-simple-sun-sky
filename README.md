aframe-simple-sun-sky
===

An [A-Frame](https://aframe.io) [WebVR](https://webvr.info/) sky primitive using a simple (and fast) gradient away from the sun.
Saves your GPU power for the terrain!
Does *not* include any directional lighting.  You may need to set sun-position on other elements to match.

![sample screenshot](sample.png)

[live example scene](example.html)

When the sun goes below the horizon, you might want to switch to a different sky.

Include using 
```html
    <script src="https://cdn.rawgit.com/DougReeder/aframe-simple-sun-sky/42f84920/simple-sun-sky.js"></script>
```


Basic use:
```html
<a-simple-sun-sky sun-position="1 0.1 0"></a-simple-sun-sky>
```

Setting colors:
```html
<a-simple-sun-sky sun-position="-1 1 -1" light-color="#87cefa" dark-color="#00bfff"></a-simple-sun-sky>
```