<#
.SYNOPSIS
  Script PowerShell para agregar, commitear y pushear cambios siguiendo reglas de inclusión/exclusión.
.DESCRIPTION
  - Incluye: pom.xml, src/**, frontend/**, .github/workflows/**
  - Excluye por nombre: INSTRUCC, GUIA, HOWTO, PASO, SETUP, FRONTEND, EJECUCION, PRUEBAS, CI
  - README*: excluir salvo que sea README que explique el dominio (ubicación, nombre o contenido)
  - Docs de dominio en docs/ o documentación/: incluir si nombre o contenido contiene MODELO|DOMINIO|DDL|DER|DIAGRAMA|CONTRATO
#>

# Fallar rápido en errores
$ErrorActionPreference = 'Stop'

# Comprobar repo Git
try {
    git rev-parse --is-inside-work-tree 2>$null | Out-Null
} catch {
    Write-Error "No parece ser un repositorio Git. Ejecutá dentro del repo."
    exit 1
}

# Expresiones regex (case-insensitive)
$exclRegex = '(instrucc|guia|howto|paso|setup|frontend|ejecucion|pruebas|ci)'
$dominioRegex = '(modelo|dominio|ddl|der|diagrama|contrato)'

$pathsToScan = @('pom.xml','src','frontend','.github\workflows')

$files = New-Object System.Collections.Generic.List[string]

# Helper: Decide si un README debe incluirse por ser de dominio
function Is-Readme-Dominio {
    param([string]$fullPath)
    $lowerPath = $fullPath.ToLower()
    $name = [IO.Path]::GetFileName($fullPath).ToLower()

    # Si está en docs/ o documentación/ revisar nombre o contenido
    if ($lowerPath -like '*\docs\*' -or $lowerPath -like '*\documentación\*' -or $lowerPath -like '*\documentacion\*') {
        if ($name -match $dominioRegex) { return $true }
        try {
            $content = Get-Content -LiteralPath $fullPath -Raw -ErrorAction Stop
            if ($content -match $dominioRegex) { return $true }
        } catch {
            return $false
        }
        return $false
    }

    # Si nombre contiene palabra de dominio
    if ($name -match $dominioRegex) { return $true }

    # Si contenido contiene palabra de dominio
    try {
        $content = Get-Content -LiteralPath $fullPath -Raw -ErrorAction Stop
        if ($content -match $dominioRegex) { return $true }
    } catch {
        return $false
    }

    return $false
}

# Helper: agregar archivo si no coincide con exclusión; permite excepciones para README
function Add-IfValido($path) {
    if (-not (Test-Path $path -PathType Leaf)) { return }
    $name = [IO.Path]::GetFileName($path).ToLower()

    # Exclusiones duras por nombre (no README)
    if ($name -match $exclRegex) { return }

    # README*: ver excepción de dominio
    if ($name -match '^readme') {
        if (Is-Readme-Dominio -fullPath $path) {
            $files.Add((Resolve-Path -LiteralPath $path).Path)
        } else {
            return
        }
        return
    }

    # Si pasa filtros, agregar
    $files.Add((Resolve-Path -LiteralPath $path).Path)
}

# 1) pom.xml
if (Test-Path 'pom.xml' -PathType Leaf) {
    Add-IfValido 'pom.xml'
}

# 2) Recorrer src, frontend, .github\workflows
foreach ($root in $pathsToScan) {
    if (Test-Path $root) {
        Get-ChildItem -Path $root -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
            Add-IfValido $_.FullName
        }
    }
}

# 3) Docs de dominio en docs/ y documentación/
foreach ($droot in @('docs','documentación','documentacion')) {
    if (Test-Path $droot) {
        Get-ChildItem -Path $droot -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
            $name = $_.Name.ToLower()
            $full = $_.FullName
            $isDomainByName = ($name -match $dominioRegex)
            $isDomainByContent = $false
            try {
                $txt = Get-Content -LiteralPath $full -Raw -ErrorAction Stop
                if ($txt -match $dominioRegex) { $isDomainByContent = $true }
            } catch {
                $isDomainByContent = $false
            }
            if ( ($isDomainByName -or $isDomainByContent) -and -not ($name -match $exclRegex) ) {
                $files.Add((Resolve-Path -LiteralPath $full).Path)
            }
        }
    }
}

# Quitar duplicados y normalizar rutas
$files = $files | Select-Object -Unique

if ($files.Count -eq 0) {
    Write-Host "No se encontraron archivos válidos para agregar según las reglas. Nada para commitear."
    exit 0
}

Write-Host "Archivos a git add (cantidad: $($files.Count))"
foreach ($f in $files) { Write-Host " - $f" }

# Ejecutar git add por cada archivo (mantener seguridad con paths que contengan espacios)
foreach ($f in $files) {
    git add -- "$f"
}

# Contar staged
$staged = git diff --cached --name-only | Measure-Object -Line
$stagedCount = $staged.Lines

if ($stagedCount -eq 0) {
    Write-Host "No hay archivos staged luego del git add. Nada que commitear."
    exit 0
}

# Commit con mensaje EXACTO
try {
    git commit -m "Stockeate v2.0"
} catch {
    Write-Error "git commit falló: $_"
    exit 1
}

# Detectar rama actual
$branch = git rev-parse --abbrev-ref HEAD

# Intentar push; si falla por upstream, configurar upstream
try {
    git push
} catch {
    Write-Host "Push falló, intentando configurar upstream y reintentar..."
    git push -u origin $branch
}

# Resumen final
Write-Host "`nCommit y push finalizados."
Write-Host "Archivos staged en el commit: $stagedCount"
Write-Host "Listado de archivos en el último commit:"
git --no-pager show --name-only --pretty="" HEAD

exit 0