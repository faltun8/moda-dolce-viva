export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{
        type: 'image',
        options: {
          hotspot: true,
        }
      }],
      options: {
        hotspot: true,
      }
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 90,
      }
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'details',
      title: 'Details',
      type: 'string',
    },
    {
      name: 'discount',
      title: 'Discount',
      type: 'number',
    },
    {
      name: 'isHighlighted',
      title: 'Is Highlighted?',
      type: 'boolean',
      initialValue: false,
    },
    {
      title: "Rating Star",
      name: "ratingStar",
      type: "number",
      validation: Rule => Rule.required().min(0).max(10),
      initialValue: 10,
    },
    {
      title: "Review Count",
      name: "rewiewCount",
      type: "number",
      validation: Rule => Rule.required().min(0),
    },
    {
      title: "Stock info",
      name: "stockInfo",
      type: "document",
      fields: [
        {
          title: "S",
          name: "S",
          type: "number",
          validation: Rule => Rule.required().min(0).max(100),
          initialValue: 0,
        },
        {
          title: "M",
          name: "M",
          type: "number",
          validation: Rule => Rule.required().min(0).max(100),
          initialValue: 0,
        },
        {
          title: "L",
          name: "L",
          type: "number",
          validation: Rule => Rule.required().min(0).max(100),
          initialValue: 0,
        },
        {
          title: "XL",
          name: "XL",
          type: "number",
          validation: Rule => Rule.required().min(0).max(100),
          initialValue: 0,
        },
      ]
    },
    {
      title: "Filters",
      name: "filters",
      type: "document",
      fields: [
        {
          title: "Gender",
          name: "gender",
          type: "string",
          validation: Rule => Rule.required(),
          options: {
            list: [
              { title: 'Male', value: 'male' },
              { title: 'Female', value: 'female' },
              { title: 'Unisex', value: 'unisex' },
            ],
          },
        },
      ]
    }
  ]
}