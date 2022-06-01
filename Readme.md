# how to user this?

1. add you script tag attribute type=module attribute
```
<script type='module' src='...'></script>
```
2. import file Graph.js in your project
3. in a parent element (for svg) in css set height and width
4. Create an instance of an object by passing to the constructor: 1) parent dom element 2) array of objects of the form:
```
[{x: '13.05.2004', y: 43}, {x: '13.06.2004', y: 98}, {x: '13.07.2004', y: 54}]
```
5. in the Graph object instance to run method draw()