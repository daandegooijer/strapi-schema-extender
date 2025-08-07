# Strapi Schema Extender

A Strapi plugin to **extend your content-type schemas** with layout and metadata fields, enabling schema-driven control over the Strapi Content Manager UI.

---

## Features

- **Schema-driven layouts:**  
  Define field sizes, positions, and visibility directly in your schema for Content Manager edit views.
- **Schema-driven metadatas:**  
  Set field labels, descriptions, and other UI metadata in your schema.
- **Schema-driven Content Manager options:**  
  Set Content Manager `settings` (like `mainField`, `defaultSortBy`, etc.) and `list` columns directly in your schema.
- **Non-destructive:**  
  Only updates what you define in your schema—preserves manual admin UI changes.
- **Automatic merging:**  
  Deep merges your schema config with existing Content Manager settings.
- **Validation-safe:**  
  Only allowed keys and fields are updated, preventing Strapi validation errors.

---

## Example Usage

Add `layouts`, `metadatas`, and a `content-manager` block to your content-type schema:

```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": { "singularName": "page", "pluralName": "pages", "displayName": "Pagina" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "content-manager": {
    "settings": {
      "mainField": "id",
      "defaultSortBy": "id",
      "defaultSortOrder": "ASC"
    },
    "list": ["id", "title", "parent", "slug"]
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "layouts": {
        "size": 12,
        "position": 1
      },
      "metadatas": {
        "label": "Naam",
        "description": "De naam van het restaurant"
      }
    },
    "parent": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::page.page",
      "layouts": {
        "size": 12,
        "position": 0,
        "hidden": true
      },
      "metadatas": {
        "label": "Naam",
        "description": "De naam van het restaurant"
      }
    }
    // ... other attributes ...
  }
}
```

> **Note:**  
> If you set `"hidden": true` in an attribute's `layouts`, that field will be excluded from the Content Manager edit view.  
> Remove `"hidden": true` to make the field visible again.

---

## How it works

- On Strapi bootstrap, the plugin:
  1. Fetches the current Content Manager configuration for each content type.
  2. Checks your schema for `layouts` and `metadatas` on each attribute.
  3. Checks for a top-level `content-manager` block for `settings` and `list` columns.
  4. Updates only the relevant parts of the configuration (size, position, label, description, settings, list, etc.).
  5. Deep merges changes, preserving all other settings and admin UI customizations.

---

## Supported Layout Fields

- `size`: Field width in the edit view (1–12).
- `position`: Order of fields in the edit view (lower = earlier).
- `hidden`: If `true`, the field will not appear in the edit view.

## Supported Metadata Fields

- `label`: Field label in the UI.
- `description`: Field description/help text.
- `placeholder`, `visible`, `editable`, `mainField` (for advanced use).

## Supported Content Manager Options

- `settings`:
  - `mainField`: Main field for relations/search.
  - `defaultSortBy`: Default sort column.
  - `defaultSortOrder`: Default sort order (`ASC`/`DESC`).
  - ...and any other Content Manager settings supported by Strapi.
- `list`:
  - Array of field names to show as columns in the list view.

---

## Why use this?

- **Centralize UI config** in your schema files.
- **Automate layout and metadata** for new environments or deployments.
- **Avoid manual UI tweaks** after every deploy or schema change.
- **Full control** over Content Manager list columns and settings from code.

---

## Installation

1. Place this plugin in your Strapi project's `plugins` directory.
2. Add `layouts`, `metadatas`, and a `content-manager` block to your schema as shown above.
3. Restart Strapi.

---

## License

MIT
