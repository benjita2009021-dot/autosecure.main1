# Backup & Restore Guide

## Current Backup: `backup-2026-02-04-working`

Este backup contiene el estado funcional del bot configurado para **ejecutarse localmente sin VPS**.

### Estado del Backup:
- ✅ Bot funcionando correctamente
- ✅ Token Discord en `.env` (seguro, no expuesto)
- ✅ Config: `novps: true` (sin VPS)
- ✅ Leaderboard: validación de propiedad de mensajes
- ✅ ButtonBuilder: validación de URLs
- ✅ Todas las dependencias instaladas

---

## ¿Cómo Rollback al Backup?

### Opción 1: Revertir cambios locales (recomendado)
```bash
cd C:\Users\Administrator\Desktop\Autosecure-main\Autosecure-main

# Ver cambios pendientes
git status

# Descartar cambios locales
git reset --hard HEAD

# Volver al backup
git checkout backup-2026-02-04-working

# Verificar que .env existe con el token
cat .env
```

### Opción 2: Revertir usando hash de commit
```bash
# Listar commits
git log --oneline | head -10

# Revertir a commit específico (reemplaza HASH)
git reset --hard HASH

# Hacer push a remoto si es necesario
git push origin main --force
```

---

## Cómo Arrancar el Bot Después del Restore:

```bash
cd C:\Users\Administrator\Desktop\Autosecure-main\Autosecure-main

# Limpiar procesos anteriores
taskkill /F /IM node.exe 2>$null

# Reinstalar dependencias si es necesario
npm install --omit=dev

# Arrancar el bot
node autosecure.js
```

---

## Archivos Clave para Rollback:

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `.env` | Token Discord seguro | ✅ Debe existir |
| `config.json` | `novps: true`, `tokens: [""]` | ✅ Restaurado |
| `autosecure.js` | Carga dotenv al inicio | ✅ Incluido |
| `mainbot/controllerbot.js` | Lee token de .env | ✅ Incluido |
| `mainbot/utils/leaderboardupdater.js` | Validación de propiedad | ✅ Incluido |
| `mainbot/events/interactionCreate/commands.js` | Validación de URL buttons | ✅ Incluido |

---

## Si Algo Falla:

1. **Error: "No token found"**
   - Verifica que `.env` exista y contenga: `DISCORD_TOKEN=tu_token_aqui`

2. **Error: "Cannot edit message"**
   - El backup ya incluye la validación. Limpia la DB si persiste.

3. **Error: "Link buttons must have a URL"**
   - El backup ya incluye la solución. Reinstala `node_modules` si persiste.

4. **Bot no inicia**
   - Mata todos los procesos: `taskkill /F /IM node.exe`
   - Reinstala dependencias: `npm install --omit=dev`
   - Intenta nuevamente: `node autosecure.js`

---

## VPS Desactivada

El backup está configurado para NO usar VPS:
```json
"novps": true
```

Si en el futuro necesitas re-activar VPS:
1. Cambia `novps` a `false` en `config.json`
2. Actualiza las rutas de API si es necesario
3. Sincroniza `.env` con la VPS

---

**Fecha del Backup:** 2026-02-04  
**Estado:** Bot funcionando localmente 24/7
