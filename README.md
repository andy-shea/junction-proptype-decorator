# Junction PropType Decorator
**Requirements:** Node.js 6+

Map your Junction entity schema to an output suitable for React prop validation

## Install

```npm install junction-proptypes-decorator --save```

## Usage

Decorate your schema-defined entities with `@proptypeable` and access the custom prop type via the `shape` getter.

```
@proptypeable
class Car {

  wheels = 4;
  electric = true;

}

Car.schema = {
  type: 'entity',
  props: {
    wheels: {
      type: 'number',
      isRequired: true
    },
    electric: {
      type: 'boolean',
      isRequired: true
    }
  }
}

class CarRow extends Component {

  static propTypes = {
    car: Car.shape.isRequired
  }

  ...
}
```

## Licence

[MIT](./LICENSE)
