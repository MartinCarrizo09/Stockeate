#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Script para agregar, commitear y pushear los archivos relevantes como "Stockeate v2.0"
# Reglas (actualizadas):
# - INCLUIR: pom.xml, src/**, frontend/**, .github/workflows/**
# - EXCLUIR por nombre (case-insensitive): INSTRUCC, GUIA, HOWTO, PASO, SETUP, FRONTEND, EJECUCION, PRUEBAS, CI
# - README*: excluir salvo si es un README que explica el dominio:
#     -> incluir README sólo si (a) está dentro de docs/ o documentación/ OR
#                         (b) el nombre del archivo contiene una palabra de dominio OR
#                         (c) el contenido del archivo contiene una palabra de dominio
# - Docs de dominio: aceptar archivos en docs/ o documentación/ cuyo nombre contenga
#   modelo|dominio|ddl|der|diagrama|contrato (case-insensitive)

# Verificar repo git
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "No parece un repositorio Git. Inicializá uno o ejecutá esto dentro del repo."
  exit 1
fi

# Regex en minúsculas para exclusión por nombre (nota: 'readme' tratado aparte)
EXCL_NAME_REGEX='(instrucc|guia|howto|paso|setup|frontend|ejecucion|pruebas|ci)'

# Regex para detectar archivos de dominio (nombre o contenido)
DOMINIO_REGEX='(modelo|dominio|ddl|der|diagrama|contrato)'

# Array para recolectar archivos a agregar
declare -a ARCHIVOS=()

# Helper: decidir si un README es dominio por ubicación/nombre/contenido
es_readme_dominio() {
  local f="$1"
  local f_lower path_lower name_lower
  path_lower="$(echo "$f" | tr '[:upper:]' '[:lower:]')"
  name_lower="$(basename "$f" | tr '[:upper:]' '[:lower:]')"

  # 1) si está en docs/ o documentación/ => comprobar nombre o contenido
  if [[ "$path_lower" == *"/docs/"* ]] || [[ "$path_lower" == *"/documentación/"* ]] || [[ "$path_lower" == *"/documentacion/"* ]]; then
    # si el nombre contiene palabra de dominio
    if [[ "$name_lower" =~ $DOMINIO_REGEX ]]; then
      return 0
    fi
    # o si el contenido contiene la palabra de dominio
    if grep -qiE "$DOMINIO_REGEX" "$f" 2>/dev/null; then
      return 0
    fi
    return 1
  fi

  # 2) Si el nombre del archivo contiene palabra de dominio (ej: README-DOMINIO.md)
  if [[ "$name_lower" =~ $DOMINIO_REGEX ]]; then
    return 0
  fi

  # 3) Si el contenido contiene palabra de dominio (ej: README.md que explica el dominio)
  if grep -qiE "$DOMINIO_REGEX" "$f" 2>/dev/null; then
    return 0
  fi

  return 1
}

# Helper: añadir archivo si cumple las reglas
añadir_si_valido() {
  local f="$1"
  # Sólo archivos regulares
  [ -f "$f" ] || return
  local base
  base="$(basename "$f" | tr '[:upper:]' '[:lower:]')"

  # Si coincide con exclusión dura (no README)
  if [[ "$base" =~ $EXCL_NAME_REGEX ]]; then
    return
  fi

  # Si es README*, tratarlo con excepción de dominio
  if [[ "$base" =~ ^readme ]]; then
    if es_readme_dominio "$f"; then
      ARCHIVOS+=("$f")
    else
      # excluimos README instructivo/operativo
      return
    fi
    return
  fi

  # Si pasa las anteriores, lo añadimos
  ARCHIVOS+=("$f")
}

# 1) Incluir pom.xml si existe
if [ -f "pom.xml" ]; then
  añadir_si_valido "pom.xml"
fi

# 2) Incluir archivos bajo src/, frontend/, .github/workflows/ respetando la exclusión por nombre
for root in src frontend .github/workflows; do
  if [ -d "$root" ]; then
    # recorrer archivos
    while IFS= read -r -d $'\0' file; do
      añadir_si_valido "$file"
    done < <(find "$root" -type f -print0 2>/dev/null)
  fi
done

# 3) Docs de dominio: buscar en docs/ y documentación/ (incluir only those matching dominio keywords)
for droot in docs documentación documentacion; do
  if [ -d "$droot" ]; then
    while IFS= read -r -d $'\0' file; do
      base="$(basename "$file" | tr '[:upper:]' '[:lower:]')"
      # incluir si nombre contiene palabra de dominio OR contenido la contiene, y no contiene keywords instruc.
      if ( [[ "$base" =~ $DOMINIO_REGEX ]] || grep -qiE "$DOMINIO_REGEX" "$file" 2>/dev/null ); then
        # además asegurarse que no sea instructivo por nombre
        if ! [[ "$base" =~ $EXCL_NAME_REGEX ]]; then
          ARCHIVOS+=("$file")
        fi
      fi
    done < <(find "$droot" -type f -print0 2>/dev/null)
  fi
done

# Normalizar lista: eliminar duplicados y mantener orden
if [ "${#ARCHIVOS[@]}" -gt 0 ]; then
  IFS=$'\n' read -r -d '' -a ARCHIVOS_UNIQ < <(printf "%s\n" "${ARCHIVOS[@]}" | awk '!seen[$0]++' && printf '\0')
  ARCHIVOS=("${ARCHIVOS_UNIQ[@]}")
fi

# Si no hay archivos para agregar, salir amablemente
if [ "${#ARCHIVOS[@]}" -eq 0 ]; then
  echo "No se encontraron archivos válidos para agregar según las reglas. Nada para commitear."
  exit 0
fi

# Mostrar resumen de lo que se va a agregar
echo "Archivos a 'git add' (cantidad: ${#ARCHIVOS[@]}):"
printf ' - %s\n' "${ARCHIVOS[@]}"

# Hacer git add de los archivos seleccionados (maneja espacios)
git add -- "${ARCHIVOS[@]}"

# Contar staged files
STAGED_COUNT=$(git diff --cached --name-only | wc -l | tr -d '[:space:]')

if [ "$STAGED_COUNT" -eq 0 ]; then
  echo "No hay cambios staged luego del git add. Nada que commitear."
  exit 0
fi

# Commit con mensaje EXACTO
git commit -m "Stockeate v2.0"

# Detectar rama actual
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Verificar si existe upstream configurado
if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
  echo "Haciendo push a origin/$BRANCH..."
  git push
else
  echo "No existe upstream para la rama '$BRANCH'. Configurando upstream y haciendo push..."
  git push -u origin "$BRANCH"
fi

# Resumen final
FINAL_STAGED=$(git diff --cached --name-only | wc -l | tr -d '[:space:]')
echo "Commit realizado y push completado. Archivos staged en el commit: $STAGED_COUNT"
echo "Listado de archivos commiteados:"
git --no-pager show --name-only --pretty="" HEAD

exit 0