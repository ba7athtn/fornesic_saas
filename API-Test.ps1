# Variables personnalisables
$baseUrl = "http://localhost:5000"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGMwNDIxNzE3M2Y0NWJkY2ViZGI2MzQiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzU3NzcxMjkzLCJpc3MiOiJiYTdhdGgtYXV0aCIsImF1ZCI6ImJhN2F0aC1hcGkiLCJqdGkiOiJhMDI2MDkyN2IyZWRiNWQ1ZDlkMjMxOTAwMTk2YTY2OSIsInJvbGVzIjpbImFkbWluIl0sInNjb3BlcyI6WyJvcmc6bWVtYmVyOmxpc3QiLCJvcmc6bWVtYmVyOmludml0ZSIsIm9yZzptZW1iZXI6cm9sZTp1cGRhdGUiLCJvcmc6cXVvdGE6dXBkYXRlIiwiYmlsbGluZzp2aWV3Il0sInN1YnNjcmlwdGlvbiI6ImZyZWUiLCJzdGF0dXMiOiJhY3RpdmUiLCJleHAiOjE3NTgzNzYwOTN9.bkqXfcjuccmdFojLf4DceUNzyMvLvxY_JoWJuQ4uUNQ"
$testImagePath = "E:\image-forensic-saas\backend\image.jpg"

# Collection pour stocker résultats tests
$results = @()

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [switch]$IsFileUpload,
        [string]$FileFieldName = 'image',
        [string]$FilePath = ''
    )
    Write-Host "`n$Method $Url"
    try {
        if ($IsFileUpload) {
            # Construire tableau d'arguments headers curl
            $headerArgs = @()
            foreach ($key in $Headers.Keys) {
                $headerArgs += "-H"
                $headerArgs += ($key + ": " + $Headers[$key])
            }
            $fileArg = "-F"
            $fileArg += ($FileFieldName + "=@" + $FilePath)

            $args = @("-v", "-X", $Method) + $headerArgs + @($fileArg, $Url)
            $result = & curl.exe @args 2>&1

            $content = $result -join "`n"
            Write-Host $content

            # Essayer de parser JSON
            try {
                $parsed = $content | ConvertFrom-Json
                return @{ Success = $true; Content = $parsed; Raw = $content }
            }
            catch {
                return @{ Success = $true; Content = $content; Raw = $content }
            }
        }
        elseif ($Body -ne $null) {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers -Body ($Body | ConvertTo-Json -Depth 5) -ContentType "application/json"
            return @{ Success = $true; Content = $response; Raw = $response }
        }
        else {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers
            return @{ Success = $true; Content = $response; Raw = $response }
        }
    }
    catch {
        Write-Warning "Erreur API: $_"
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# 1) Test connexion / login
$loginData = @{
    email = "ba7ath@proton.me"
    password = "Apostroph03?_1974*"
    rememberMe = $false
}
$result = Invoke-Api -Method "POST" -Url "$baseUrl/api/auth/login" -Headers @{ Authorization = "Bearer $token" } -Body $loginData
$results += @{ Name = "Login"; Result = $result }

if ($result.Success -and $result.Content.tokens.accessToken) {
    $token = $result.Content.tokens.accessToken
}

# 2) Test refresh token (si dispo)
if ($result.Success -and $result.Content.tokens.refreshToken) {
    $refreshResult = Invoke-Api -Method "POST" -Url "$baseUrl/api/auth/refresh" -Headers @{ Authorization = "Bearer $token" } -Body @{ refreshToken = $result.Content.tokens.refreshToken }
    $results += @{ Name = "Refresh Token"; Result = $refreshResult }
}

# 3) Test récupération profil
$profileResult = Invoke-Api -Method "GET" -Url "$baseUrl/api/auth/profile" -Headers @{ Authorization = "Bearer $token" }
$results += @{ Name = "Profile"; Result = $profileResult }

# 4) Test upload image simple
$uploadResult = Invoke-Api -Method "POST" -Url "$baseUrl/api/images/upload" -Headers @{ Authorization = "Bearer $token" } -IsFileUpload -FileFieldName "image" -FilePath $testImagePath
$results += @{ Name = "Upload Image"; Result = $uploadResult }

# Extraire imageId en cas de succès
$imageId = $null
if ($uploadResult.Success -and $uploadResult.Content.image -and $uploadResult.Content.image.id) {
    $imageId = $uploadResult.Content.image.id
}

# 5) Test téléchargement image (si id dispo)
if ($imageId) {
    $downloadUrl = "$baseUrl/api/images/$imageId/download"
    Write-Host "`nTéléchargement image $imageId ..."
    try {
        Invoke-WebRequest -Uri $downloadUrl -Headers @{ Authorization = "Bearer $token" } -OutFile "downloaded_$imageId.jpg"
        Write-Host "Image téléchargée dans downloaded_$imageId.jpg"
        $results += @{ Name = "Download Image"; Result = @{ Success = $true; File = "downloaded_$imageId.jpg" } }
    }
    catch {
        Write-Warning "Échec téléchargement: $_"
        $results += @{ Name = "Download Image"; Result = @{ Success = $false; Error = $_.Exception.Message } }
    }
}
else {
    Write-Warning "Aucun ID image pour test téléchargement."
    $results += @{ Name = "Download Image"; Result = @{ Success = $false; Error = "Pas d'ID image après upload" } }
}

# 6) Test liste images
$listResult = Invoke-Api -Method "GET" -Url "$baseUrl/api/images?page=1&limit=5" -Headers @{ Authorization = "Bearer $token" }
$results += @{ Name = "List Images"; Result = $listResult }

# Rapport synthétique des résultats
Write-Host "`n--- Résumé des tests API ---"
foreach ($entry in $results) {
    $name = $entry.Name
    $status = if ($entry.Result.Success) { "✅ Succès" } else { "❌ Échec" }
    Write-Host "$name : $status"
    if (-not $entry.Result.Success) {
        Write-Host "Erreur : $($entry.Result.Error)"
    }
}
