//@ts-nocheck
const allowedListKeys = ['label', 'searchable', 'sortable', 'mainField'];
const allowedEditKeys = ['label', 'description', 'placeholder', 'visible', 'editable', 'mainField'];

/**
 * Filters an object to only include allowed keys.
 */
function filterKeys(obj, allowed) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => allowed.includes(k)));
}

/**
 * Updates the size of a field in layouts.edit if defined in the schema.
 */
function updateEditLayoutSize(editLayout, attr, size) {
  return editLayout.map((row) =>
    row.map((field) => (field.name === attr ? { ...field, size } : field))
  );
}

/**
 * Sorts the edit layout fields by their position defined in the schema.
 */
function buildEditLayoutFromSchema(attributes) {
  const fields = Object.entries(attributes)
    .filter(([_, config]) => !config.layouts?.hidden)
    .map(([name, config]) => ({
      name,
      size: config.layouts?.size ?? 12,
      position: config.layouts?.position ?? 1000,
    }));

  fields.sort((a, b) => a.position - b.position);

  return fields.map((field) => [{ name: field.name, size: field.size }]);
}

/**
 * Updates the metadatas for a given attribute based on schema config.
 */
function updateMetadatas(existingMetadatas, attr, config) {
  if (!existingMetadatas[attr]) existingMetadatas[attr] = { edit: {}, list: {} };

  if (config.metadatas) {
    if (config.metadatas.label || config.metadatas.description) {
      existingMetadatas[attr].edit = {
        ...existingMetadatas[attr].edit,
        ...filterKeys(config.metadatas, allowedEditKeys),
      };
    }
    if (config.metadatas.label) {
      existingMetadatas[attr].list = {
        ...existingMetadatas[attr].list,
        ...filterKeys(config.metadatas, allowedListKeys),
      };
    }
  }
  return existingMetadatas;
}

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const contentTypes = Object.values(strapi.contentTypes);

  for (const ct of contentTypes) {
    if (ct.plugin) continue;

    const store = strapi.store({
      type: 'plugin',
      name: 'content_manager_configuration',
      key: `content_types::${ct.uid}`,
    });

    const existing = await store.get();

    if (!existing) {
      continue;
    }

    const updated = JSON.parse(JSON.stringify(existing));

    for (const [attr, config] of Object.entries(ct.attributes)) {
      if (config.layouts?.size) {
        updated.layouts.edit = updateEditLayoutSize(
          updated.layouts.edit,
          attr,
          config.layouts.size
        );
      }

      updateMetadatas(updated.metadatas, attr, config);
    }

    updated.layouts.edit = buildEditLayoutFromSchema(ct.attributes);

    const customCM = ct['content-manager'] || {};

    if (customCM.settings) {
      updated.settings = { ...updated.settings, ...customCM.settings };
    }
    if (customCM.list) {
      updated.layouts.list = [...customCM.list];
    }

    await store.set({ value: updated });
  }
};

export default bootstrap;
