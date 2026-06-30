# Product Database Guide

All products are stored in:

`data/products.json`

Each product now supports a professional structure:

```json
{
  "id": "PRD-0001",
  "slug": "3d-floor-mats-avatr12",
  "vehicle": "avatr12",
  "vehicleName": "AVATR 12",
  "name": "3D Floor Mats",
  "category": "Interior",
  "price": 299,
  "salePrice": null,
  "currency": "AED",
  "brand": "APEX Auto",
  "images": ["images/products/floor-mats-avatr12.jpg"],
  "stock": 25,
  "status": "in-stock",
  "featured": true,
  "compatibility": ["AVATR 12"],
  "description": "Full product description.",
  "shortDescription": "Short card description.",
  "tags": ["Interior", "AVATR 12"],
  "whatsappText": "Hello, I want to ask about 3D Floor Mats for AVATR 12."
}
```

## Status options
- `coming-soon`
- `in-stock`
- `out-of-stock`

## Image path
Put product photos inside:

`images/products/`

Then use:

`images/products/file-name.jpg`
