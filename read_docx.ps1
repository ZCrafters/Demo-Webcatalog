Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\Admin\Downloads\Guion_Exposicion_UML.docx')
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

$xml = [xml]$xmlText
# Extract paragraphs from the document XML
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$paragraphs = $xml.SelectNodes('//w:p', $ns)

foreach ($p in $paragraphs) {
    $text = ""
    $runs = $p.SelectNodes('.//w:t', $ns)
    foreach ($r in $runs) {
        $text += $r.InnerText
    }
    if ($text.Trim() -ne "") {
        Write-Output $text
    }
}
