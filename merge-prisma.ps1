# merge-prisma.ps1
$output = "prisma/schema.prisma"

# Limpa o ficheiro de output
Get-Content "prisma/schema/base.prisma" | Set-Content $output
Add-Content $output ""
Get-Content "prisma/schema/enums.prisma" | Add-Content $output
Add-Content $output ""

# Junta todos os models por pasta
$folders = @("core", "catalog", "supplier", "cart", "wishlist", "orders", "marketing", "system")

foreach ($folder in $folders) {
    $path = "prisma/schema/$folder/*.prisma"
    $files = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
    if ($files) {
        foreach ($file in $files) {
            Get-Content $file.FullName | Add-Content $output
        }
    }
}

Write-Host "✅ Schema merged successfully to $output"