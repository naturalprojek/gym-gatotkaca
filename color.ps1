Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\Selogan_Lama\.gemini\gym-expert-system\logo.jpeg")
$bmp = New-Object System.Drawing.Bitmap($img)
$colors = @{}
for ($x = 0; $x -lt $bmp.Width; $x += 10) {
    for ($y = 0; $y -lt $bmp.Height; $y += 10) {
        $c = $bmp.GetPixel($x, $y)
        # Skip near white
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) { continue }
        # Skip near black (optional, but black can be part of the theme, so let's keep it for now)
        
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
        if (-not $colors.ContainsKey($hex)) {
            $colors[$hex] = 0
        }
        $colors[$hex]++
    }
}
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | Format-Table -AutoSize
