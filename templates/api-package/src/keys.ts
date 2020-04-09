import {BindingKey} from '@loopback/context';
export namespace <%= appNamePascalCase %>ApiBindings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const CONFIG = BindingKey.create<any>('<%= appNamePascalCase %>.config');
}
