# Instrucciones para Reemplazar el Logo

## 📝 Pasos para usar tu logo original:

### Opción 1: Reemplazar el archivo SVG (Recomendado)
1. Guarda tu logo original como `logo.png` en la carpeta `/public`
2. Actualiza las referencias en `index.html` de `logo.svg` a `logo.png`:
   - Navbar: línea ~11
   - Hero: línea ~40  
   - Footer: línea ~105

### Opción 2: Convertir PNG a SVG
Si prefieres mantener el SVG:
1. Convierte tu PNG a SVG usando herramientas como:
   - Convertio: https://convertio.co/png-svg/
   - CloudConvert: https://cloudconvert.com/
   - Adobe Express: https://www.adobe.com/express/

2. Reemplaza el contenido de `public/logo.svg` con tu SVG

### Archivos Donde Aparece el Logo:
- ✅ **Navbar** (esquina superior izquierda)
- ✅ **Hero Section** (centro, con animación flotante)
- ✅ **Footer** (inferior)

### Características del Logo:
- **Responsive**: Se adapta a todos los tamaños de pantalla
- **Animado**: En la sección hero, el logo tiene una animación suave flotante
- **Optimizado**: Los logotipos SVG son escalables sin perder calidad

## 🎨 Especificaciones Recomendadas:

| Ubicación | Tamaño Recomendado | Formato |
|-----------|-------------------|---------|
| Navbar | 40-50px altura | PNG/SVG |
| Hero | 400-600px | PNG/SVG |
| Footer | 50-60px altura | PNG/SVG |

## ✨ Notas Técnicas:

- El logo en el footer tiene un filtro `brightness(0) invert(1)` que lo invierte a blanco automáticamente
- Si tu logo tiene colores específicos en el footer, puedes editar `styles/main.css` línea ~243
- Los formatos SVG funcionan mejor para escalabilidad, PNG es mejor para logos fotográficos

---

**¿Necesitas ayuda?** El código está listo, solo reemplaza el archivo o las referencias! 🚀
