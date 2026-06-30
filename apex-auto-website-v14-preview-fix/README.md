# APEX Auto Website V5

This version includes the light theme and category/product structure for all vehicle pages.

## Run
Open this folder in VS Code, then right-click `index.html` and choose **Open with Live Server**.

## Included vehicle pages
- AVATR 12
- AVATR 11
- ROX 01
- ROX ADAMAS
- LEOPARD 5
- LEOPARD 7
- LEOPARD 8

## Product data
All placeholder product data is in:
`data/products.json`

When you get real products/photos, update that file and place product photos in:
`images/products/`


## V6 Update
Product data has been upgraded to a professional database structure.

See:
`PRODUCT-DATABASE-GUIDE.md`


## V7 Update
Added a premium product configurator popup.

Test it:
1. Open AVATR 12 page
2. Go to Interior
3. Click "Choose Options" on 3D TPE Floor Mats
4. Choose color, material, package, and quantity
5. Test WhatsApp order


## V8 Update
Added package option:
- Full TPE Trunk Mat

Supplier name:
- Avita 12 [Color Notes] Full TPE Trunk Mat

When selected, the popup preview changes to the trunk mat image.


## V9 Update
Added visual preview images for all material and package options.
Selecting any package now changes the large preview image.


## V10 Update
Fixed duplicated package options.

Package options are now:
- Single Layer Floor Mats
- Double Layer Floor Mats
- Single Floor Mats + Trunk Mat
- Double Layer Floor Mats + Trunk Mat
- Full TPE Trunk Mat Only

Preview behavior fixed:
- Material selection previews material image.
- Trunk package selection previews trunk mat image.


## V11 Update
Rebuilt the floor mat configurator using real supplier SKU options.
Flow: Choose Color -> Choose Material -> Choose Package.


## V12 Update
Removed Step 3 package selector from 3D TPE Floor Mats.

The floor mat configurator is now:
1. Choose Color
2. Choose Material
3. Quantity

The preview image on the left is sticky while scrolling the options.

Added Full TPE Trunk Mat as a separate product.


## V13 Update
Added a universal product engine.
- Products can define options in products.json.
- The configurator automatically shows colors/materials/options only when available.
- Trunk mat now has its own color selector.
- Left preview stays sticky while scrolling.


## V14 Update
Fixed preview switching for Smoky White and Dark Black.
Dependent material images now correctly use the selected color.
