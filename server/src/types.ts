// Type definitions for strapi-schema-extender plugin

export interface AttributeConfig {
  layouts?: {
    size?: number;
    position?: number;
    hidden?: boolean;
  };
  metadatas?: {
    label?: string;
    description?: string;
    placeholder?: string;
    visible?: boolean;
    editable?: boolean;
    mainField?: boolean;
    searchable?: boolean;
    sortable?: boolean;
  };
}

export interface ContentType {
  uid: string;
  plugin?: boolean;
  attributes: Record<string, AttributeConfig>;
  [key: string]: any;
}

export interface LayoutField {
  name: string;
  size: number;
  position?: number;
}

export interface Layouts {
  edit: Array<Array<{ name: string; size: number }>>;
  list?: Array<any>;
}

export interface Metadatas {
  [attr: string]: {
    edit?: Record<string, any>;
    list?: Record<string, any>;
  };
}

export interface ContentManagerConfig {
  layouts: Layouts;
  metadatas: Metadatas;
  settings?: Record<string, any>;
}
