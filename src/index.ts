import * as PropTypes from 'prop-types';

enum Type {
  String = "string",
  Integer = "integer",
  Int = "int",
  Number = "number",
  Boolean = "boolean",
  Bool = "bool"
}

function mapType(type: Type): any {
  if (type === Type.String) return PropTypes.string;
  if (type === Type.Integer || type === Type.Int || type === Type.Number) return PropTypes.number;
  if (type === Type.Boolean || type === Type.Bool) return PropTypes.bool;
}

function mapSchema(target: any) {
  if (!target.schema) throw Error('Missing schema');
  const {props, collections} = target.schema;
  let shape = {};
  if (props) {
    Object.assign(shape, Object.keys(props).reduce((map: any, prop) => {
      const {type} = props[prop];
      if (type) {
        const propType = type.schema ? PropTypes.object : mapType(type);
        if (propType) map[prop] = type.isRequired ? propType.isRequired : propType;
      }
      return map;
    }, {}));
  }
  if (collections) {
    Object.assign(shape, Object.keys(collections).reduce((map: any, prop) => {
      const {element} = collections[prop];
      const propType = element.schema ? PropTypes.array : mapType(element);
      if (propType) {
        if (!element.schema) map[prop] = PropTypes.arrayOf(propType);
        if (element.isRequired) map[prop] = map[prop].isRequired;
      }
      return map;
    }, {}));
  }
  return PropTypes.shape(shape);
}

function proptypeable(target: any) {
  let mappedShape: Object;
  Object.defineProperty(target, 'shape', {
    get: function shape() {
      if (!mappedShape) mappedShape = mapSchema(target);
      return mappedShape;
    }
  });
}

export default proptypeable;
