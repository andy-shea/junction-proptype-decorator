import PropTypes from 'prop-types';

function mapType(type) {
  if (type === 'string') return PropTypes.string;
  if (type === 'integer' || type === 'int' || type === 'number') return PropTypes.number;
  if (type === 'boolean' || type === 'bool') return PropTypes.bool;
}

function mapSchema(klass) {
  if (!klass.schema) throw Error('Missing schema');
  const {props, collections} = klass.schema;
  let shape = {};
  if (props) {
    Object.assign(shape, Object.keys(props).reduce((map, prop) => {
      const {type} = props[prop];
      if (type) {
        const propType = type.schema ? PropTypes.object : mapType(type);
        if (propType) map[prop] = type.isRequired ? propType.isRequired : propType;
      }
      return map;
    }, {}));
  }
  if (collections) {
    Object.assign(shape, Object.keys(collections).reduce((map, prop) => {
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

function proptypeable(target) {
  let mappedShape;
  Object.defineProperty(target, 'shape', {
    get: function shape() {
      if (!mappedShape) mappedShape = mapSchema(target);
      return mappedShape;
    }
  });
}

export default proptypeable;
