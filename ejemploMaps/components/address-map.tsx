import { Platform } from 'react-native';

const AddressMap =
  Platform.OS === 'web'
    ? require('./address-map.web').default
    : require('./address-map.native').default;

export default AddressMap;
